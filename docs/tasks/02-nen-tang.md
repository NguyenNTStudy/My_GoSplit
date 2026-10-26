# Nền tảng

Tech stack và thứ tự làm: [README](README.md).

## 2. Khởi tạo dự án

- [ ] Tạo tài khoản dịch vụ: GitHub, Vercel, Neon, Resend, Upstash, Cloudflare (Turnstile)
- [ ] Mua domain và cấu hình gửi email (SPF, DKIM) cho Resend
- [ ] Chốt cấu trúc repo: giữ code trong `go-split/` hay đưa lên gốc repo
- [ ] Tạo project Next.js + TypeScript (đã chạy create-next-app trong `go-split/`, chưa commit)
- [ ] Cấu hình ESLint, Prettier
- [ ] Tạo cấu trúc thư mục, tách logic nghiệp vụ vào `src/domain` (TypeScript thuần, không phụ thuộc Next.js)
- [ ] Cài Tailwind CSS + shadcn/ui
- [ ] Cài Prisma, kết nối Neon (dùng pooled connection)
- [ ] Cài Vitest và Playwright
- [ ] CI với GitHub Actions: lint, typecheck, test
- [ ] Deploy preview lên Vercel, cấu hình biến môi trường

## 3. Database

- [ ] Prisma schema theo [data model](../data-model/README.md): Plan, Participant, Activity, Expense, ExpenseShare, PaymentInstallment, EmailToken
- [ ] QR chuyển khoản của plan (tối đa một QR mỗi plan): người thu tiền (participant), đường dẫn ảnh trong storage riêng tư, nhãn, thời điểm cập nhật (R54)
- [ ] Bảng Stay (nơi ở, có khu vực và mã quốc gia) và FoodItem (món ăn) (R31, R33)
- [ ] FoodItem: `date` và `mealSlot` được để trống (chưa xếp ngày, chưa chọn buổi); `directions` (đường đến quán, nhập tự do) thay cho `mapLink`; không lưu liên kết tới danh sách gợi ý gốc (R33, R41)
- [ ] Bảng FoodGuide, FoodGuideEntry, GuideVote, GuideReport (R35–R45)
- [ ] Bảng ghi lại danh sách gợi ý nào đã áp dụng vào plan nào, để mỗi plan chỉ tính một lượt sử dụng (R41)
- [ ] Lưu thêm bản không dấu của khu vực (Stay, FoodGuide); bật extension `unaccent`, `pg_trgm` và tạo index trigram (R34)
- [ ] Field ngôn ngữ, username (không cần duy nhất), `userTag` (username + tag là duy nhất), quyền admin và trạng thái bị khóa của account (R28, R35, R37, R44)
- [ ] Bảng/field cho passcode lock, edit lock và email token (xác nhận email, mở khóa, đổi passcode)
- [ ] Field `currencyUnit` của plan, hiện luôn là `$` (R1)
- [ ] Field `summaryStatus` (`open`, `locked`, `final`) và `summaryStatusChangedAt` của plan; server chặn ghi Participant, Activity, Expense, ExpenseShare khi tổng kết đang `locked` hoặc `final`; không cho đổi khỏi `final` (R59)
- [ ] Field `theme` của plan (R29)
- [ ] Field `coverImage` của plan: đường dẫn ảnh và vùng hiển thị (R30)
- [ ] `planId` dạng `VARCHAR`, sinh ngẫu nhiên 10 chữ số bằng crypto, trùng thì sinh lại (R4)
- [ ] Field `shareKey` của plan: chuỗi ngẫu nhiên ít nhất 128 bit, sinh bằng crypto, dạng an toàn cho URL (R3)
- [ ] Mã định danh ngẫu nhiên (UUID hoặc cuid) cho mọi bảng khác, không dùng số tự tăng (R49)
- [ ] Lưu số tiền dạng `NUMERIC(14,3)`, tỷ lệ dạng `NUMERIC`
- [ ] Index: `(ownerType, updatedAt)`, `(ownerId, startDate)`, `(planId, dateTime)` của Expense và Activity, `(planId, date, mealSlot)` của FoodItem, các khóa ngoại `planId` (R33, R60)
- [ ] Xóa plan thì xóa cascade toàn bộ dữ liệu con (R22)
- [ ] Cập nhật `plan.updatedAt` khi bất kỳ dữ liệu con nào thay đổi (R24)
- [ ] Seed data cho môi trường dev

## 4. Logic nghiệp vụ (`src/domain`)

