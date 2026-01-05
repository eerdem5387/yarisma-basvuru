# Vercel Environment Variables Kurulumu

## 🔴 KRİTİK: AUTH_SECRET Hatası

Production'da `MissingSecret` hatası alıyorsanız, Vercel'de environment variable'ları set etmeniz gerekiyor.

## Adım Adım Kurulum

### 1. Vercel Dashboard'a Giriş Yapın
- https://vercel.com/dashboard adresine gidin
- Projenizi seçin

### 2. Environment Variables Ekleme
1. **Settings** sekmesine tıklayın
2. Sol menüden **Environment Variables** seçin
3. Aşağıdaki değişkenleri ekleyin:

### 3. Gerekli Environment Variables

#### ✅ AUTH_SECRET (ZORUNLU)
```
Name: AUTH_SECRET
Value: 9vwsthGxEhFTTz+bt1Hn389KFYPrJ48GLhTLvmMzHNs=
Environment: Production, Preview, Development (hepsini seçin)
```

**VEYA**

```
Name: NEXTAUTH_SECRET
Value: 9vwsthGxEhFTTz+bt1Hn389KFYPrJ48GLhTLvmMzHNs=
Environment: Production, Preview, Development (hepsini seçin)
```

#### ✅ NEXTAUTH_URL (ZORUNLU)
```
Name: NEXTAUTH_URL
Value: https://yarisma.leventokullari.com
Environment: Production
```

Preview ve Development için:
```
Name: NEXTAUTH_URL
Value: http://localhost:3000
Environment: Preview, Development
```

#### ✅ DATABASE_URL (ZORUNLU)
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_TeK0obnhLEH3@ep-curly-king-a4fn8i9l-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development (hepsini seçin)
```

#### ✅ ADMIN_EMAIL (OPSİYONEL - Admin oluşturmak için)
```
Name: ADMIN_EMAIL
Value: admin@yarisma-basvuru.com
Environment: Production, Preview, Development (hepsini seçin)
```

#### ✅ ADMIN_PASSWORD (OPSİYONEL - Admin oluşturmak için)
```
Name: ADMIN_PASSWORD
Value: Admin123!@#
Environment: Production, Preview, Development (hepsini seçin)
```

#### ✅ BLOB_READ_WRITE_TOKEN (Vercel Blob Storage için)
```
Name: BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_xxxxx (Vercel Blob Storage oluşturduğunuzda otomatik oluşur)
Environment: Production, Preview, Development (hepsini seçin)
```

### 4. Değişkenleri Kaydetme
- Her değişkeni ekledikten sonra **Save** butonuna tıklayın
- Tüm değişkenleri ekledikten sonra **Redeploy** yapın

### 5. Redeploy
1. **Deployments** sekmesine gidin
2. Son deployment'ın yanındaki **⋯** (üç nokta) menüsüne tıklayın
3. **Redeploy** seçin
4. **Use existing Build Cache** seçeneğini kapatın (environment variable'lar build time'da da gerekebilir)
5. **Redeploy** butonuna tıklayın

## ✅ Kontrol Listesi

Deployment sonrası kontrol edin:

- [ ] `AUTH_SECRET` veya `NEXTAUTH_SECRET` set edildi mi?
- [ ] `NEXTAUTH_URL` production URL'i ile eşleşiyor mu?
- [ ] `DATABASE_URL` doğru mu?
- [ ] Tüm environment variable'lar **Production** environment'ında set edildi mi?
- [ ] Redeploy yapıldı mı?

## 🔍 Hata Kontrolü

Hata devam ederse:

1. **Vercel Dashboard → Deployments → Son Deployment → Functions** sekmesine gidin
2. `/api/auth/[...nextauth]` fonksiyonunun loglarını kontrol edin
3. Environment variable'ların doğru set edildiğinden emin olun

## 📝 Notlar

- Environment variable'ları ekledikten sonra **mutlaka redeploy** yapmanız gerekir
- `AUTH_SECRET` ve `NEXTAUTH_SECRET` aynı anda set edilebilir, kod önce `AUTH_SECRET`'i kontrol eder
- Production'da `NEXTAUTH_URL` mutlaka production domain'inizi göstermelidir
- Secret key'ler güvenlik için production'da farklı olmalıdır

