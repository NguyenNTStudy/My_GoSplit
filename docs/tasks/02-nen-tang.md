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

- [ ] Prisma schema theo [data model](../data-model/README.md): Plan, Participant, Activity, Expense, ExpenseShare, Contribution, EmailToken
- [ ] Field `collectorParticipantId` của plan, mặc định là người tham gia đại diện chủ plan; đổi thì xóa QR (R54)
- [ ] QR chuyển khoản của plan (tối đa một QR mỗi plan, của người thu tiền): đường dẫn ảnh trong storage riêng tư, nhãn, thời điểm cập nhật (R54)
- [ ] Bảng Stay (nơi ở, có khu vực và mã quốc gia) và FoodItem (món ăn) (R31, R33)
- [ ] FoodItem: không có `date`; `mealSlots` là mảng buổi (sáng, chiều, tối), có thể trống; `directions` (đường đến quán, nhập tự do) thay cho `mapLink`; không lưu liên kết tới danh sách gợi ý gốc (R33, R41)
- [ ] Bảng FoodGuide, FoodGuideEntry, GuideVote, GuideReport (R35–R45)
- [ ] Bảng ghi lại danh sách gợi ý nào đã áp dụng vào plan nào, để mỗi plan chỉ tính một lượt sử dụng (R41)
- [ ] Bảng Itinerary, ItineraryActivity, ItineraryStay, ItineraryFood, ItineraryVote, ItineraryReport; `sourcePlanId` duy nhất, đặt trống khi xóa plan (R63–R69)
- [ ] Lưu thêm bản không dấu của khu vực (Stay, FoodGuide, Itinerary, ItineraryStay); bật extension `unaccent`, `pg_trgm` và tạo index trigram (R34)
- [ ] Field ngôn ngữ, `displayName`, `username` (duy nhất, chữ thường), `userTag` (duy nhất), quyền admin và trạng thái bị khóa của account (R28, R37, R44, R78)
- [ ] Bảng/field cho passcode lock, edit lock và email token của link mở khóa (R9)
- [ ] Field `currency` (mã ISO 4217) của plan và hành trình; server chỉ nhận mã có trong danh sách tiền tệ, và chỉ cho đổi khi plan chưa có khoản chi, tiền đóng và tổng kết đang mở (R1, R72)
- [ ] Field `summaryStatus` (`open`, `locked`, `final`) và `summaryStatusChangedAt` của plan; server chặn ghi Participant, Activity, Expense, ExpenseShare khi tổng kết đang `locked` hoặc `final`; không cho đổi khỏi `final` (R59)
- [ ] Field `theme` của plan (R29)
- [ ] Field `coverImage` của plan: đường dẫn ảnh và vùng hiển thị (R30)
- [ ] `planId` dạng `VARCHAR`, sinh ngẫu nhiên 10 chữ số bằng crypto, trùng thì sinh lại (R4)
- [ ] Field `shareKey` của plan: chuỗi ngẫu nhiên ít nhất 128 bit, sinh bằng crypto, dạng an toàn cho URL (R3)
- [ ] Mã định danh ngẫu nhiên (UUID hoặc cuid) cho mọi bảng khác, không dùng số tự tăng (R49)
- [ ] Lưu số tiền dạng `NUMERIC(14,3)`, tỷ lệ dạng `NUMERIC`
- [ ] Index: `(ownerId, startDate)`, `(planId, dateTime)` của Expense và Activity, `(planId, order)` của FoodItem, các khóa ngoại `planId` (R33, R60)
- [ ] Xóa plan thì xóa cascade toàn bộ dữ liệu con (R22)
- [ ] Cập nhật `plan.updatedAt` khi bất kỳ dữ liệu con nào thay đổi
- [ ] Seed data cho môi trường dev

## 4. Logic nghiệp vụ (`src/domain`)