- [ ] Chia chi phí theo tỷ lệ bằng decimal.js (R16, R17)
- [ ] Validate số tiền > 0, tối đa 3 chữ số thập phân; tỷ lệ > 0 (R14, R16, R18)
- [ ] Tính tổng đã trả/đã chi và số tiền mỗi người cần đóng góp
- [ ] Làm tròn lên đến bội số 0,5 gần nhất ở kết quả cuối; tổng sau làm tròn được phép lớn hơn tổng chi (R18, R19)
- [ ] Xác nhận đã thanh toán không tính vào chi tiêu (R23)
- [ ] Đợt đóng góp: tách khỏi chi phí, cảnh báo khi tổng các đợt không khớp số tiền phải đóng
- [ ] Chuẩn hóa khu vực để tìm kiếm: bỏ dấu, chữ thường, `đ` thành `d`, gộp khoảng trắng; dùng chung cho nơi ở và danh sách gợi ý (R34)
- [ ] Đếm số quán khác nhau trong danh sách gợi ý: so tên quán đã chuẩn hóa như khu vực (R35)
- [ ] Nhận biết mục trùng với món đã có trong plan (cùng món, cùng quán) khi áp dụng danh sách gợi ý (R41)
- [ ] Unit test cho mọi edge case về tính tiền, chuẩn hóa khu vực, đếm quán và nhận biết mục trùng

## 5. Đa ngôn ngữ

- [ ] Cài next-intl với 2 ngôn ngữ: Tiếng Việt và English (R28)
- [ ] Đưa toàn bộ chữ trên giao diện vào file dịch `messages/vi.json` và `messages/en.json`, không viết cứng chữ trong component
- [ ] Tên app theo ngôn ngữ: Góp Gạo / GoSplit (tiêu đề trang, manifest, email, thẻ preview)
- [ ] Lần đầu dùng ngôn ngữ của trình duyệt, ngôn ngữ khác thì dùng English; cho đổi trong menu cài đặt (R28)
- [ ] Lưu lựa chọn ngôn ngữ trên thiết bị; lưu theo account khi đã đăng nhập (R28)
- [ ] Link chia sẻ không chứa ngôn ngữ; người mở link thấy plan theo ngôn ngữ của họ (R28)
- [ ] Định dạng ngày giờ và thứ trong tuần theo ngôn ngữ
- [ ] Định dạng số theo ngôn ngữ; nhận đúng dấu thập phân khi nhập số tiền (`,` hoặc `.`); ký hiệu `$` giữ nguyên (R1, R18, R28)
- [ ] Dịch thông báo lỗi validation (Zod)
- [ ] Gửi email theo ngôn ngữ người dùng đang dùng khi yêu cầu (R28)
- [ ] Kiểm tra thiếu key dịch trong CI

## 6. Theme

- [ ] Định nghĩa design token (màu, font, bo góc, khoảng cách) bằng CSS variables; mỗi theme gồm một bộ token và một bộ hình (R29)
- [ ] Chọn theme khi tạo plan, có xem trước (R29)
- [ ] Đổi theme trong phần sửa plan (R29)
- [ ] Áp theme của plan cho mọi người mở plan; các màn hình ngoài plan dùng Gạo ấm (R29)
- [ ] Tối ưu hình (WebP/AVIF, nhiều kích thước, lazy load) để tải nhanh trên điện thoại
- [ ] Hình chưa tải xong hoặc lỗi thì plan vẫn đọc được bằng màu của theme
- [ ] Chữ đặt trên hình có lớp phủ để đủ độ tương phản (WCAG AA)
- [ ] Ảnh export tổng kết và thẻ preview link dùng hình của theme (R29)
- [ ] Theme đã bị gỡ khỏi app thì plan dùng Gạo ấm
- [ ] Thêm theme mới chỉ cần thêm token và hình, không phải sửa component
- [ ] Đổi ảnh nền: người có quyền chỉnh sửa tải ảnh riêng thay hình của theme, gỡ ảnh để quay về hình theme (R30)
- [ ] Nhận JPG, PNG, WebP, HEIC tối đa 10 MB; tự thu nhỏ, nén và chuyển sang WebP (R30)
- [ ] Xóa thông tin vị trí (GPS) và metadata khác khỏi ảnh trước khi lưu (R30)
- [ ] Cho kéo để chọn vùng ảnh hiển thị (R30)
- [ ] Nhắc người tải ảnh rằng ai có link cũng xem được ảnh (R30)
- [ ] Ảnh export tổng kết và thẻ preview link dùng ảnh riêng nếu plan có (R30)

## 7. Web responsive và app (PWA)

