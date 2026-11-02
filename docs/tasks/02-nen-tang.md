# Nền tảng

Tech stack và thứ tự làm: [README](README.md).

## 2. Khởi tạo dự án

### Tài khoản dịch vụ

Mỗi dịch vụ là một task, làm trước giai đoạn ghi trong ngoặc. Cách bàn giao:

1. Key bí mật không gửi qua chat. Bản cho máy dev ghi vào `go-split/.env.local` (git bỏ qua file này); bản cho Vercel đặt trong Project Settings → Environment Variables, riêng Preview và Production.
2. Nhắn "Xong <tên dịch vụ>" kèm thông tin không bí mật ghi ở dòng Bàn giao.
3. Script kiểm tra chỉ in biến nào có, biến nào thiếu và kết quả kết nối; không in giá trị, không mở `.env.local` để đọc. Qua thì đánh dấu xong.

- [x] **GitHub:** repo `NguyenNTStudy/My_GoSplit`.
- [ ] **Vercel** (GĐ0): import repo, Root Directory là `go-split`, Function Region là Singapore (`sin1`).
  - Bàn giao: link cố định của project (`….vercel.app`). Kiểm tra: link mở được trang hiện tại.
- [ ] **Neon** (GĐ0): project ở region Singapore; ngoài branch chính (Production) tạo thêm `dev` và `preview`.
  - Bàn giao: `DATABASE_URL` (pooled) và `DIRECT_URL` của branch `dev`; tên project. Kiểm tra: kết nối và chạy `select 1`.
- [ ] **Secret tự sinh** (GĐ0, không cần tài khoản): `BETTER_AUTH_SECRET`, `EDIT_SESSION_SECRET`, `IP_HASH_SALT`, `CONTACT_ENCRYPTION_KEY`, `CRON_SECRET`.
  - Bản dev: Claude sinh ngẫu nhiên thẳng vào `.env.local`, không in ra. Bản Preview và Production: bạn tự sinh (ví dụ `openssl rand -base64 32`) và đặt trên Vercel, mỗi môi trường một giá trị.
- [ ] **Google Cloud** (GĐ2): project, màn đồng ý OAuth (External), OAuth client loại Web; redirect URI `http://localhost:3000/api/auth/callback/google` và URI tương ứng trên link cố định của Vercel.
  - Bàn giao: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`; các redirect URI đã thêm. Kiểm tra: đủ biến; đăng nhập Google chạy được khi xong phần auth.
- [ ] **Resend** (GĐ2): tài khoản và API key quyền gửi email.
  - Bàn giao: `RESEND_API_KEY`; email đăng ký Resend (khi chưa có domain chỉ gửi được tới email này). Kiểm tra: gửi một email thử, bạn xác nhận đã nhận.
- [ ] **Upstash Redis** (GĐ2): một database Redis ở region Singapore.
  - Bàn giao: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Kiểm tra: lệnh `PING` trả về `PONG`.
- [ ] **Domain** (trước GĐ2; GĐ0–GĐ1 dùng địa chỉ Vercel): mua domain, trỏ về Vercel, thêm bản ghi SPF, DKIM và DMARC mà Resend yêu cầu.
  - Bàn giao: tên domain, `EMAIL_FROM` (ví dụ `Góp Gạo <no-reply@…>`). Kiểm tra: tra DNS các bản ghi; Resend báo Verified; gửi thử tới một email khác.
- [ ] **Cloudflare R2** (GĐ3): bucket riêng tư (không bật public access), API token chỉ đọc ghi bucket đó.
  - Bàn giao: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. Kiểm tra: ghi, đọc, xóa một file thử; file không mở được bằng URL công khai.
- [ ] **Cloudflare Turnstile** (GĐ8, cần domain): widget cho domain của app.
  - Bàn giao: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`. Kiểm tra: xác minh một token thử với server của Cloudflare.

### Dự án

