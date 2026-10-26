# Kế hoạch công việc — Góp Gạo (GoSplit) MVP

Danh sách công việc để xây dựng MVP theo [requirements.vi.md](requirements.vi.md). Số "rule" trong ngoặc là số thứ tự trong phần Quy tắc nghiệp vụ.

Đánh dấu hoàn thành bằng cách đổi `- [ ]` thành `- [x]`.

## Tech stack

| Phần | Lựa chọn |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | Better Auth (Google + email magic link) |
| UI | Tailwind CSS + shadcn/ui |
| Theme | Theme theo plan: CSS variables + hình minh họa |
| Ảnh preview link | next/og |
| Lưu ảnh tải lên | Vercel Blob (hoặc Cloudflare R2) |
| Xử lý ảnh | sharp |
| Đa ngôn ngữ | next-intl |
| App trên điện thoại | PWA (cài web app lên màn hình chính) |
| Validation | Zod + React Hook Form |
| Tính tiền | decimal.js |
| Email | Resend |
| Job định kỳ | Vercel Cron |
| Export ảnh | html-to-image |
| Test | Vitest (unit) + Playwright (E2E) |
| Hosting | Vercel |

## 0. Chuẩn bị

- [x] Chốt tên app: Góp Gạo (tiếng Việt) / GoSplit (tiếng Anh)
- [x] Chốt cách xác định "ai đang thao tác" trên mỗi thiết bị (rule 26, 27)
- [x] Chọn style giao diện: Gạo ấm (style 3 trong [canvas wireframe](https://claude.ai/artifact/6iUe9YoLbxwwiQHG7R47o9))
- [ ] Wireframe theo style Gạo ấm cho cả điện thoại và desktop: danh sách plan, tạo plan, chi tiết plan (lịch trình, người tham gia, chi phí, tổng kết), form chi phí, nhập passcode, đổi passcode, nơi ở, danh sách món ăn
- [ ] Vẽ data model (ERD) từ phần Các trường dữ liệu
- [ ] Tạo tài khoản dịch vụ: GitHub, Vercel, Neon, Resend
- [ ] Mua domain và cấu hình gửi email (SPF, DKIM) cho Resend

## 1. Khởi tạo dự án

- [ ] Tạo project Next.js + TypeScript
- [ ] Cấu hình ESLint, Prettier
- [ ] Tạo cấu trúc thư mục, tách logic nghiệp vụ vào `src/domain` (TypeScript thuần, không phụ thuộc Next.js)
- [ ] Cài Tailwind CSS + shadcn/ui
- [ ] Cài Prisma, kết nối Neon (dùng pooled connection)
- [ ] Cài Vitest và Playwright
- [ ] CI với GitHub Actions: lint, typecheck, test
- [ ] Deploy preview lên Vercel, cấu hình biến môi trường

## 2. Theme

- [ ] Chốt danh sách theme cho MVP (đề xuất: Gạo ấm, Biển, Núi rừng, Phố cổ, Đêm)
- [ ] Chuẩn bị hình minh họa cho từng theme (tự vẽ, thuê vẽ hoặc mua từ thư viện có license dùng thương mại)
- [ ] Thiết kế từng theme trên các màn hình chính
- [ ] Định nghĩa design token (màu, font, bo góc, khoảng cách) bằng CSS variables; mỗi theme gồm một bộ token và một bộ hình (rule 29)
- [ ] Chọn theme khi tạo plan, có xem trước (rule 29)
- [ ] Đổi theme trong phần sửa plan (rule 29)
- [ ] Áp theme của plan cho mọi người mở plan; các màn hình ngoài plan dùng Gạo ấm (rule 29)
- [ ] Tối ưu hình (WebP/AVIF, nhiều kích thước, lazy load) để tải nhanh trên điện thoại
- [ ] Hình chưa tải xong hoặc lỗi thì plan vẫn đọc được bằng màu của theme
- [ ] Chữ đặt trên hình có lớp phủ để đủ độ tương phản (WCAG AA)
- [ ] Ảnh export tổng kết và thẻ preview link dùng hình của theme (rule 29)
- [ ] Theme đã bị gỡ khỏi app thì plan dùng Gạo ấm
- [ ] Thêm theme mới chỉ cần thêm token và hình, không phải sửa component
- [ ] Đổi ảnh nền: người có quyền chỉnh sửa tải ảnh riêng thay hình của theme, gỡ ảnh để quay về hình theme (rule 30)
- [ ] Nhận JPG, PNG, WebP, HEIC tối đa 10 MB; tự thu nhỏ, nén và chuyển sang WebP (rule 30)
- [ ] Xóa thông tin vị trí (GPS) và metadata khác khỏi ảnh trước khi lưu (rule 30)
- [ ] Cho kéo để chọn vùng ảnh hiển thị (rule 30)
- [ ] Nhắc người tải ảnh rằng ai có link cũng xem được ảnh (rule 30)
- [ ] Ảnh export tổng kết và thẻ preview link dùng ảnh riêng nếu plan có (rule 30)

## 3. Đa ngôn ngữ

- [ ] Cài next-intl với 2 ngôn ngữ: Tiếng Việt và English (rule 28)
- [ ] Đưa toàn bộ chữ trên giao diện vào file dịch `messages/vi.json` và `messages/en.json`, không viết cứng chữ trong component
- [ ] Tên app theo ngôn ngữ: Góp Gạo / GoSplit (tiêu đề trang, manifest, email, thẻ preview)
- [ ] Lần đầu dùng ngôn ngữ của trình duyệt, ngôn ngữ khác thì dùng English; cho đổi trong menu cài đặt (rule 28)
- [ ] Lưu lựa chọn ngôn ngữ trên thiết bị; lưu theo account khi đã đăng nhập (rule 28)
- [ ] Link chia sẻ không chứa ngôn ngữ; người mở link thấy plan theo ngôn ngữ của họ (rule 28)
- [ ] Định dạng ngày giờ và thứ trong tuần theo ngôn ngữ
- [ ] Định dạng số theo ngôn ngữ; nhận đúng dấu thập phân khi nhập số tiền (`,` hoặc `.`) (rule 18, 28)
- [ ] Dịch thông báo lỗi validation (Zod)
- [ ] Gửi email theo ngôn ngữ người dùng đang dùng khi yêu cầu (rule 28)
- [ ] Kiểm tra thiếu key dịch trong CI

## 4. Web responsive và app (PWA)

- [ ] Layout responsive: điện thoại một cột; desktop tận dụng chiều ngang (ví dụ danh sách chi phí và tổng kết cạnh nhau)
- [ ] PWA: web app manifest, icon, màn hình khởi động, cài lên màn hình chính
- [ ] Kiểm tra cài đặt và sử dụng trên iOS Safari và Android Chrome

## 5. Database

- [ ] Prisma schema: Plan, Participant, Activity, Expense, ExpenseShare, PaymentInstallment
- [ ] Bảng/field cho passcode lock, edit lock và email token (xác nhận email, mở khóa, đổi passcode)
- [ ] Field `theme` của plan (rule 29) và field lưu ngôn ngữ theo account (rule 28)
- [ ] Field `coverImage` của plan: đường dẫn ảnh và vùng hiển thị (rule 30)
- [ ] Bảng Stay (nơi ở, có khu vực và mã quốc gia) và FoodItem (món ăn) (rule 31, 33)
- [ ] `planId` dạng `VARCHAR`, sinh ngẫu nhiên 10 chữ số bằng crypto, trùng thì sinh lại (rule 4)
- [ ] Lưu số tiền dạng `NUMERIC(14,3)`, tỷ lệ dạng `NUMERIC`
- [ ] Index: `(ownerType, updatedAt)`, `ownerId`, các khóa ngoại `planId`
- [ ] Xóa plan thì xóa cascade toàn bộ dữ liệu con (rule 22)
- [ ] Cập nhật `plan.updatedAt` khi bất kỳ dữ liệu con nào thay đổi (rule 24)
- [ ] Seed data cho môi trường dev

## 6. Logic tính tiền (`src/domain`)

- [ ] Chia chi phí theo tỷ lệ bằng decimal.js (rule 16, 17)
- [ ] Validate số tiền > 0, tối đa 3 chữ số thập phân; tỷ lệ > 0 (rule 14, 16, 18)
- [ ] Tính tổng đã trả/đã chi và số tiền mỗi người cần đóng góp
- [ ] Làm tròn lên ở kết quả cuối (rule 18, 19)
- [ ] Chọn người nhận phần dư: plan có account là người tạo; plan không có account mặc định là người chi nhiều nhất, hòa thì người được thêm sớm nhất, cho phép chọn người khác (rule 19)
- [ ] Xác nhận đã thanh toán không tính vào chi tiêu (rule 23)
- [ ] Đợt đóng góp: tách khỏi chi phí, cảnh báo khi tổng các đợt không khớp số tiền phải đóng
- [ ] Unit test cho mọi edge case về tính tiền

## 7. Auth và phân quyền

- [ ] Tích hợp Better Auth: đăng nhập Google và email magic link
- [ ] Passcode 6 số do người dùng tự đặt, lưu dạng hash (argon2) (rule 5)
- [ ] Cảnh báo passcode dễ đoán nhưng vẫn cho lưu (rule 6)
- [ ] Phiên edit bằng httpOnly cookie có ký, gắn với `planId` và phiên bản passcode
- [ ] Phân quyền: xem (ai có link), chỉnh sửa (có passcode hoặc chủ account), xóa (chủ account, hoặc người có passcode với plan không có account) (rule 3, 7)
- [ ] Sai passcode 5 lần liên tiếp thì khóa nhập passcode 12 giờ; thiết bị đã có quyền edit không bị ảnh hưởng (rule 9)
- [ ] Rate limit theo IP cho việc mở plan và nhập passcode

## 8. Email khôi phục và đổi passcode

- [ ] Tích hợp Resend và tạo template email (tiếng Việt và English)
- [ ] Nhập email khôi phục khi tạo plan và xác nhận qua link (rule 10)
- [ ] Cho thêm email khôi phục sau nếu plan chưa có; không cho sửa khi đã xác nhận (rule 10)
- [ ] Email mở khóa: tối đa một email cho mỗi lần khóa, mở link thì gỡ khóa ngay (rule 9)
- [ ] Đổi passcode qua link: cùng một thông báo dù email đúng hay sai, link dùng một lần và hết hạn sau 1 giờ (rule 11)
- [ ] Sau khi đổi passcode: vô hiệu phiên edit cũ, gỡ khóa nhập passcode (rule 11)
- [ ] Giới hạn số lần gửi email đổi passcode
- [ ] Token trong email: dùng một lần, có hạn, lưu dạng hash

## 9. Edit lock

- [ ] Lấy edit lock khi vào chế độ chỉnh sửa (rule 8)
- [ ] Gửi heartbeat khoảng 30 giây một lần khi người dùng còn thao tác; nhả lock khi thoát hoặc sau 5 phút không thao tác
- [ ] Màn hình chỉ xem kèm thông báo đang có người chỉnh sửa
- [ ] Server kiểm tra lock ở mọi API ghi; từ chối lưu khi lock đã hết hạn
- [ ] Xử lý đóng tab và mất kết nối

## 10. Kế hoạch (plan)

- [ ] Tạo plan: tên, địa điểm, ngày bắt đầu/kết thúc, ghi chú, đơn vị tiền tệ (mặc định `$`), theme, passcode, email khôi phục
- [ ] Không cho lưu khi ngày kết thúc trước ngày bắt đầu (rule 2)
- [ ] Danh sách plan của account
- [ ] Trang xem plan qua link chia sẻ, không cần đăng nhập
- [ ] Sửa thông tin plan
- [ ] Xóa plan có hộp thoại xác nhận (rule 22)
- [ ] Thẻ preview (Open Graph) khi gửi link qua Zalo/Messenger
- [ ] Tải lại dữ liệu khi người dùng quay lại tab, để đồng bộ giữa các thiết bị

## 11. Người tham gia

- [ ] Thêm người tham gia, sửa tên hiển thị
- [ ] Plan có account: tự động thêm chủ account thành người tham gia khi tạo plan (rule 26)
- [ ] Hỏi "Bạn là ai?" lần đầu edit trên thiết bị; lưu lựa chọn trên thiết bị, cho đổi lại hoặc bỏ qua; hỏi lại khi người đã chọn rời plan (rule 27)
- [ ] Đánh dấu đã rời plan; không xóa vật lý khi đã có chi phí (rule 13)
- [ ] Đánh dấu đã thanh toán, tránh xác nhận trùng (rule 23)
- [ ] Quản lý đợt đóng góp

## 12. Lịch trình

- [ ] Thêm, sửa, xóa hoạt động
- [ ] Sắp xếp thứ tự hoạt động trong ngày
- [ ] Lưu link bản đồ
- [ ] Hiển thị chi phí gắn với hoạt động hoặc ngày giờ tương ứng (rule 25)
- [ ] Đầu mỗi ngày hiện nơi ở đêm đó; ngày di chuyển hiện cả hai nơi (rule 32)

## 13. Nơi ở

- [ ] Thêm, sửa, xóa nơi ở: tên, khu vực, quốc gia, địa chỉ, link bản đồ, ngày nhận/trả phòng (rule 31)
- [ ] Kiểm tra ngày nơi ở nằm trong ngày của plan và không chồng nhau; cho phép đêm không có nơi ở (rule 31)
- [ ] Cho thêm nơi ở ngay khi tạo plan (có thể bỏ qua) hoặc thêm sau trong plan
- [ ] Chọn quốc gia từ danh sách (tên hiển thị theo ngôn ngữ người dùng, lưu mã ISO); khu vực nhập tự do
- [ ] Cảnh báo khi đổi ngày plan làm nơi ở hoặc món ăn nằm ngoài khoảng ngày mới; không xóa âm thầm

## 14. Danh sách món ăn

- [ ] Mục "Ăn gì": danh sách món theo từng ngày, chia 4 bữa sáng, trưa, chiều, tối (rule 33)
- [ ] Thêm, sửa, xóa, kéo để sắp xếp món: tên món, quán (tùy chọn), link bản đồ, ghi chú (rule 33)
- [ ] Đầu mỗi ngày hiện nơi ở để biết ăn quanh đâu (rule 32)
- [ ] Trạng thái trống cho bữa chưa có món, có nút thêm cho người có quyền chỉnh sửa
- [ ] Người xem qua link xem được danh sách, không sửa được
- [ ] Chừa chỗ cho lối vào Gợi ý quán ăn trong mục "Ăn gì" (ẩn trong MVP, dùng cho Phase 2)

## 15. Chi phí

- [ ] Form chi phí: mô tả, số tiền, người trả, ngày giờ, ghi chú, hoạt động liên kết, người chia và tỷ lệ
- [ ] Người trả mặc định là người tham gia đã chọn trên thiết bị, có thể đổi (rule 15, 27)
- [ ] Chỉ chọn được người đang tham gia (rule 12)
- [ ] Cảnh báo chi phí có người đã rời; sửa chi phí đó cần thao tác xác nhận riêng (rule 21)
- [ ] Tính lại kết quả khi thêm, sửa, xóa chi phí (rule 20)

## 16. Tổng kết và chia sẻ

- [ ] Màn hình tổng kết: đã trả/đã chi, tổng chi phí, số cần đóng góp, đợt đóng góp, trạng thái đã thanh toán
- [ ] Chọn người nhận phần dư làm tròn (rule 19)
- [ ] Share link mở thẳng màn hình tổng kết (Web Share API và nút copy link)
- [ ] Export tổng kết thành ảnh

## 17. Job định kỳ

- [ ] Cron xóa plan không có account sau 30 ngày kể từ lần cập nhật cuối, xóa theo batch (rule 24)
- [ ] Dọn token và lock đã hết hạn
- [ ] Xóa ảnh nền trên storage khi plan bị xóa hoặc hết hạn (rule 30)

## 18. Kiểm thử và phát hành

- [ ] E2E luồng chính: tạo plan, thêm người, thêm chi phí, xem tổng kết, share
- [ ] E2E passcode: nhập sai 5 lần, mở khóa qua email, đổi passcode
- [ ] E2E edit lock với hai trình duyệt
- [ ] E2E đổi ngôn ngữ, chọn và đổi theme của plan; chạy luồng chính bằng cả tiếng Việt và English
- [ ] E2E tải ảnh nền, chọn vùng hiển thị, gỡ ảnh; kiểm tra ảnh đã mất thông tin vị trí
- [ ] E2E plan có nhiều nơi ở và danh sách món ăn theo bữa
- [ ] Kiểm tra giao diện trên điện thoại và desktop, ở mọi theme
- [ ] Cài error tracking (Sentry) và logging
- [ ] Đối chiếu toàn bộ Acceptance Criteria trong requirements
- [ ] Deploy production và gắn domain

## Sau MVP

Kế hoạch chi tiết: [food-suggestions.md](food-suggestions.md)

### Phase 2: Gợi ý quán ăn từ cộng đồng (không dùng AI)

- [ ] Chốt: loại link quán được nhận, vị trí trong plan (tab riêng hay gộp "Ăn uống"), cách hiển thị tác giả, chủ quán có được tự đăng không
- [ ] Thiết kế lại UI: mục "Gợi ý quán ăn" ở màn hình chính, lối vào từ plan, màn đăng danh sách, màn áp dụng vào plan
- [ ] Bảng `FoodGuide`, `FoodGuideEntry`, `GuideVote`, `GuideReport`
- [ ] FoodItem: cho phép `date` trống (nhóm "Chưa xếp ngày"), thêm `source` và mã danh sách gốc
- [ ] Đăng danh sách (cần đăng nhập): tiêu đề, khu vực, mô tả, các mục gồm tên món, tên quán, link quán, bữa, ghi chú; xem trước khi đăng
- [ ] Huy hiệu "Người địa phương" khi tác giả đánh dấu "Tôi sống ở đây"
- [ ] Tạo nhanh danh sách từ danh sách món của một plan (không lấy tên người, chi phí)
- [ ] Tác giả sửa, gỡ danh sách; danh sách đã đăng độc lập với plan
- [ ] Tìm theo điểm đến (gợi ý tên thành phố khi gõ); trong plan hiện sẵn các khu vực nơi ở
- [ ] Sắp kết quả theo lượt hữu ích, lượt áp dụng, độ mới; lọc theo bữa và ngôn ngữ
- [ ] Áp dụng cả danh sách hoặc từng mục vào plan: vào nhóm "Chưa xếp ngày", kéo vào ngày; hoặc chọn thẳng ngày và bữa
- [ ] Chỉ nhận link bản đồ cho link quán (Google Maps, Apple Maps, OpenStreetMap)
- [ ] Nút "Hữu ích" (cần đăng nhập) và "Báo cáo" có lý do (rate limit theo IP)
- [ ] Kiểm duyệt: lọc từ ngữ thô tục, tối đa 5 danh sách mỗi ngày mỗi tài khoản, tự ẩn khi bị 3 người báo cáo
- [ ] Trang admin: xem danh sách bị báo cáo, khôi phục hoặc gỡ, khóa tài khoản spam
- [ ] Điều khoản sử dụng cho nội dung người dùng đăng; xin đồng ý khi đăng lần đầu
- [ ] Đăng sẵn danh sách cho 20–30 điểm đến phổ biến trước khi mở; trạng thái trống mời người địa phương đăng
- [ ] E2E: đăng danh sách, tìm theo điểm đến, áp dụng vào plan, báo cáo

### Ý tưởng sau đó

- [ ] Trang "Quán được nhắc đến nhiều nhất" của mỗi khu vực
- [ ] Theo dõi tác giả địa phương
- [ ] Ảnh món ăn trong danh sách (cần kiểm duyệt ảnh)
- [ ] Bình luận hoặc hỏi tác giả về quán
- [ ] Đánh dấu món "đã ăn" và chấm điểm
- [ ] Liên kết món ăn với khoản chi phí
