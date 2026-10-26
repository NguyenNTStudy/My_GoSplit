# Kiểm thử, phát hành và sau MVP

Tech stack và thứ tự làm: [README](README.md).

## 22. Kiểm thử và phát hành

- [ ] E2E luồng chính: tạo plan, thêm người, thêm chi phí, xem tổng kết, share
- [ ] E2E thứ tự hiển thị: thêm chi phí và hoạt động không theo thứ tự thời gian rồi kiểm tra danh sách sắp tăng dần; lọc theo từng ngày; chi phí trước chuyến đi chỉ hiện ở "Tất cả"
- [ ] E2E passcode: nhập sai 5 lần, mở khóa qua email, đổi passcode
- [ ] E2E edit lock với hai trình duyệt
- [ ] E2E đổi ngôn ngữ, chọn và đổi theme của plan; chạy luồng chính bằng cả tiếng Việt và English
- [ ] E2E tải ảnh nền, chọn vùng hiển thị, gỡ ảnh; kiểm tra ảnh đã mất thông tin vị trí
- [ ] E2E plan có nhiều nơi ở và danh sách món ăn: gán ngày, buổi cho món; lọc theo ngày, theo buổi và "Chưa xếp ngày"
- [ ] E2E khóa và chốt tổng kết: xóa hoạt động có chi phí rồi kiểm tra tổng kết tính lại; tạm khóa, thử sửa chi phí thì bị chặn, mở khóa rồi sửa được; chốt cuối cùng thì không mở lại được; vẫn đánh dấu đã thanh toán được
- [ ] E2E QR chuyển khoản: tải QR, tải QR thứ hai thì thay QR cũ, ảnh không có QR bị từ chối, người xem thấy QR, export có và không kèm QR, đổi khóa chia sẻ thì địa chỉ ảnh cũ hết hiệu lực
- [ ] E2E Gợi ý quán ăn: chọn username, đăng danh sách gợi ý, tìm theo điểm đến (có dấu và không dấu), áp dụng hai danh sách vào một plan rồi sửa món, báo cáo đến khi bị ẩn, admin khôi phục
- [ ] E2E chống crawl: dò nhiều mã plan liên tục thì phải qua kiểm tra chống bot rồi bị chặn; mở bằng `planId` không có khóa hoặc sai khóa thì không thấy plan; đổi khóa thì link cũ hết dùng được; dữ liệu gửi cho người xem không chứa thông tin nhạy cảm
- [ ] Kiểm tra giao diện trên điện thoại và desktop, ở mọi theme
- [ ] Cài error tracking (Sentry) và logging; không ghi passcode hay IP chưa hash vào log
- [ ] Đăng sẵn danh sách gợi ý cho 20–30 điểm đến phổ biến trước khi phát hành
- [ ] Đối chiếu toàn bộ Acceptance Criteria trong các module requirements
- [ ] Deploy production và gắn domain

## Sau MVP

Requirements: [Dự kiến sau MVP](../requirements/README.md)

- [ ] Cho mỗi plan chọn đơn vị tiền tệ
- [ ] Liên kết món ăn với khoản chi phí
- [ ] Trang "Quán được nhắc đến nhiều nhất" của mỗi khu vực
- [ ] Trang hồ sơ tác giả: thông tin tác giả và các danh sách gợi ý đã đăng, nhóm theo khu vực
- [ ] Theo dõi tác giả địa phương
- [ ] Ảnh món ăn trong danh sách gợi ý (cần kiểm duyệt ảnh)
- [ ] Bình luận hoặc hỏi tác giả về quán
- [ ] Đánh dấu món "đã ăn" và chấm điểm