- [x] Chốt cấu trúc repo (code trong `go-split/`, Vercel đặt Root Directory là `go-split`), múi giờ (giờ địa phương của chuyến đi) và route tiếng Anh ngắn ([lộ trình](00-lo-trinh.md))
- [x] Tạo project Next.js 16 + TypeScript + Tailwind 4 bằng create-next-app trong `go-split/`
- [x] Cấu hình ESLint, Prettier: `eslint-config-next` (core-web-vitals, TypeScript) và đủ rule khuyến nghị của jsx-a11y; `src/domain` không được import Next.js, React hay Prisma; Prettier kèm plugin sắp xếp class Tailwind; script `lint`, `lint:fix`, `format`, `format:check`; cấu hình VS Code trong `.vscode/`
- [x] Tạo cấu trúc thư mục: `app/` chuyển vào `src/app/`; thêm `src/domain` (TypeScript thuần, không phụ thuộc Next.js), `src/server`, `src/components`; alias `@/*` trỏ tới `src/`; `tailwindStylesheet` trong `.prettierrc.json` đổi theo. Các thư mục `messages/`, `prisma/`, `tests/e2e/`, `src/i18n/` và `src/proxy.ts` tạo ở task cài thư viện tương ứng
- [x] Kiểm tra next-intl, Better Auth, Prisma, shadcn/ui hỗ trợ Next.js 16 và React 19.3 trước khi cài; kết quả và phiên bản ghi ở [lộ trình](00-lo-trinh.md)
- [x] Cài shadcn/ui 4.23 (preset `base-nova`, component nền Base UI, `components.json`, `src/components/ui`, `src/lib/utils.ts`); gói `shadcn` để ở devDependencies vì chỉ cần lúc build CSS
- [x] Cài Prisma 7.10.1 (CLI, client, adapter Neon): `prisma7.config.ts` đọc `.env*` như Next.js, migrate dùng `DIRECT_URL`; client sinh vào `src/server/generated/prisma` (không commit, `postinstall` tự sinh); `src/server/db.ts` dùng adapter Neon với `DATABASE_URL` (pooled)
- [ ] Kết nối Neon và chạy thử `select 1` (chờ task tài khoản Neon)
- [x] Cài Vitest 5 (môi trường Node cho `src/**/*.test.ts`, alias `@/` qua Vite) và Playwright 1.64 (Chromium, chạy mỗi bài trên điện thoại Pixel 7 và desktop; smoke test ở `tests/e2e`); script `test`, `test:watch`, `test:e2e`. Bộ test component (jsdom, Testing Library) cài khi có component đầu tiên cần test
- [x] CI với GitHub Actions (`.github/workflows/ci.yml`): job check chạy `npm run lint`, `npm run typecheck` (`next typegen` rồi `tsc --noEmit`, vì Next.js 16 sinh kiểu route như `LayoutProps`), `npm run format:check`, `npm test`; job e2e build rồi chạy Playwright, lỗi thì tải `test-results` lên; Node 24 (`engines` trong `package.json`)
- [x] Tạo `.env.example` liệt kê đủ biến môi trường theo giai đoạn, không có giá trị thật ([lộ trình](00-lo-trinh.md)); thêm `!.env.example` vào `go-split/.gitignore`
- [ ] Deploy preview lên Vercel, cấu hình biến môi trường riêng cho Preview (branch Neon `preview`) và Production (branch chính)

## 3. Database

Schema ở `go-split/prisma/schema.prisma`, migration đầu tiên ở `prisma/migrations/20261102000000_init` (phần SQL viết tay: extension, CHECK, trigger). `src/server/migrations.test.ts` chạy migration trên Postgres trong bộ nhớ (PGlite) và kiểm tra các ràng buộc đó.

