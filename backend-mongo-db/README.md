# E-Ticaret Node.js Sunucusu

## Başlangıç

1. MongoDB'yi başlatın ve .env dosyasındaki MONGO_URI'yi güncelleyin.
2. Bağımlılıkları yüklemek için:
   ```powershell
   npm install
   ```
3. Sunucuyu başlatmak için:
   ```powershell
   node index.js
   ```

## API Uç Noktaları
- `POST /api/auth/register` : Kullanıcı kaydı
- `POST /api/auth/login` : Kullanıcı girişi
- `GET /api/products` : Ürünleri listele
- `POST /api/products` : Ürün ekle
- `GET /api/orders` : Siparişleri listele
- `POST /api/orders` : Sipariş oluştur

## Ortam Değişkenleri
- `.env` dosyasını düzenleyin:
  - `MONGO_URI`: MongoDB bağlantı adresi
  - `PORT`: Sunucu portu
  - `JWT_SECRET`: Token için gizli anahtar

## Klasör Yapısı
- `models/` : Mongoose modelleri
- `routes/` : API route dosyaları
- `index.js` : Ana sunucu dosyası

---
Geliştirme için öneri: Kimlik doğrulama ve yetkilendirme middleware ekleyebilirsiniz.