- [ ] Chia chi phí theo tỷ lệ bằng decimal.js (R16, R17)
- [ ] Validate số tiền > 0; tiền tệ không có phần lẻ chỉ nhận số nguyên, tiền tệ khác tối đa 3 chữ số thập phân; tỷ lệ > 0 (R14, R16, R18)
- [ ] Tính cho từng người: chi tiêu, đã đóng (tiền đóng trừ trả lại, cộng khoản tự trả), còn thiếu hoặc dư; số người đã đủ; số tiền người thu tiền đang giữ (R76)
- [ ] Làm tròn ở kết quả cuối theo bước làm tròn của tiền tệ (0,5; 1.000 với VND…): chi tiêu và còn thiếu làm tròn lên, dư làm tròn xuống; tổng sau làm tròn được phép lớn hơn tổng chi (R18, R19)
- [ ] Danh sách tiền tệ: script sinh JSON từ ISO 4217 và CLDR (mã, tên tiếng Việt và tiếng Anh, ký hiệu, số chữ số lẻ, các nước dùng), cộng bảng bước làm tròn và nhóm phổ biến viết tay; commit file JSON để mọi trình duyệt thấy cùng một danh sách (R1, R19, R71)
- [ ] Tìm tiền tệ theo mã, tên tiền tệ, tên nước và ký hiệu, dùng chung hàm chuẩn hóa không dấu với khu vực (R34, R71)
- [ ] Chọn tiền tệ mặc định khi tạo plan: tiền tệ của plan tạo gần nhất, vùng của trình duyệt, rồi ngôn ngữ (R70)
- [ ] Tiền đóng không tính vào chi tiêu; "Đã đóng đủ" và "Đã trả lại" ghi một khoản bằng đúng số còn thiếu hoặc số dư (R23)
- [ ] Ghi tiền đóng hàng loạt: cùng số tiền hoặc mỗi người một số, mỗi người một khoản, chung `batchId`; không ghi khoản bằng không (R75)
- [ ] Validate tên plan và tiêu đề hành trình: 1–50 ký tự sau khi bỏ khoảng trắng đầu cuối, đếm sau khi chuẩn hóa NFC (R73)
- [ ] Chuẩn hóa khu vực để tìm kiếm: bỏ dấu, chữ thường, `đ` thành `d`, gộp khoảng trắng; dùng chung cho nơi ở, danh sách gợi ý và hành trình (R34)
- [ ] Đếm số quán khác nhau trong danh sách gợi ý: so tên quán đã chuẩn hóa như khu vực (R35)
- [ ] Nhận biết mục trùng với món đã có trong plan (cùng món, cùng quán) khi áp dụng danh sách gợi ý (R41)
- [ ] Tạo hành trình từ plan đã chốt: đổi ngày thật thành số thứ tự ngày, bỏ hoạt động ngoài khoảng ngày, chỉ lấy các field được phép; tính số người và chi phí ước tính mỗi người, làm tròn như R19 (R64, R65)
- [ ] Sao chép hành trình thành plan mới: đổi số thứ tự ngày thành ngày thật theo ngày bắt đầu, giữ giờ của hoạt động (R68)
- [ ] Unit test cho mọi edge case về tính tiền (cả tiền tệ có và không có phần lẻ, tiền đóng, trả lại, người tự trả khoản chi), chọn và tìm tiền tệ, chuẩn hóa khu vực, đếm quán, nhận biết mục trùng, tạo và sao chép hành trình

## 5. Đa ngôn ngữ