- [ ] Chạy migration lên Neon (`prisma migrate deploy`) cho branch `dev` và `preview` (chờ task tài khoản Neon)
- [x] Prisma schema theo [data model](../data-model/README.md): Plan, PlanMember, Participant, Activity, Expense, ExpenseShare, Contribution, EmailToken
- [x] Bảng PlanMember (vai trò owner, editor, viewer) và PlanInvite (token lưu dạng hash, dùng một lần, hết hạn 7 ngày); tạo plan thì thêm dòng `owner` gắn với người tham gia của chủ plan, cùng transaction; danh sách plan truy vấn qua PlanMember (R84, R85). Phần bảng đã xong; tạo dòng `owner`, mỗi plan đúng một owner và mỗi người tham gia một link mời còn hiệu lực do server kiểm tra ở mục 12, 13 (Prisma chưa hỗ trợ unique index có điều kiện)
- [x] Bảng RecruitPost, JoinRequest, ContactViewLog, RecruitReport, AccountReport, AccountBlock; cột `recruitEmails` của account (R86–R92)
- [x] Field `collectorParticipantId` của plan, mặc định là người tham gia đại diện chủ plan; đổi thì xóa QR (R54) (xóa QR khi đổi người thu tiền làm ở mục 18)
- [x] QR chuyển khoản của plan (tối đa một QR mỗi plan, của người thu tiền): đường dẫn ảnh trong storage riêng tư, nhãn, thời điểm cập nhật (R54)
- [x] Bảng Stay (nơi ở, có khu vực và mã quốc gia) và FoodItem (món ăn) (R31, R33)
- [x] FoodItem: không có `date`; `mealSlots` là mảng buổi (sáng, chiều, tối), có thể trống; `directions` (đường đến quán, nhập tự do) thay cho `mapLink`; không lưu liên kết tới danh sách gợi ý gốc (R33, R41)
- [x] Bảng FoodGuide, FoodGuideEntry, GuideHeart, GuideReport (R35–R45)
- [x] Bảng ghi lại danh sách gợi ý nào đã áp dụng vào plan nào, để mỗi plan chỉ tính một lượt sử dụng (R41)
- [x] Bảng Itinerary, ItineraryActivity, ItineraryStay, ItineraryFood, ItineraryHeart, ItineraryReport, ItineraryCopy (mỗi plan một lượt sao chép); `sourcePlanId` duy nhất, đặt trống khi xóa plan (R63–R69)
- [x] Lưu thêm bản không dấu của khu vực (Stay, FoodGuide, Itinerary, ItineraryStay); bật extension `unaccent`, `pg_trgm` và tạo index trigram (R34); hàm chuẩn hóa không dấu làm ở mục 4
- [x] Field ngôn ngữ, `displayName`, `username` (duy nhất, chữ thường), `userTag` (duy nhất), `publicId` (ngẫu nhiên, duy nhất, cho địa chỉ trang người dùng), quyền admin và trạng thái bị khóa của account (R28, R37, R44, R78, R83): account là bảng `User` của Better Auth (plugin username và admin); `displayName` là `name`, quyền admin là `role`, bị khóa là `banned`; hàm sinh `userTag` và `publicId` ở `src/domain/ids.ts`
- [x] Bảng/field cho passcode lock, edit lock và email token của link mở khóa (R9)
- [x] Field `currency` (mã ISO 4217) của plan và hành trình; server chỉ nhận mã có trong danh sách tiền tệ, và chỉ cho đổi khi plan chưa có khoản chi, tiền đóng và tổng kết đang mở (R1, R72) (field và CHECK dạng mã đã có; kiểm tra danh sách và điều kiện đổi làm ở mục 12)
- [x] Field `summaryStatus` (`open`, `locked`, `final`) và `summaryStatusChangedAt` của plan; server chặn ghi Participant, Activity, Expense, ExpenseShare khi tổng kết đang `locked` hoặc `final`; không cho đổi khỏi `final` (R59) (field đã có; phần chặn ghi làm ở mục 17, 18)
- [x] Field `kind` của plan (`basic`, `detailed`) và ràng buộc theo loại: plan `basic` không có ngày, địa điểm, theme, ảnh nền; Expense và Contribution của plan `basic` không có `dateTime`; server từ chối Activity, Stay, FoodItem, RecruitPost, Itinerary cho plan `basic` (R93–R96). CHECK trong database cho các field của plan (kể cả 60 ngày và mô tả 100 ký tự); phần kiểm tra theo bảng con do server làm ở mục 12, 14–17
- [x] Field `theme` của plan (R29)
- [x] Field `coverImage` của plan: đường dẫn ảnh và vùng hiển thị (R30)
- [x] `planId` dạng `VARCHAR`, sinh ngẫu nhiên 10 chữ số bằng crypto, trùng thì sinh lại (R4) (hàm sinh ở `src/domain/ids.ts`; vòng sinh lại khi trùng nằm trong hàm tạo plan ở mục 12)
- [x] Field `shareKey` của plan: chuỗi ngẫu nhiên ít nhất 128 bit, sinh bằng crypto, dạng an toàn cho URL (R3)
- [x] Mã định danh ngẫu nhiên (UUID hoặc cuid) cho mọi bảng khác, không dùng số tự tăng (R49): UUID v7; bảng của Better Auth dùng mã do Better Auth sinh
- [x] Lưu số tiền dạng `NUMERIC(14,3)`, tỷ lệ dạng `NUMERIC` (tỷ lệ `NUMERIC(12,4)`)
- [x] Index: `(ownerId, startDate)`, `(planId, dateTime)` của Expense, `(planId, date, time)` của Activity, `(planId, order)` của FoodItem, các khóa ngoại `planId` (R33, R60)
- [x] Xóa plan thì xóa cascade toàn bộ dữ liệu con (R22); trigger chặn xóa hẳn người tham gia còn khoản chi, phần chia, tiền đóng hoặc là chủ, người thu tiền khi plan vẫn còn (R13)
- [x] Cập nhật `plan.updatedAt` khi bất kỳ dữ liệu con nào thay đổi (trigger trên người tham gia, tiền đóng, QR, khoản chi, phần chia, hoạt động, nơi ở, món ăn)
- [ ] Seed data cho môi trường dev (cần hàm băm passcode ở mục 8 và database Neon)

## 4. Logic nghiệp vụ (`src/domain`)

TypeScript thuần, không phụ thuộc Next.js, React hay Prisma; mỗi file có test `*.test.ts` đặt tên theo mã rule. Hàm trả mã lỗi (chuỗi), chữ hiển thị do mục 5 dịch.

