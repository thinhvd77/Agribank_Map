# Bản đồ mạng lưới Agribank

Dự án Next.js độc lập hiển thị 5 điểm giao dịch của Agribank Chi nhánh Bắc Thành phố Hồ Chí Minh. Nền bản đồ là GeoJSON cục bộ, không phụ thuộc máy chủ tile khi website hoạt động.

## Yêu cầu

- Node.js 20.9 trở lên
- npm

## Chạy trên máy cá nhân

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Build và tự host

```bash
npm run build
npm start
```

Mặc định server chạy ở cổng `3000`. Có thể đổi cổng bằng biến môi trường `PORT`.

Khi đưa lên domain riêng, sao chép `.env.example` thành `.env.local` và đổi `SITE_URL`:

```env
SITE_URL=https://map.example.com
```

Sau đó build lại để canonical URL và ảnh chia sẻ dùng đúng domain.

## Dữ liệu bản đồ

Snapshot đang dùng nằm tại `public/data/branch-network.geojson`. Trình duyệt chỉ tải file này từ chính website.

Khi cần làm mới dữ liệu từ OpenStreetMap:

```bash
npm run map:refresh
```

Lệnh làm mới gọi Overpass một lần và ghi lại snapshot. Có thể chọn endpoint và User-Agent khác bằng `OVERPASS_URL` và `OVERPASS_USER_AGENT`.

## Kiểm tra

```bash
npm run lint
npm test
```

`npm test` build bằng Next.js và kiểm tra cấu hình local, dữ liệu GeoJSON cùng nội dung chính.