- [ ] Cài next-intl với 2 ngôn ngữ: Tiếng Việt và English (R28)
- [ ] Đưa toàn bộ chữ trên giao diện vào file dịch `messages/vi.json` và `messages/en.json`, không viết cứng chữ trong component
- [ ] Tên app theo ngôn ngữ: Góp Gạo / GoSplit (tiêu đề trang, manifest, email, thẻ preview)
- [ ] Lần đầu dùng ngôn ngữ của trình duyệt, ngôn ngữ khác thì dùng English; cho đổi trong menu cài đặt (R28)
- [ ] Lưu lựa chọn ngôn ngữ trên thiết bị; lưu theo account khi đã đăng nhập (R28)
- [ ] Link chia sẻ không chứa ngôn ngữ; người mở link thấy plan theo ngôn ngữ của họ (R28)
- [ ] Định dạng ngày giờ và thứ trong tuần theo ngôn ngữ
- [ ] Định dạng số tiền theo ngôn ngữ và tiền tệ của plan bằng `Intl.NumberFormat` (ký hiệu ngắn, chỉ hiện phần lẻ khi tiền tệ có phần lẻ); nhận đúng dấu thập phân khi nhập (`,` hoặc `.`); tiền tệ không có phần lẻ thì `.` và `,` đều là dấu phân cách hàng nghìn (R1, R18, R28)
- [ ] Rút gọn số tiền là bội số của 1.000: `k` trong tiếng Việt, `K` trong tiếng Anh, ở mọi nơi hiển thị kể cả ảnh xuất; ô nhập nhận hậu tố `k`/`K` (R74)
- [ ] Dịch thông báo lỗi validation (Zod)
- [ ] Gửi email theo ngôn ngữ người dùng đang dùng khi yêu cầu (R28)
- [ ] Kiểm tra thiếu key dịch trong CI

## 6. Theme

- [ ] Định nghĩa design token (màu, font, bo góc, khoảng cách) bằng CSS variables; mỗi theme gồm một bộ token và một bộ hình (R29)
- [ ] Chọn theme khi tạo plan, có xem trước (R29)
- [ ] Màu trạng thái tiền cố định, không theo theme: xanh lá cho đủ hoặc dư, đỏ cho thiếu; số tiền không kèm chữ nhưng có nhãn cho trình đọc màn hình (R77)
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

- [ ] Tích hợp Better Auth: đăng nhập Google, đăng ký bằng email và mật khẩu (xác nhận email, quên mật khẩu); dùng chung một tài khoản khi trùng email (R61)
- [ ] Bật plugin username của Better Auth: đăng ký với tên hiển thị, username, email, mật khẩu; đăng nhập bằng email hoặc username; báo username trùng khi gõ; lần đầu vào bằng Google thì hỏi username; sai thông tin nào cũng cùng một thông báo; đổi tên hiển thị và username trong tài khoản (R78)
- [ ] Bắt buộc đăng nhập mới tạo được plan; xem và sửa bằng passcode không cần đăng nhập (R61)
- [ ] Passcode 6 số do người dùng tự đặt, lưu dạng hash (argon2) (R5)
- [ ] Cảnh báo passcode dễ đoán nhưng vẫn cho lưu (R6)
- [ ] Phiên edit bằng httpOnly cookie có ký, gắn với `planId` và phiên bản passcode
- [ ] Phân quyền: xem (ai có link), chỉnh sửa (có passcode hoặc chủ account), xóa (chỉ chủ plan) (R3, R7)
- [ ] Sai passcode 5 lần liên tiếp thì khóa nhập passcode của plan 12 giờ; thiết bị đã có quyền edit không bị ảnh hưởng (R9)
- [ ] Quyền admin: chỉ account được chỉ định mới vào được trang admin; account bị khóa không đăng, bấm "Hữu ích" hay báo cáo được (R44)

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

## 10. Email và đổi passcode

- [ ] Tích hợp Resend và tạo template email (tiếng Việt và English): xác nhận email tài khoản, đặt lại mật khẩu, mở khóa nhập passcode
- [ ] Email mở khóa: tối đa một email cho mỗi lần khóa, mở link thì gỡ khóa ngay (R9)
- [ ] Chủ plan đổi passcode trong cài đặt plan, không cần link email (R11)
- [ ] Sau khi đổi passcode: vô hiệu phiên edit cũ, gỡ khóa nhập passcode (R11)
- [ ] Token trong email: dùng một lần, có hạn, lưu dạng hash

## 11. Edit lock

- [ ] Lấy edit lock khi vào chế độ chỉnh sửa (R8)
- [ ] Gửi heartbeat khoảng 30 giây một lần khi người dùng còn thao tác; nhả lock khi thoát hoặc sau 5 phút không thao tác
- [ ] Màn hình chỉ xem kèm thông báo đang có người chỉnh sửa
- [ ] Server kiểm tra lock ở mọi API ghi; từ chối lưu khi lock đã hết hạn
- [ ] Xử lý đóng tab và mất kết nối