- [x] Chia chi phí theo tỷ lệ bằng decimal.js (R16, R17): `expense-split.ts`, nhân trước rồi chia, không làm tròn
- [x] Validate số tiền > 0; tiền tệ không có phần lẻ chỉ nhận số nguyên, tiền tệ khác tối đa 3 chữ số thập phân; tỷ lệ > 0 (R14, R16, R18): `amounts.ts`; giới hạn khớp cột database (11 chữ số phần nguyên, tỷ lệ 4 chữ số lẻ)
- [x] Tính cho từng người: chi tiêu, đã đóng (tiền đóng trừ trả lại, cộng khoản tự trả), còn thiếu hoặc dư; số người đã đủ; số tiền người thu tiền đang giữ (R76): `summary.ts`; người dư tính là đã đủ; người thu tiền đang giữ = tổng tiền đóng trừ tiền trả lại
- [x] Làm tròn ở kết quả cuối theo bước làm tròn của tiền tệ (0,5; 1.000 với VND…): chi tiêu và còn thiếu làm tròn lên, dư làm tròn xuống; tổng sau làm tròn được phép lớn hơn tổng chi (R18, R19): `rounding.ts`, `decimal.ts` (độ chính xác 50 chữ số); chi tiêu làm tròn lên trước, rồi thiếu hoặc dư tính trên số đã làm tròn, nên "Đã đóng đủ" luôn đưa người đó về đủ
- [x] Danh sách tiền tệ: script sinh JSON từ ISO 4217 và CLDR (mã, tên tiếng Việt và tiếng Anh, ký hiệu, số chữ số lẻ, các nước dùng), cộng bảng bước làm tròn và nhóm phổ biến viết tay; commit file JSON để mọi trình duyệt thấy cùng một danh sách (R1, R19, R71): `scripts/generate-currencies.mjs` (`npm run currencies:generate`, dữ liệu `cldr-core`), ra `src/domain/currencies.json`, 153 tiền tệ đang dùng
- [x] Tìm tiền tệ theo mã, tên tiền tệ, tên nước và ký hiệu, dùng chung hàm chuẩn hóa không dấu với khu vực (R34, R71): `currency.ts` (`searchCurrencies`, `currencyPickerSections`)
- [x] Chọn tiền tệ mặc định khi tạo plan: tiền tệ của plan tạo gần nhất, vùng của trình duyệt, rồi ngôn ngữ (R70): `defaultCurrency` trong `currency.ts`
- [x] Tiền đóng không tính vào chi tiêu; "Đã đóng đủ" và "Đã trả lại" ghi một khoản bằng đúng số còn thiếu hoặc số dư (R23): `settlementFor` trong `contributions.ts`
- [x] Ghi tiền đóng hàng loạt: cùng số tiền hoặc mỗi người một số, mỗi người một khoản, chung `batchId`; không ghi khoản bằng không (R75): `buildContributionBatch` trong `contributions.ts`; `batchId` do server gán
- [x] Validate tên plan và tiêu đề hành trình: 1–50 ký tự sau khi bỏ khoảng trắng đầu cuối, đếm sau khi chuẩn hóa NFC (R73): `text-rules.ts`, kèm mô tả ngắn của kế hoạch cơ bản tối đa 100 ký tự (R94)
- [x] Chuẩn hóa khu vực để tìm kiếm: bỏ dấu, chữ thường, `đ` thành `d`, gộp khoảng trắng; dùng chung cho nơi ở, danh sách gợi ý và hành trình (R34): `search-text.ts`
- [x] Đếm số quán khác nhau trong danh sách gợi ý: so tên quán đã chuẩn hóa như khu vực (R35): `food-match.ts`
- [x] Nhận biết mục trùng với món đã có trong plan (cùng món, cùng quán) khi áp dụng danh sách gợi ý (R41): `food-match.ts`
- [x] Tạo hành trình từ plan đã chốt: đổi ngày thật thành số thứ tự ngày, bỏ hoạt động ở mục Ngày chưa xác định (R81), chỉ lấy các field được phép; tính số người và chi phí ước tính mỗi người, làm tròn như R19 (R64, R65): `createItineraryDraft` trong `itinerary.ts`
- [x] Sao chép hành trình thành plan mới: đổi số thứ tự ngày thành ngày thật theo ngày bắt đầu, giữ giờ của hoạt động; ghi ItineraryCopy (R68): `copyItineraryToNewPlan`; ghi ItineraryCopy do server làm
- [x] Sao chép hoạt động đã chọn của hành trình vào plan đang có: Ngày N vào ngày thứ N của plan, giữ giờ (kể cả không có giờ); ngày vượt quá plan thì để trống ngày (mục Ngày chưa xác định); không thêm nơi ở; ghi ItineraryCopy nếu plan chưa có (R79, R81): `copyItineraryActivitiesToPlan`
- [x] Thêm món ăn của hành trình vào plan: như áp dụng danh sách gợi ý, nhận biết món trùng (R41, R79): `prepareFoodsToAdd` trong `food-match.ts`
- [x] Đổi ngày đi của plan: ngày về dời theo; nếu đồng ý thì dời hoạt động và nơi ở cùng số ngày, giữ giờ, hoạt động chưa có ngày giữ nguyên; khoản chi và tiền đóng giữ nguyên ngày (R80): `changePlanStartDate` trong `plan-dates.ts`; nơi ở ra ngoài khoảng ngày mới được trả về để bắt sửa trước khi lưu
- [x] Unit test cho mọi edge case về tính tiền (cả tiền tệ có và không có phần lẻ, tiền đóng, trả lại, người tự trả khoản chi), chọn và tìm tiền tệ, chuẩn hóa khu vực, đếm quán, nhận biết mục trùng, tạo và sao chép hành trình (75 test, gồm ví dụ "Lẩu thứ 6" của wireframe và 100.000 ₫ chia 3 người)

## 5. Đa ngôn ngữ

