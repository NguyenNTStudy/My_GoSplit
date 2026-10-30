# Kiểm thử, phát hành và sau MVP

Tech stack và thứ tự làm: [README](README.md).

## 24. Kiểm thử và phát hành

- [ ] E2E luồng chính: tạo plan, thêm người, thêm chi phí, xem tổng kết, share
- [ ] E2E tiền đóng: ghi Đợt 1 cùng số tiền cho cả nhóm, ghi Đợt 2 mỗi người một số; tổng kết hiện đúng chi tiêu, đã đóng, còn thiếu và dư; người tự trả tiền phòng thì dư; bấm "Đã đóng đủ" và "Đã trả lại" thì người đó chuyển sang đủ; đổi người thu tiền thì QR bị gỡ
- [ ] E2E tên plan: 50 ký tự lưu được, 51 ký tự bị từ chối, chữ có dấu gõ bằng bộ gõ khác nhau vẫn đếm đúng; số tiền tròn nghìn hiện `k` (tiếng Việt) và `K` (English); gõ `50k` ra `50.000`
- [ ] E2E tiền tệ: tạo plan VND, nhập `50.000` và `50,000` đều ra năm mươi nghìn, `50,5` bị từ chối; chia `100.000 ₫` cho 3 người ra `34.000 ₫` mỗi người; plan USD làm tròn 0,5; tìm `nhat`, `yen`, `JPY` đều ra Yên Nhật; có khoản chi thì không đổi được tiền tệ; plan tạo sau được chọn sẵn tiền tệ của plan trước
- [ ] E2E đăng nhập: đăng ký với tên hiển thị, username, email và mật khẩu; username trùng bị báo; đăng nhập bằng email và bằng username; xác nhận email, quên mật khẩu; đăng nhập Google lần đầu thì chọn username; chưa đăng nhập thì không tạo được plan
- [ ] E2E độ dài plan: 60 ngày lưu được, 61 ngày bị từ chối cả ở form và ở API (R2)
- [ ] E2E plan 10 ngày: thêm hoạt động vào Ngày 9 qua ô chọn ngày (phải cuộn danh sách); chuyển một hoạt động từ Ngày 1 sang Ngày 10 bằng nút "Chuyển"; danh sách ghi đúng số hoạt động mỗi ngày (R82); trên desktop, thả một hoạt động vào Ngày 10 ở cột danh sách ngày (R81)
- [ ] E2E thứ tự hiển thị: thêm chi phí và hoạt động không theo thứ tự thời gian rồi kiểm tra danh sách sắp tăng dần, hoạt động không có giờ nằm cuối ngày, xóa giờ thì hoạt động xuống cuối ngày; lọc theo từng ngày; chi phí trước chuyến đi chỉ hiện ở "Tất cả"
- [ ] E2E passcode: nhập sai 5 lần, mở khóa qua email, đổi passcode
- [ ] E2E edit lock với hai trình duyệt
- [ ] E2E đổi ngôn ngữ, chọn và đổi theme của plan; chạy luồng chính bằng cả tiếng Việt và English
- [ ] E2E tải ảnh nền, chọn vùng hiển thị, gỡ ảnh; kiểm tra ảnh đã mất thông tin vị trí
- [ ] E2E plan có nhiều nơi ở và danh sách món ăn: chọn nhiều buổi cho một món; lọc theo buổi
- [ ] E2E khóa và chốt tổng kết: xóa hoạt động có chi phí rồi kiểm tra tổng kết tính lại; tạm khóa, thử sửa chi phí thì bị chặn, mở khóa rồi sửa được; chốt cuối cùng thì không mở lại được; vẫn ghi tiền đóng được
- [ ] E2E thành viên: chủ plan tạo link mời quyền Xem cho Bình; Bình đăng nhập, tham gia, thấy plan ở Đang tham gia, không sửa được; nhập passcode thì sửa được trên thiết bị đó nhưng quyền vẫn là Xem; chủ plan đổi sang Sửa thì Bình sửa được không cần passcode; mở lại link đã dùng thì báo hết hiệu lực; đổi khóa chia sẻ và passcode không ảnh hưởng thành viên (R84, R85)
- [ ] E2E chiêu mộ: chủ plan đăng tin cần 1 người; người khác thấy tin ở tab Chiêu mộ, không thấy tên người tham gia hay chi phí; gửi yêu cầu kèm Zalo; gửi lần hai cho cùng tin thì bị chặn; chủ plan thấy liên hệ, duyệt với quyền Xem; người gửi thành thành viên và người tham gia, plan hiện ở Đang tham gia; tin tự đóng vì đủ chỗ; người ngoài không đọc được liên hệ qua API (R86–R91)
- [ ] E2E tim và trang người dùng: thả tim trên thẻ ở Khám phá rồi bỏ tim; chưa đăng nhập thì được mời đăng nhập; kết quả xếp theo số tim; mở trang người dùng từ tên tác giả, không có username hay email; tài khoản bị khóa thì trang không mở được (R42, R83)
- [ ] E2E QR chuyển khoản: tải QR, tải QR thứ hai thì thay QR cũ, ảnh không có QR bị từ chối, người xem thấy QR và bấm vào thì ảnh hiện lớn, export có và không kèm QR, đổi khóa chia sẻ thì địa chỉ ảnh cũ hết hiệu lực
- [ ] E2E Gợi ý quán ăn: đăng danh sách gợi ý, tìm theo điểm đến (có dấu và không dấu), áp dụng hai danh sách vào một plan rồi sửa món, báo cáo đến khi bị ẩn, admin khôi phục
- [ ] E2E Chia sẻ hành trình: chốt tổng kết rồi chia sẻ; bản đăng không có tên người, khoản chi, QR và ngày thật; tìm theo điểm đến; sao chép thành plan mới chỉ bằng chọn ngày đi, hoạt động đúng ngày và giờ; đổi ngày đi của plan mới thì hoạt động dời theo; trong plan 3 ngày có sẵn, chọn một phần hoạt động của hành trình 4 ngày rồi sao chép, hoạt động Ngày 4 vào mục Ngày chưa xác định, chuyển một hoạt động sang Ngày 3 bằng nút "Chuyển", thêm món ăn của hành trình, lượt sao chép chỉ tăng một; xóa plan gốc thì hành trình vẫn còn
- [ ] E2E chống crawl: dò nhiều mã plan liên tục thì phải qua kiểm tra chống bot rồi bị chặn; mở bằng `planId` không có khóa hoặc sai khóa thì không thấy plan; đổi khóa thì link cũ hết dùng được; dữ liệu gửi cho người xem không chứa thông tin nhạy cảm
- [ ] Kiểm tra giao diện trên điện thoại và desktop, ở mọi theme; màu trạng thái tiền giống nhau ở mọi theme (R77)
- [ ] Cài error tracking (Sentry) và logging; không ghi passcode hay IP chưa hash vào log
- [ ] Đăng sẵn danh sách gợi ý cho 20–30 điểm đến phổ biến trước khi phát hành
- [ ] Chia sẻ sẵn hành trình cho một số điểm đến phổ biến trước khi phát hành
- [ ] Đối chiếu toàn bộ Acceptance Criteria trong các module requirements
- [ ] Deploy production và gắn domain

## Sau MVP

Requirements: [Dự kiến sau MVP](../requirements/README.md)

- [ ] Liên kết món ăn với khoản chi phí
- [ ] Trang "Quán được nhắc đến nhiều nhất" của mỗi khu vực
- [ ] Trang người dùng: nhóm bài theo khu vực (MVP có trang người dùng cơ bản, R83)

- [ ] Đánh giá bạn đồng hành sau chuyến đi; gợi ý ghép nhóm theo điểm đến và ngày trùng nhau
- [ ] Theo dõi tác giả địa phương
- [ ] Ảnh món ăn trong danh sách gợi ý (cần kiểm duyệt ảnh)
- [ ] Bình luận hoặc hỏi tác giả về quán
- [ ] Đánh dấu món "đã ăn" và chấm điểm