- [ ] Layout responsive: điện thoại một cột; desktop tận dụng chiều ngang (ví dụ danh sách chi phí và tổng kết cạnh nhau)
- [ ] PWA: web app manifest, icon, màn hình khởi động, cài lên màn hình chính
- [ ] Kiểm tra cài đặt và sử dụng trên iOS Safari và Android Chrome

## 8. Auth và phân quyền

- [ ] Tích hợp Better Auth: đăng nhập Google và email magic link
- [ ] Passcode 6 số do người dùng tự đặt, lưu dạng hash (argon2) (R5)
- [ ] Cảnh báo passcode dễ đoán nhưng vẫn cho lưu (R6)
- [ ] Phiên edit bằng httpOnly cookie có ký, gắn với `planId` và phiên bản passcode
- [ ] Phân quyền: xem (ai có link), chỉnh sửa (có passcode hoặc chủ account), xóa (chủ account, hoặc người có passcode với plan không có account) (R3, R7)
- [ ] Sai passcode 5 lần liên tiếp thì khóa nhập passcode của plan 12 giờ; thiết bị đã có quyền edit không bị ảnh hưởng (R9)
- [ ] Quyền admin: chỉ account được chỉ định mới vào được trang admin; account bị khóa không đăng, bấm "Hữu ích" hay báo cáo được (R44)

## 9. Bảo mật dữ liệu và chống crawl

- [ ] Trang plan và trang danh sách gợi ý gắn `noindex` (thẻ meta và header `X-Robots-Tag`), không đưa vào sitemap (R46)
- [ ] Không chặn các trang này bằng `robots.txt`: công cụ tìm kiếm cần đọc được `noindex`; nếu bị chặn, link vẫn có thể hiện trong kết quả tìm kiếm (R46)
- [ ] Link chia sẻ dạng `/p/{planId}/{shareKey}`; sai mã hay sai khóa đều trả cùng trang "Không tìm thấy kế hoạch"; so khóa bằng phép so sánh constant-time (R3)
- [ ] Rate limit theo IP và thiết bị khi đọc plan; giới hạn chặt hơn khi tra sai mã plan hoặc sai khóa; ngưỡng đủ rộng cho cả nhóm dùng chung Wi-Fi (R47)
- [ ] Vượt giới hạn thì hiện Turnstile để kiểm tra chống bot, tiếp tục vượt thì chặn một thời gian (R47)
- [ ] Bật Vercel Firewall để lọc bot đã biết (R47)
- [ ] Mỗi API và server component chỉ trả field mà màn hình cần; test tự động bảo đảm passcode hash, email và mã tài khoản không có trong dữ liệu gửi cho người xem (R48)
- [ ] `Referrer-Policy: no-referrer` cho trang plan; link ra ngoài gắn `rel="noreferrer noopener"` (R50)
- [ ] Thẻ preview chỉ chứa tên plan, ngày và hình (R51)
- [ ] Tìm kiếm danh sách gợi ý: phân trang có giới hạn, không có API xuất hàng loạt, rate limit như trang plan (R52)
- [ ] Lưu IP dạng hash có salt (R53)
- [ ] Ảnh QR và ảnh nền riêng lưu ở storage riêng tư, không có URL công khai; trả ảnh qua route của app có kiểm tra `planId` và khóa chia sẻ, header `Cache-Control: private, no-store` (R30, R57)

## 10. Email khôi phục và đổi passcode

- [ ] Tích hợp Resend và tạo template email (tiếng Việt và English)
- [ ] Nhập email khôi phục khi tạo plan và xác nhận qua link (R10)
- [ ] Cho thêm email khôi phục sau nếu plan chưa có; không cho sửa khi đã xác nhận (R10)
- [ ] Email mở khóa: tối đa một email cho mỗi lần khóa, mở link thì gỡ khóa ngay (R9)
- [ ] Đổi passcode qua link: cùng một thông báo dù email đúng hay sai, link dùng một lần và hết hạn sau 1 giờ (R11)
- [ ] Sau khi đổi passcode: vô hiệu phiên edit cũ, gỡ khóa nhập passcode (R11)
- [ ] Giới hạn số lần gửi email đổi passcode
- [ ] Token trong email: dùng một lần, có hạn, lưu dạng hash

## 11. Edit lock

- [ ] Lấy edit lock khi vào chế độ chỉnh sửa (R8)
- [ ] Gửi heartbeat khoảng 30 giây một lần khi người dùng còn thao tác; nhả lock khi thoát hoặc sau 5 phút không thao tác
- [ ] Màn hình chỉ xem kèm thông báo đang có người chỉnh sửa
- [ ] Server kiểm tra lock ở mọi API ghi; từ chối lưu khi lock đã hết hạn
- [ ] Xử lý đóng tab và mất kết nối