- [x] Cài next-intl với 2 ngôn ngữ: Tiếng Việt và English (R28): chế độ không có i18n routing, cấu hình ở `src/i18n/`; root layout đặt `instant = false` vì ngôn ngữ lấy từ cookie nên không trang nào có phần khung tĩnh chung cho mọi ngôn ngữ (Cache Components của Next.js 16)
- [x] Đưa toàn bộ chữ trên giao diện vào file dịch `messages/vi.json` và `messages/en.json`, không viết cứng chữ trong component; key được kiểm tra kiểu qua `src/i18n/next-intl.d.ts`
- [x] Tên app theo ngôn ngữ: Góp Gạo / GoSplit (tiêu đề trang, manifest, email, thẻ preview): một key `app.name` trong file dịch, tiêu đề trang đã dùng; manifest (mục 7), email (mục 10), thẻ preview (mục 9) dùng cùng key. Đổi tên app chỉ cần sửa key này
- [x] Lần đầu dùng ngôn ngữ của trình duyệt, ngôn ngữ khác thì dùng English; cho đổi trong menu cài đặt (R28): đọc `Accept-Language` theo thứ tự ưu tiên (q); nút đổi ngôn ngữ ở `src/components/locale-switcher.tsx`, đặt vào menu cài đặt khi có màn đó
- [x] Lưu lựa chọn ngôn ngữ trên thiết bị (cookie `locale`, một năm) (R28)
- [x] Lưu ngôn ngữ theo account khi đã đăng nhập, và ưu tiên ngôn ngữ của account hơn cookie (R28): ngôn ngữ đang dùng lúc đăng ký thành ngôn ngữ của account; đổi ngôn ngữ khi đã đăng nhập thì lưu cả cookie và account; `src/i18n/request.ts` đọc account trước
- [x] Link chia sẻ không chứa ngôn ngữ; người mở link thấy plan theo ngôn ngữ của họ (R28): URL không có tiền tố ngôn ngữ
- [x] Định dạng ngày giờ và thứ trong tuần theo ngôn ngữ: `src/i18n/format.ts` (`T7 05/12`, `12–14/12/2026`, `06:00`; tiếng Anh `Sat, Dec 5`, `6:00 AM`), ngày của chuyến đi không đổi múi giờ
- [x] Định dạng số tiền theo ngôn ngữ và tiền tệ của plan bằng `Intl.NumberFormat` (ký hiệu ngắn, chỉ hiện phần lẻ khi tiền tệ có phần lẻ); nhận đúng dấu thập phân khi nhập (`,` hoặc `.`); tiền tệ không có phần lẻ thì `.` và `,` đều là dấu phân cách hàng nghìn (R1, R18, R28): `formatMoney` trong `src/i18n/format.ts` (ký hiệu lấy từ danh sách tiền tệ nên giống nhau ở hai ngôn ngữ), `parseAmountInput` trong `src/domain/amount-input.ts`
- [x] Rút gọn số tiền là bội số của 1.000: `k` trong tiếng Việt, `K` trong tiếng Anh, ở mọi nơi hiển thị kể cả ảnh xuất; ô nhập nhận hậu tố `k`/`K` (R74)
- [x] Dịch thông báo lỗi validation (Zod): `src/i18n/validation.ts`; câu lỗi của Zod theo ngôn ngữ từng lần kiểm tra (không đặt cấu hình chung cho server), câu lỗi riêng của schema và mã lỗi của `src/domain` là key `validation.*` trong file dịch
- [ ] Gửi email theo ngôn ngữ người dùng đang dùng khi yêu cầu (R28; làm cùng mục 10)
- [x] Kiểm tra thiếu key dịch trong CI; bật rule ESLint chặn chữ viết cứng trong JSX (`react/jsx-no-literals`) sau khi cài next-intl: `src/i18n/i18n.test.ts` so key, biến trong câu và mã lỗi của domain giữa hai file dịch (chạy trong `npm test`); rule ESLint áp cho `src/app` và `src/components` (trừ `ui/` của shadcn)

## 6. Theme

