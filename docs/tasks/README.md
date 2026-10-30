# Kế hoạch công việc — Góp Gạo (GoSplit) MVP

Danh sách công việc để xây dựng MVP theo [requirements](../requirements/README.md). Mã trong ngoặc như (R19) là mã quy tắc nghiệp vụ trong requirements.

Thứ tự làm: chốt requirements (mục 0) → chốt giao diện (mục 1) → code (từ mục 2) theo các giai đoạn trong [lộ trình](00-lo-trinh.md).

Đánh dấu hoàn thành bằng cách đổi `- [ ]` thành `- [x]`.

## Các file

| File | Mục |
|---|---|
| [00-lo-trinh.md](00-lo-trinh.md) | Lộ trình code: giai đoạn, tuần đầu, cấu trúc thư mục, route, quy ước |
| [01-chuan-bi.md](01-chuan-bi.md) | 0. Chốt requirements · 1. Chốt giao diện |
| [02-nen-tang.md](02-nen-tang.md) | 2. Khởi tạo dự án → 11. Edit lock |
| [03-tinh-nang.md](03-tinh-nang.md) | 12. Kế hoạch → 23. Job định kỳ |
| [04-phat-hanh.md](04-phat-hanh.md) | 24. Kiểm thử và phát hành · Sau MVP |

## Tech stack

| Phần | Lựa chọn |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript, Node 24 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Tìm kiếm không dấu, gần đúng | PostgreSQL `unaccent` + `pg_trgm` |
| Auth | Better Auth (Google + email và mật khẩu) |
| UI | Tailwind CSS + shadcn/ui |
| Theme | Theme theo plan: CSS variables + hình minh họa |
| Ảnh preview link | next/og |
| Lưu ảnh tải lên | Cloudflare R2, bucket riêng tư (hoặc Vercel Blob nếu có chế độ riêng tư) |
| Xử lý ảnh | sharp |
| Đọc mã QR khi tải ảnh | zxing-wasm |
| Đa ngôn ngữ | next-intl |
| App trên điện thoại | PWA (cài web app lên màn hình chính) |
| Validation | Zod + React Hook Form |
| Tính tiền | decimal.js |
| Email | Resend |
| Rate limit | Upstash Redis (`@upstash/ratelimit`) |
| Chống bot | Vercel Firewall + Cloudflare Turnstile |
| Job định kỳ | Vercel Cron |
| Export ảnh | html-to-image |
| Test | Vitest (unit) + Playwright (E2E) |
| Hosting | Vercel |
