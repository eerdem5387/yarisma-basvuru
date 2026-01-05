import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { basvuruSchema } from "@/lib/validations"
import { z } from "zod"
import { put } from "@vercel/blob"

// Rate limiting için basit bir in-memory cache
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)
  
  if (!limit || now > limit.resetTime) {
    // Her IP için 15 dakikada maksimum 3 başvuru
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + 15 * 60 * 1000
    })
    return true
  }
  
  if (limit.count >= 3) {
    return false
  }
  
  limit.count++
  return true
}

export async function POST(request: Request) {
  try {
    // Rate limiting kontrolü
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Çok fazla başvuru yaptınız. Lütfen 15 dakika sonra tekrar deneyiniz." },
        { status: 429 }
      )
    }

    // FormData parse et
    const formData = await request.formData()
    
    // Form verilerini topla
    const formDataObj: any = {}
    formData.forEach((value, key) => {
      if (key !== 'dosya') {
        formDataObj[key] = value.toString()
      }
    })
    
    // Validasyon
    const validatedData = basvuruSchema.parse(formDataObj)
    
      // Dosya yükleme işlemi (Vercel Blob Storage)
      let dosyaUrl: string | null = null
      let dosyaAdi: string | null = null
      
      const dosya = formData.get('dosya') as File | null
      if (dosya && dosya.size > 0) {
        // Dosya boyutu kontrolü (1MB)
        if (dosya.size > 1 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Dosya boyutu 1MB'dan büyük olamaz." },
            { status: 400 }
          )
        }
        
        // Dosya tipi kontrolü
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ]
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.pptx']
        const fileExtensionCheck = '.' + dosya.name.split('.').pop()?.toLowerCase()
        
        if (!allowedTypes.includes(dosya.type) && !allowedExtensions.includes(fileExtensionCheck)) {
          return NextResponse.json(
            { error: "Sadece PDF, Word (.doc, .docx) veya PowerPoint (.pptx) dosyaları yüklenebilir." },
            { status: 400 }
          )
        }
        
        // Dosya adını oluştur (TC + timestamp + orijinal uzantı)
        const timestamp = Date.now()
        const fileExtension = dosya.name.split('.').pop() || 'pdf'
        dosyaAdi = `${validatedData.ogrenciTc}_${timestamp}.${fileExtension}`
        const blobPath = `kompozisyonlar/${dosyaAdi}`
        
        // Vercel Blob Storage'a yükle
        const blob = await put(blobPath, dosya, {
          access: 'public',
          contentType: dosya.type || 'application/pdf',
        })
        
        dosyaUrl = blob.url
      } else {
        return NextResponse.json(
          { error: "Kompozisyon dosyası yüklenmesi zorunludur." },
          { status: 400 }
        )
      }
    
    // Telefon numaraları zaten 10 hane olarak geliyor (frontend'de kontrol ediliyor)
    const babaCepTel = validatedData.babaCepTel
    const anneCepTel = validatedData.anneCepTel
    
    // TC Kimlik No ile daha önce başvuru yapılmış mı kontrol et
    const existingBasvuru = await prisma.basvuru.findUnique({
      where: { ogrenciTc: validatedData.ogrenciTc }
    })
    
    if (existingBasvuru) {
      return NextResponse.json(
        { error: "Bu TC Kimlik No ile daha önce başvuru yapılmış." },
        { status: 400 }
      )
    }
    
    // Başvuruyu kaydet
    const basvuru = await prisma.basvuru.create({
      data: {
        ...validatedData,
        babaCepTel,
        anneCepTel,
        dosyaUrl,
        dosyaAdi,
      }
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Başvurunuz başarıyla alındı. Teşekkür ederiz.",
        id: basvuru.id 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Formu eksiksiz ve doğru doldurunuz.", details: error.issues },
        { status: 400 }
      )
    }
    
    // Prisma connection errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Bu TC Kimlik No ile daha önce başvuru yapılmış." },
          { status: 400 }
        )
      }
      if (error.code === 'P1001' || error.code === 'P1002') {
        return NextResponse.json(
          { error: "Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyiniz." },
          { status: 503 }
        )
      }
    }
    
    console.error("Başvuru hatası:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: "Başvuru kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.",
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