- [x] Định nghĩa design token (màu, font, bo góc, khoảng cách) bằng CSS variables; mỗi theme gồm một bộ token và một bộ hình (R29): token ở `src/app/globals.css`, mỗi theme một khối `[data-theme="…"]`, Gạo ấm là mặc định ở `:root`; khoảng cách dùng thang của Tailwind; font Be Vietnam Pro (chữ thường) và Lora (tiêu đề) qua `next/font`; hình ở `public/themes/{mã theme}.svg`, lấy từ wireframe T1–T5; danh sách theme ở `src/domain/themes.ts`. Năm theme này tạm theo wireframe, chờ chốt danh sách và hình ở [chuẩn bị](01-chuan-bi.md)
- [ ] Chọn theme khi tạo plan, có xem trước (R29): đã có `ThemePicker` (`src/components/theme/theme-picker.tsx`) gửi field `theme` trong form; đặt vào màn tạo plan ở mục 12
- [x] Màu trạng thái tiền cố định, không theo theme: xanh lá cho đủ hoặc dư, đỏ cho thiếu; số tiền không kèm chữ nhưng có nhãn cho trình đọc màn hình (R77): token `--money-ok`, `--money-short` chỉ khai báo một lần ở `:root`; component `MoneyStatusAmount` có nhãn ẩn "Còn thiếu"/"Dư"; test bảo đảm không theme nào đổi màu này
- [ ] Đổi theme trong phần sửa plan (R29): dùng lại `ThemePicker`, làm cùng "Sửa thông tin plan" ở mục 12
- [ ] Áp theme của plan cho mọi người mở plan; các màn hình ngoài plan dùng Gạo ấm (R29): đã có `ThemeScope` (đặt `data-theme` và lớp `dark` cho Đêm); bọc layout `/p/{planId}/{shareKey}` bằng theme lấy từ plan khi làm trang plan ở mục 12. Màn hình ngoài plan không bọc nên dùng Gạo ấm
- [x] Tối ưu hình (WebP/AVIF, nhiều kích thước, lazy load) để tải nhanh trên điện thoại: hình theme là SVG 2–3 KB, không cần tối ưu; ảnh khác qua `next/image` (AVIF/WebP trong `next.config.ts`, `sizes`, lazy load mặc định); hình đầu trang plan tải trước (`preload`). Ảnh nền riêng: khi làm route trả ảnh ở mục 9 (`Cache-Control: private, no-store`) cần chọn giữa bộ tối ưu của `next/image` (cache ảnh ở server theo URL có khóa chia sẻ) và tạo sẵn vài kích thước lúc tải lên
- [x] Hình chưa tải xong hoặc lỗi thì plan vẫn đọc được bằng màu của theme: phần đầu trang (`PlanHero`) có màu nền `--hero` của theme dưới hình
- [x] Chữ đặt trên hình có lớp phủ để đủ độ tương phản (WCAG AA): tên và dòng phụ đặt trên khung `--scrim`; test tính độ tương phản cho mọi theme với hình nền trắng và đen, đều từ 4.5 trở lên
- [ ] Ảnh export tổng kết và thẻ preview link dùng hình của theme (R29): làm cùng export ảnh (mục 18) và thẻ preview (mục 12)
- [x] Theme đã bị gỡ khỏi app thì plan dùng Gạo ấm: `resolveTheme` trả Gạo ấm cho mã không còn trong danh sách
- [x] Thêm theme mới chỉ cần thêm token và hình, không phải sửa component: thêm một dòng vào `THEMES`, một khối token, một file SVG và tên theme trong hai file dịch; test báo thiếu nếu quên phần nào
- [ ] Đổi ảnh nền: người có quyền chỉnh sửa tải ảnh riêng thay hình của theme, gỡ ảnh để quay về hình theme (R30): `PlanHero` đã nhận ảnh riêng thay hình theme; màn hình tải ảnh làm cùng cài đặt plan (mục 12), storage R2 ở mục 9
- [ ] Nhận JPG, PNG, WebP, HEIC tối đa 10 MB; tự thu nhỏ, nén và chuyển sang WebP (R30): đã xong trừ HEIC, ở `processCoverImage` (`src/server/images/cover-image.ts`, sharp): kiểm tra 10 MB và định dạng, xoay theo EXIF, thu nhỏ còn rộng tối đa 2000 px, WebP chất lượng 80. sharp cài sẵn không đọc được HEIC của iPhone (chỉ đọc AVIF), nên ảnh HEIC đang bị từ chối với lỗi riêng; chờ quyết định cách xử lý HEIC, áp dụng cho cả ảnh QR (R55)
- [x] Xóa thông tin vị trí (GPS) và metadata khác khỏi ảnh trước khi lưu (R30): `processCoverImage` không giữ metadata nào; test bằng ảnh có EXIF và GPS
- [ ] Cho kéo để chọn vùng ảnh hiển thị (R30): `PlanHero` nhận điểm tâm `{x, y}` (field `coverImageCrop`); phần kéo chọn làm cùng màn tải ảnh
- [ ] Nhắc người tải ảnh rằng ai có link cũng xem được ảnh (R30): làm cùng màn tải ảnh
- [ ] Ảnh export tổng kết và thẻ preview link dùng ảnh riêng nếu plan có (R30): làm cùng export ảnh (mục 18) và thẻ preview (mục 12)

## 7. Web responsive và app (PWA)

- [x] Layout responsive: điện thoại một cột; desktop tận dụng chiều ngang (ví dụ danh sách chi phí và tổng kết cạnh nhau): component chung ở `src/components/layout/`, xem thử ở `/dev/layout` (chỉ có ở môi trường dev); các màn hình dùng khi làm từ mục 12
  - Dưới 768 px (`md`): một cột, thanh trên chỉ có tên app và nút nhỏ, nút chính cố định ở dưới (`BottomActionBar`); trang plan không có thanh trên, bắt đầu bằng phần đầu của plan
  - Từ 768 px: thanh trên đầy đủ (`SiteHeader`), nút chính nằm trong trang hoặc trên thanh trên
  - Từ 1024 px (`lg`): cột phụ 360 px bên phải, đứng yên khi cuộn (`SplitLayout`); ở điện thoại nội dung cột phụ nằm ở tab riêng
  - Nội dung rộng tối đa 1152 px như wireframe web (`PageContainer`); lề trang và nút dưới tránh tai thỏ, thanh home của iPhone (`px-page`, `pb-safe`, `viewport-fit=cover`)
  - E2E kiểm tra trang không bị cuộn ngang ở cả điện thoại và desktop
- [x] PWA: web app manifest, icon, màn hình khởi động, cài lên màn hình chính
  - Manifest theo ngôn ngữ: `/manifests/vi`, `/manifests/en` (file tĩnh). Trình duyệt tải manifest không kèm cookie nên ngôn ngữ nằm trong URL; tên app lấy từ key `app.name`
  - Icon tạm (bát cơm có hạt gạo rơi vào), chờ chốt tên app và logo: vẽ lại ở `scripts/generate-pwa-assets.mjs` rồi chạy `npm run pwa:generate`. Script sinh favicon, icon cho iPhone, icon 192/512 và icon maskable cho Android, ảnh khởi động
  - Màn hình khởi động: Android tự tạo từ màu nền và icon trong manifest; iPhone dùng ảnh khởi động cho 12 cỡ màn hình (danh sách ở `src/lib/pwa.ts`, có test kiểm tra đủ ảnh). Chưa làm cho iPad
  - Màu nền và màu thanh trình duyệt là màu nền Gạo ấm
  - Chưa có service worker: yêu cầu không cần dùng offline, và Chrome cho cài app không cần service worker
