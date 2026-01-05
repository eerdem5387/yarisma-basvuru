# 🔐 Production Admin Kullanıcısı Oluşturma

Production'da (Vercel) admin kullanıcısını oluşturmak için iki yöntem var:

## Yöntem 1: Local'den Production Database'e (Önerilen)

### Adımlar:

1. **Local `.env.local` dosyanızı geçici olarak production DATABASE_URL ile güncelleyin:**

```bash
# .env.local dosyasını açın ve DATABASE_URL'i production URL'si ile değiştirin
DATABASE_URL="postgresql://neondb_owner:npg_B4StFYT1RQnC@ep-dry-bar-ahaqz7h3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
ADMIN_EMAIL="admin@yarisma-basvuru.com"
ADMIN_PASSWORD="GucluBirSifre123!@#"
```

2. **Admin kullanıcısını oluşturun:**

```bash
npm run create-admin
```

3. **DATABASE_URL'i tekrar local'e çevirin** (isteğe bağlı, local development için)

## Yöntem 2: Vercel Terminal'den

1. Vercel Dashboard → Projeniz → **Deployments**
2. Son deployment'a tıklayın
3. **Functions** veya **Logs** sekmesine gidin
4. Terminal erişimi varsa:

```bash
# Environment variables'ları kontrol edin
echo $DATABASE_URL
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD

# Admin oluşturun
npm run create-admin
```

## ⚠️ Önemli Kontroller

### Vercel Environment Variables

Vercel Dashboard → Settings → Environment Variables'da şunlar olmalı:

✅ **DATABASE_URL**
```
postgresql://neondb_owner:npg_B4StFYT1RQnC@ep-dry-bar-ahaqz7h3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

✅ **NEXTAUTH_URL**
```
https://your-app.vercel.app
```
(Vercel'deki gerçek URL'nizi kullanın)

✅ **NEXTAUTH_SECRET**
```
8LYJU3fvZL/chFZM95/WxTdD/I9vrNvOD6Teul+pRjM=
```

✅ **ADMIN_EMAIL**
```
admin@yarisma-basvuru.com
```

✅ **ADMIN_PASSWORD**
```
GucluBirSifre123!@#
```

## 🔍 Sorun Giderme

### 500 Error Alıyorsanız:

1. **NEXTAUTH_SECRET kontrol edin:**
   - Vercel Dashboard → Environment Variables
   - `NEXTAUTH_SECRET` var mı?
   - Değer doğru mu?

2. **NEXTAUTH_URL kontrol edin:**
   - Production URL'niz ile eşleşiyor mu?
   - `https://` ile başlıyor mu?

3. **Admin kullanıcısı var mı?**
   - Yöntem 1 veya 2 ile oluşturun

4. **Database bağlantısı:**
   - `DATABASE_URL` doğru mu?
   - Neon database aktif mi?

## ✅ Test

Admin kullanıcısını oluşturduktan sonra:

1. `https://your-app.vercel.app/admin/login` adresine gidin
2. Email: `admin@yarisma-basvuru.com`
3. Şifre: `GucluBirSifre123!@#`
4. Giriş yapın

Başarılar! 🚀

