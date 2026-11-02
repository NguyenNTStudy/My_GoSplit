# Lộ trình phát triển

Requirements, data model và wireframe (điện thoại và desktop) đã chốt. File này chia việc code thành các giai đoạn; mỗi giai đoạn kết thúc bằng một bản chạy được trên Vercel preview. Số mục (2–24) trỏ về checklist chi tiết trong [02](02-nen-tang.md), [03](03-tinh-nang.md), [04](04-phat-hanh.md). Wireframe: [canvas](https://claude.ai/artifact/6iUe9YoLbxwwiQHG7R47o9), mở đầu bằng Sơ đồ luồng; màn điện thoại và màn web ở hai trang riêng, xếp theo cùng luồng.

## Nguyên tắc

1. **Làm theo lát dọc.** Mỗi giai đoạn làm trọn một nhóm tính năng: database → `src/domain` → server → giao diện → test. Không làm hết database rồi mới làm giao diện. Checklist 02–04 vẫn chia theo lớp; lộ trình chọn mục nào làm ở giai đoạn nào.
2. **Logic trước giao diện.** Tính tiền, làm tròn, ngày và phân quyền viết bằng TypeScript thuần trong `src/domain`, có unit test theo mã rule, rồi mới gắn vào màn hình.
3. **Điện thoại và desktop trong cùng giai đoạn.** Mỗi màn làm theo wireframe điện thoại (A, G, K) rồi desktop (GD) ngay sau, không dồn desktop về cuối.
4. **Giai đoạn xong khi** preview deploy chạy và các E2E tương ứng trong mục 24 đều qua.

## Các giai đoạn

| GĐ | Mục tiêu | Mục checklist | Wireframe | Xong khi |
|---|---|---|---|---|
| 0 | Khởi động | 2; khung của 5, 6, 7 | — | CI xanh (lint, typecheck, unit test); preview mở được trang tiếng Việt và English với token Gạo ấm; Prisma kết nối Neon |
| 1 | Lõi nghiệp vụ | 4; hàm phân quyền của 8 | — | Unit test xanh cho R2, R14–R19, R23, R70–R76 và bảng quyền (R84) |
| 2 | Tài khoản và kế hoạch | 3 (Account, Plan kèm `kind`, PlanMember, Participant); 8; 10 (email xác nhận, đặt lại mật khẩu); 12 (gồm chọn loại và tạo kế hoạch cơ bản); link chia sẻ và `noindex` của 9 | A01–A04, G01–G03, G02t, G02c, G07, G08, G10, GD1, GD7, GD8, GD19–GD21, GD23–GD26, GD35, GD51, GD52 | E2E đăng nhập và độ dài plan; tạo plan rồi mở link ở trình duyệt khác thì chỉ xem, nhập passcode thì sửa được |
| 3 | Chia tiền | 13 (người tham gia, Bạn là ai); 17; 18; màn kế hoạch cơ bản (R94, R96) | G05, G06, G06b, G15–G17b, G15e, G16c, G16e, GD2–GD6, GD28, GD43–GD45, GD53–GD55 | E2E luồng chính, kế hoạch cơ bản, tiền đóng, tiền tệ, tên plan, khóa và chốt, QR |
| 4 | Lịch trình, nơi ở, ăn gì | 14; 15; 16 | G04–G04h, G12, G12b, GD11–GD13, GD15, GD37–GD39 | E2E plan 10 ngày, thứ tự hiển thị, nơi ở và món ăn |
| 5 | Cộng tác | thành viên và link mời của 13 (R84, R85); 10 (khóa passcode); 11; 6 (theme, ảnh nền) | A05, G05b, G09, G11, T0–T5, GD22, GD27, GD29, GD36 | E2E thành viên, passcode, edit lock, theme, ảnh nền |
| 6 | Cộng đồng | 19; 20; 21 | K01–K05b, G04b, G04c, G13, G14, G18, GD9, GD10, GD14, GD16, GD17, GD40–GD42, GD46–GD49 | E2E gợi ý quán ăn, chia sẻ hành trình, tim và trang người dùng |
| 7 | Chiêu mộ | 22; job chiêu mộ của 23 | K06, K07, K07b, G05c–G05g, GD18, GD30–GD34, GD50 | E2E chiêu mộ |
| 8 | Hoàn thiện và phát hành | 7 (PWA); phần còn lại của 9 (Turnstile, Firewall, kiểm tra dữ liệu gửi đi); 23; 24 | màn chống bot | Mọi E2E mục 24 qua; đối chiếu xong Acceptance Criteria; deploy production |

**Vì sao thứ tự này:**
- GĐ1 tách riêng vì tiền là phần dễ sai nhất và không cần giao diện để kiểm tra.
- GĐ3 đứng trước lịch trình vì chia tiền là giá trị chính của app: xong GĐ3 là dùng thật được kế hoạch cơ bản cho một bữa ăn, và phần chia tiền của một chuyến đi.
- Cộng đồng và chiêu mộ để sau vì cần dữ liệu từ kế hoạch (hành trình lấy từ plan đã chốt, tin chiêu mộ đọc lịch trình của plan).

## Tuần đầu

- [x] Chốt cấu trúc repo, múi giờ, route và domain (xem "Đã chốt" bên dưới).
- [ ] Đọc tài liệu Next.js 16 đi kèm trong `go-split/node_modules/next/dist/docs/` (theo `go-split/AGENTS.md`). Điểm khác cần nhớ: `proxy.ts` thay cho `middleware.ts`.
- [x] Chuyển `go-split/app` vào `go-split/src/app` và tạo các thư mục theo cấu trúc bên dưới.
- [x] Kiểm tra next-intl, Better Auth, Prisma và shadcn/ui đã hỗ trợ Next.js 16.4 và React 19.3 (kết quả ở "Thư viện đã kiểm tra" bên dưới).
- [x] Cài Prisma, Vitest, Playwright, Prettier; khởi tạo shadcn/ui. Zod, React Hook Form, decimal.js, next-intl và Better Auth cài ở task đầu tiên dùng tới.
- [ ] Tạo Neon project với hai branch `dev` và `preview`; `DATABASE_URL` dùng pooled connection, `DIRECT_URL` cho migrate.
- [x] GitHub Actions: `npm ci`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`; job E2E chạy Playwright trên bản build.
- [x] Tạo `.env.example` theo bảng biến môi trường bên dưới.
- [ ] Tạo Vercel project (Root Directory là `go-split`), biến môi trường, preview deploy cho mỗi PR.
- [ ] Đưa token Gạo ấm vào CSS variables; font Lora và Be Vietnam Pro qua `next/font`.
- [ ] Viết hàm chia chi phí đầu tiên kèm test (R16–R19) để chạy thử cả pipeline.

## Cấu trúc thư mục

```text
go-split/
  src/
    app/          route và layout; chỉ ghép giao diện và gọi server
    domain/       TypeScript thuần: tiền, làm tròn, tiền tệ, ngày, phân quyền, chuẩn hóa không dấu
    server/       Prisma (db.ts, generated/ do prisma generate sinh), auth, server action theo module, rate limit, email, storage
    components/   ui/ (shadcn) và theo module: plan, schedule, food, costs, summary, explore, recruit
    lib/          tiện ích nhỏ dùng chung cho giao diện (utils.ts của shadcn)
    i18n/         cấu hình next-intl
    proxy.ts      header noindex, rate limit, chuyển hướng đăng nhập
  messages/       vi.json, en.json
  prisma/         schema.prisma, migrations, seed (cấu hình ở prisma7.config.ts)
  tests/e2e/      Playwright
```

## Thư viện đã kiểm tra (02/11/2026)

Cài từ npm công khai (`registry.npmjs.org`), như `package-lock.json`.

| Thư viện | Phiên bản | Ghi chú |
|---|---|---|
| next-intl | 4.14 | Ghi hỗ trợ Next.js 16 và React 19; cài ở mục 5 |
| better-auth | 1.7 | Ghi hỗ trợ Next.js 16, React 19, Prisma 5–7; cài ở mục 8 |
| PGlite | 0.5 | Postgres chạy trong bộ nhớ, có `pg_trgm` và `unaccent`; dùng để test migration khi chưa có Neon |
| Prisma (CLI, client, adapter Neon) | 7.10.1 | Tag `latest` của CLI đang trỏ tới bản RC 8.0.0, nên ghim cả bộ ở 7.10.1; lên Prisma 8 khi có bản ổn định và Better Auth hỗ trợ. Prisma 7 cần driver adapter và đọc URL từ `prisma7.config.ts`, không từ schema |
| shadcn/ui | CLI 4.23, Base UI 1.9 | Tailwind 4, React 19; dùng gói `cn` của shadcn thay cho clsx + tailwind-merge (gói mới, bản 0.5) |
| Vitest | 5.0 | Cần Vite 8 (Rolldown) và `@types/node` từ 22 trở lên; dự án dùng `@types/node` 24 |
| Playwright | 1.64 | Chỉ tải Chromium |
| Zod, React Hook Form, `@hookform/resolvers`, decimal.js | 4.6, 7.91, 7.0, 10.6 | Hỗ trợ React 19 và Zod 4; cài ở task dùng tới |

Không thư viện nào trong danh sách thiếu hỗ trợ Next.js 16 hay React 19.3, nên chưa phải thay thư viện nào.

## Biến môi trường

Chỉ khai báo khi giai đoạn cần tới. `.env.example` liệt kê tên biến, không có giá trị thật. Vercel đặt giá trị riêng cho Preview và Production.

| Biến | Dùng cho | Từ GĐ |
|---|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Neon: pooled connection cho app, direct cho migrate | 0 |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth | 2 |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Đăng nhập Google | 2 |
| `RESEND_API_KEY`, `EMAIL_FROM` | Email xác nhận, đặt lại mật khẩu, mở khóa passcode, chiêu mộ | 2 |
| `EDIT_SESSION_SECRET` | Ký cookie phiên sửa bằng passcode | 2 |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limit (R47, R52) | 2 |
| `IP_HASH_SALT` | Hash IP (R53) | 2 |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Ảnh QR và ảnh nền, bucket riêng tư | 3 |
| `CONTACT_ENCRYPTION_KEY` | Mã hóa thông tin liên hệ của yêu cầu xin đi cùng (R91) | 7 |
| `CRON_SECRET` | Bảo vệ route của Vercel Cron | 7 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Kiểm tra chống bot | 8 |

## Route

URL không chứa ngôn ngữ (R28): next-intl dùng chế độ không có i18n routing, ngôn ngữ lấy từ cookie hoặc tài khoản.

| Route | Màn | Wireframe |
|---|---|---|
| `/` | Kế hoạch · Của bạn | G01, GD1 |
| `/explore`, `/itineraries/{id}`, `/guides/{id}` | Khám phá, chi tiết hành trình, chi tiết danh sách gợi ý | K01, K02, G14, GD9, GD10 |
| `/recruit`, `/recruit/{postId}` | Chiêu mộ, chi tiết tin | K06, K07, GD18 |
| `/plans/new` | Tạo kế hoạch | G02–G03, GD7 |
| `/p/{planId}/{shareKey}` | Plan · Lịch trình (mặc định) | G04, GD11 |
| `…/food`, `…/costs`, `…/summary` | Ăn gì, Chi phí, Tổng kết | G12, G15, G16 |
| `…/people`, `…/stays`, `…/settings`, `…/recruit` | Người tham gia, Nơi ở, Cài đặt, Chiêu mộ của chủ plan | G05, G04g, G10, G05c |
| `/u/{publicId}` | Trang người dùng | K05, GD16 |
| `/login`, `/signup`, `/forgot-password`, `/welcome` | Tài khoản | A01–A04 |
| `/invite/{token}` | Nhận lời mời | A05 |
| `/admin` | Kiểm duyệt | GD17 |

Hộp thoại và form (thêm chi phí, thêm hoạt động, chuyển, báo cáo…) mở trên route của màn chứa nó, không có route riêng. Kế hoạch cơ bản dùng chung route với kế hoạch chi tiết, mặc định mở `…/costs`; route của tab không có thì chuyển về `…/costs` (R94).

## Quy ước code

- **Tiền:** dùng decimal.js trong `src/domain`; database dùng `NUMERIC(14,3)`; không dùng `number` cho số tiền.
- **Phân quyền:** mọi server action và route handler gọi cùng một hàm phân quyền; không kiểm tra quyền rải rác.
- **Validation:** một schema Zod dùng chung cho form và server.
- **Dữ liệu gửi cho client:** chỉ `select` field màn hình cần, không trả nguyên object Prisma (R48).
- **Chữ giao diện:** chỉ nằm trong `messages/*.json`.
- **Test:** tên test mở đầu bằng mã rule, ví dụ `R19 làm tròn VND lên bội số 1.000`.
- **Git:** mỗi việc một nhánh và một PR nhỏ; PR ghi mã rule và mã wireframe liên quan.

## Định nghĩa xong cho mỗi việc

- Đúng rule và Acceptance Criteria liên quan; có unit test cho logic, E2E nếu mục 24 có.
- Giao diện khớp wireframe điện thoại và desktop; đủ chữ tiếng Việt và English.
- Dùng được bằng bàn phím; có nhãn cho trình đọc màn hình; vùng bấm tối thiểu 44px.
- Không lộ dữ liệu nhạy cảm (R48); lint, typecheck và test đều xanh; preview chạy.

## Đã chốt (30/10/2026)

| Việc | Quyết định |
|---|---|
| Cấu trúc repo | Giữ code trong `go-split/`, tài liệu ở `docs/`; Vercel đặt Root Directory là `go-split` |
| Múi giờ | Lưu ngày giờ theo giờ địa phương của chuyến đi, không quy đổi múi giờ; ai xem cũng thấy đúng giờ đã nhập. Chi tiết kiểu dữ liệu: [data model](../data-model/README.md) |
| Route | Tiếng Anh ngắn, theo bảng route ở trên |
| Domain và email | Chưa có domain. GĐ0–GĐ1 dùng địa chỉ Vercel; mua domain và cấu hình SPF, DKIM cho Resend trước GĐ2. Trước đó email thử của Resend chỉ gửi được tới email của chủ tài khoản Resend |

## Việc làm song song với code

Các việc sau không chặn GĐ0–GĐ4, nhưng phải xong trước giai đoạn cần nó:

| Việc | Cần trước |
|---|---|
| Chốt danh sách theme, hình minh họa và thiết kế từng theme (mục 1) | GĐ5 |
| Màn kiểm tra chống bot (mục 1) | GĐ8 |
| Danh sách gợi ý cho 20–30 điểm đến và hành trình mẫu (mục 24) | Phát hành |