- [ ] Kiểm tra cài đặt và sử dụng trên iOS Safari và Android Chrome: phần tự động đã có ở `tests/e2e/pwa.spec.ts` (Chrome đọc manifest không lỗi, icon và ảnh khởi động tải được, manifest đúng ngôn ngữ). Phần thử trên máy thật cần link HTTPS, làm khi có Vercel (mục 2):
  - iPhone, Safari: Chia sẻ → Thêm vào MH chính; tên và icon đúng; mở app thấy ảnh khởi động, không có thanh địa chỉ; nút dưới không đè thanh home; xoay ngang không bị tai thỏ che
  - Android, Chrome: có lời mời cài hoặc mục Cài đặt ứng dụng; icon không bị cắt; màn hình khởi động có icon trên nền kem
  - Cả hai: đổi ngôn ngữ rồi cài thì tên app theo ngôn ngữ đó

## 8. Auth và phân quyền

- [ ] Tích hợp Better Auth: đăng nhập Google, đăng ký bằng email và mật khẩu (xác nhận email, quên mật khẩu); dùng chung một tài khoản khi trùng email (R61)
  - [x] Cấu hình ở `src/server/auth/`, route `/api/auth/*`. Đăng ký bằng email phải bấm link xác nhận mới đăng nhập được, nên tài khoản nào đã đăng nhập cũng đã xác nhận email trước khi tạo plan. Quên mật khẩu gửi link đặt lại; tài khoản chỉ có Google cũng đặt được mật khẩu theo cách này và vẫn là một tài khoản. Google chỉ tự liên kết vào tài khoản có email đã xác nhận, nên không ai chiếm được email bằng cách đăng ký trước. Test chạy cùng cấu hình trên database trong bộ nhớ (`create-auth.test.ts`), kèm test các bảng và cột Better Auth cần đều có trong `schema.prisma`
  - [x] Email tạm: ở môi trường dev, link xác nhận và link đặt lại mật khẩu in ra log của server; production báo lỗi cho tới khi có Resend (mục 10)
  - [ ] Chạy thử với Neon (chờ tài khoản Neon, mục 2) và đăng nhập Google (chờ OAuth client; Google tự bật khi có `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
  - [ ] Màn hình Đăng nhập, Đăng ký, Quên mật khẩu, Đặt lại mật khẩu, Hoàn tất tài khoản (wireframe GD19, GD8, GD20, GD21); tham số `next` sau khi đăng nhập chỉ nhận đường dẫn trong app
- [x] Bật plugin username của Better Auth: đăng ký với tên hiển thị, username, email, mật khẩu; đăng nhập bằng email hoặc username; báo username trùng khi gõ; lần đầu vào bằng Google thì hỏi username; sai thông tin nào cũng cùng một thông báo; đổi tên hiển thị và username trong tài khoản (R78): quy tắc ở `validateUsername` (`src/domain/account.ts`) và `validateDisplayName`; username lưu chữ thường; kiểm tra username trống qua `/api/auth/is-username-available`; quên mật khẩu bằng email hoặc username qua `requestPasswordResetFor`; tài khoản Google chưa có username thì `requireUser` chuyển tới màn Hoàn tất tài khoản. Sai mật khẩu và không có tài khoản trả cùng một mã lỗi (đăng nhập bằng email và bằng username mỗi cách một mã), giao diện hiện chung một câu. Giao diện làm cùng các màn hình tài khoản ở trên
- [ ] Bắt buộc đăng nhập mới tạo được plan; xem và sửa bằng passcode không cần đăng nhập (R61): đã có `requireUser` (`src/server/session.ts`); gọi trong action tạo plan và sao chép hành trình (mục 12, 20). Bảng quyền không cần tài khoản để xem hay sửa bằng passcode
- [x] Passcode 6 số do người dùng tự đặt, lưu dạng hash (argon2) (R5): `isValidPasscode`; `hashPasscode`, `verifyPasscode` dùng argon2id có sẵn trong Node 24 (`crypto.argon2`), không cần thư viện, lưu theo định dạng PHC chuẩn
- [x] Cảnh báo passcode dễ đoán nhưng vẫn cho lưu (R6): `isWeakPasscode` (một số lặp lại, dãy tăng hoặc giảm, cặp hoặc bộ ba lặp lại, các mã phổ biến); câu cảnh báo ở key `validation.passcode.weak`; hiện trong màn tạo plan (mục 12)
- [x] Phiên edit bằng httpOnly cookie có ký, gắn với `planId` và phiên bản passcode: `src/server/edit-session.ts`, cookie `edit_{planId}` ký HMAC bằng `EDIT_SESSION_SECRET`, kèm mã thiết bị cho edit lock (R8); giữ một năm, đổi passcode là hết hiệu lực. Đặt và đọc cookie khi làm màn nhập passcode
- [x] "Bạn là ai?": tìm người tham gia gắn với tài khoản qua PlanMember trước, rồi mới tới lựa chọn lưu trên thiết bị (R26, R27): `resolveCurrentParticipant` (`src/domain/current-participant.ts`); chỉ hỏi người có quyền sửa; đã bỏ qua thì không hỏi lại; người đã chọn không còn hoạt động thì hỏi lại. Màn hỏi làm ở mục 13
- [x] Phân quyền: xem (ai có link), chỉnh sửa (có passcode hoặc chủ account), xóa (chỉ chủ plan) (R3, R7); gom vào một hàm trong `src/domain` đọc PlanMember, phiên passcode và khóa chia sẻ, mọi API đều gọi hàm này, có test theo bảng quyền, gồm quyền Sửa và Xem của thành viên; nhập passcode không đổi quyền của tài khoản (R84): `planPermissions` (`src/domain/permissions.ts`), test theo bảng ở `permissions.test.ts`; thiết bị có quyền sửa vẫn mở được plan sau khi đổi khóa chia sẻ (để chuyển sang link mới, R3). Các API gọi hàm này khi được viết, từ mục 12
- [ ] Sai passcode 5 lần liên tiếp thì khóa nhập passcode của plan 12 giờ; thiết bị đã có quyền edit không bị ảnh hưởng (R9): logic xong ở `afterPasscodeAttempt`, `isPasscodeLocked` (`src/domain/passcode.ts`); còn API nhập passcode cập nhật số lần sai trong một câu lệnh SQL (để hai lần nhập cùng lúc không bị đếm thiếu), và email mở khóa (mục 10)
- [x] Quyền admin: chỉ account được chỉ định mới vào được trang admin; account bị khóa không đăng, thả tim hay báo cáo được (R44): `isAdmin`, `canUseCommunity` (`src/domain/account.ts`). Không dùng admin plugin của Better Auth vì khóa tài khoản ở đó chặn cả đăng nhập, còn R44 chỉ chặn đăng, thả tim, báo cáo; Better Auth vẫn đọc các cột `role`, `banned`, `banExpires`. Chỉ định admin bằng cách đặt `role = admin` trong database; trang admin ở mục 21

## 9. Bảo mật dữ liệu và chống crawl

- [ ] Trang plan, trang danh sách gợi ý và trang hành trình gắn `noindex` (thẻ meta và header `X-Robots-Tag`), không đưa vào sitemap (R46)
- [ ] Không chặn các trang này bằng `robots.txt`: công cụ tìm kiếm cần đọc được `noindex`; nếu bị chặn, link vẫn có thể hiện trong kết quả tìm kiếm (R46)
- [ ] Link chia sẻ dạng `/p/{planId}/{shareKey}`; sai mã hay sai khóa đều trả cùng trang "Không tìm thấy kế hoạch"; so khóa bằng phép so sánh constant-time (R3)
- [ ] Rate limit theo IP và thiết bị khi đọc plan; giới hạn chặt hơn khi tra sai mã plan hoặc sai khóa; ngưỡng đủ rộng cho cả nhóm dùng chung Wi-Fi (R47)
- [ ] Vượt giới hạn thì hiện Turnstile để kiểm tra chống bot, tiếp tục vượt thì chặn một thời gian (R47)
- [ ] Bật Vercel Firewall để lọc bot đã biết (R47)
- [ ] Mỗi API và server component chỉ trả field mà màn hình cần; test tự động bảo đảm passcode hash, email và mã tài khoản không có trong dữ liệu gửi cho người xem; hành trình không chứa tên người tham gia, khoản chi, tiền đóng, QR hay mã plan gốc (R48, R65)
- [ ] `Referrer-Policy: no-referrer` cho trang plan; link ra ngoài gắn `rel="noreferrer noopener"` (R50)
- [ ] Thẻ preview chỉ chứa tên plan, ngày và hình (R51)
- [ ] Tìm kiếm danh sách gợi ý và hành trình: phân trang có giới hạn, không có API xuất hàng loạt, rate limit như trang plan (R52)
- [ ] Lưu IP dạng hash có salt (R53)
- [ ] Ảnh QR và ảnh nền riêng lưu ở storage riêng tư, không có URL công khai; trả ảnh qua route của app có kiểm tra `planId` và khóa chia sẻ, header `Cache-Control: private, no-store` (R30, R57)
- [ ] Mã hóa thông tin liên hệ của yêu cầu xin đi cùng (AES-GCM, khóa trong biến môi trường, không lưu trong database); chỉ API của chủ plan giải mã; ghi ContactViewLog mỗi lần xem (R91)
- [ ] Trang tin chiêu mộ gắn `noindex`; tìm tin phân trang có giới hạn và rate limit như tìm hành trình (R46, R52)

## 10. Email và đổi passcode

- [ ] Tích hợp Resend và tạo template email (tiếng Việt và English): xác nhận email tài khoản, đặt lại mật khẩu, mở khóa nhập passcode
- [ ] Email mở khóa: tối đa một email cho mỗi lần khóa, mở link thì gỡ khóa ngay (R9)
- [ ] Chủ plan đổi passcode trong cài đặt plan, không cần link email (R11)
- [ ] Sau khi đổi passcode: vô hiệu phiên edit cũ, gỡ khóa nhập passcode (R11)
- [ ] Token trong email: dùng một lần, có hạn, lưu dạng hash
- [ ] Email chiêu mộ: yêu cầu mới cho chủ plan (gộp tối đa một email mỗi giờ), duyệt, từ chối, hết hạn cho người gửi; tắt được trong tài khoản (R90)

## 11. Edit lock

- [ ] Lấy edit lock khi vào chế độ chỉnh sửa (R8)
- [ ] Gửi heartbeat khoảng 30 giây một lần khi người dùng còn thao tác; nhả lock khi thoát hoặc sau 5 phút không thao tác
- [ ] Màn hình chỉ xem kèm thông báo đang có người chỉnh sửa
- [ ] Server kiểm tra lock ở mọi API ghi; từ chối lưu khi lock đã hết hạn
- [ ] Xử lý đóng tab và mất kết nối
