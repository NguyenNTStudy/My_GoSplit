# Lộ trình phát triển

Requirements, data model và wireframe (điện thoại và desktop) đã chốt. File này chia việc code thành các giai đoạn; mỗi giai đoạn kết thúc bằng một bản chạy được trên Vercel preview. Số mục (2–24) trỏ về checklist chi tiết trong [02](02-nen-tang.md), [03](03-tinh-nang.md), [04](04-phat-hanh.md). Wireframe: [canvas](https://claude.ai/artifact/6iUe9YoLbxwwiQHG7R47o9).

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
| 2 | Tài khoản và kế hoạch | 3 (Account, Plan, PlanMember, Participant); 8; 10 (email xác nhận, đặt lại mật khẩu); 12; link chia sẻ và `noindex` của 9 | A01–A04, G01–G03, G07, G08, G10, GD1, GD7, GD8, GD19–GD21, GD23–GD26, GD35 | E2E đăng nhập và độ dài plan; tạo plan rồi mở link ở trình duyệt khác thì chỉ xem, nhập passcode thì sửa được |
| 3 | Chia tiền | 13 (người tham gia, Bạn là ai); 17; 18 | G05, G06, G15–G17b, G16c, GD2–GD6, GD28, GD43–GD45 | E2E luồng chính, tiền đóng, tiền tệ, tên plan, khóa và chốt, QR |
| 4 | Lịch trình, nơi ở, ăn gì | 14; 15; 16 | G04–G04h, G12, G12b, GD11–GD13, GD15, GD37–GD39 | E2E plan 10 ngày, thứ tự hiển thị, nơi ở và món ăn |
| 5 | Cộng tác | thành viên và link mời của 13 (R84, R85); 10 (khóa passcode); 11; 6 (theme, ảnh nền) | A05, G05b, G09, G11, T0–T5, GD22, GD27, GD29, GD36 | E2E thành viên, passcode, edit lock, theme, ảnh nền |
| 6 | Cộng đồng | 19; 20; 21 | K01–K05b, G04b, G04c, G13, G14, G18, GD9, GD10, GD14, GD16, GD17, GD40–GD42, GD46–GD49 | E2E gợi ý quán ăn, chia sẻ hành trình, tim và trang người dùng |
| 7 | Chiêu mộ | 22; job chiêu mộ của 23 | K06, K07, K07b, G05c–G05g, GD18, GD30–GD34, GD50 | E2E chiêu mộ |
| 8 | Hoàn thiện và phát hành | 7 (PWA); phần còn lại của 9 (Turnstile, Firewall, kiểm tra dữ liệu gửi đi); 23; 24 | màn chống bot | Mọi E2E mục 24 qua; đối chiếu xong Acceptance Criteria; deploy production |

**Vì sao thứ tự này:**
- GĐ1 tách riêng vì tiền là phần dễ sai nhất và không cần giao diện để kiểm tra.
- GĐ3 đứng trước lịch trình vì chia tiền là giá trị chính của app: xong GĐ3 là dùng thật được cho một chuyến đi.
- Cộng đồng và chiêu mộ để sau vì cần dữ liệu từ kế hoạch (hành trình lấy từ plan đã chốt, tin chiêu mộ đọc lịch trình của plan).

## Tuần đầu

- [ ] Chốt các mục ở phần "Cần chốt ở GĐ0" bên dưới.
- [ ] Đọc tài liệu Next.js 16 đi kèm trong `go-split/node_modules/next/dist/docs/` (theo `go-split/AGENTS.md`). Điểm khác cần nhớ: `proxy.ts` thay cho `middleware.ts`.
- [ ] Chuyển `go-split/app` vào `go-split/src/app` và tạo các thư mục theo cấu trúc bên dưới.
- [ ] Cài Prisma, Zod, React Hook Form, decimal.js, next-intl, Better Auth, Vitest, Playwright, Prettier; khởi tạo shadcn/ui (Tailwind 4 đã có sẵn).
- [ ] Tạo Neon project với hai branch `dev` và `preview`; `DATABASE_URL` dùng pooled connection, `DIRECT_URL` cho migrate.
- [ ] GitHub Actions: `npm ci`, lint, `tsc --noEmit`, Vitest.
- [ ] Tạo Vercel project (Root Directory là `go-split`), biến môi trường, preview deploy cho mỗi PR.
- [ ] Đưa token Gạo ấm vào CSS variables; font Lora và Be Vietnam Pro qua `next/font`.
- [ ] Viết hàm chia chi phí đầu tiên kèm test (R16–R19) để chạy thử cả pipeline.

## Cấu trúc thư mục

```text
go-split/
  src/
    app/          route và layout; chỉ ghép giao diện và gọi server
    domain/       TypeScript thuần: tiền, làm tròn, tiền tệ, ngày, phân quyền, chuẩn hóa không dấu
    server/       Prisma, auth, server action theo module, rate limit, email, storage
    components/   ui/ (shadcn) và theo module: plan, schedule, food, costs, summary, explore, recruit
    i18n/         cấu hình next-intl
    proxy.ts      header noindex, rate limit, chuyển hướng đăng nhập
  messages/       vi.json, en.json
  prisma/         schema.prisma, migrations, seed
  tests/e2e/      Playwright
```

## Route (đề xuất, chốt ở GĐ0)

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

Hộp thoại và form (thêm chi phí, thêm hoạt động, chuyển, báo cáo…) mở trên route của màn chứa nó, không có route riêng.

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

## Cần chốt ở GĐ0

| Việc | Đề xuất |
|---|---|
| Cấu trúc repo | Giữ code trong `go-split/`, tài liệu ở `docs/`; Vercel đặt Root Directory là `go-split` |
| Múi giờ | Lưu ngày giờ theo giờ địa phương của chuyến đi, không quy đổi múi giờ: plan, hoạt động, nơi ở dùng kiểu ngày và giờ riêng; chi phí và tiền đóng dùng `timestamp without time zone` |
| Route | Theo bảng route ở trên |
| Domain và email | Mua domain và cấu hình SPF, DKIM cho Resend ngay ở GĐ0, vì GĐ2 cần email xác nhận tài khoản |

## Việc làm song song với code

Các việc sau không chặn GĐ0–GĐ4, nhưng phải xong trước giai đoạn cần nó:

| Việc | Cần trước |
|---|---|
| Chốt danh sách theme, hình minh họa và thiết kế từng theme (mục 1) | GĐ5 |
| Màn kiểm tra chống bot (mục 1) | GĐ8 |
| Danh sách gợi ý cho 20–30 điểm đến và hành trình mẫu (mục 24) | Phát hành |
