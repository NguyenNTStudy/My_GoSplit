# Chuẩn bị: chốt requirements và giao diện

Tech stack và thứ tự làm: [README](README.md).

## 0. Chốt requirements

- [x] Chốt tên app: Góp Gạo (tiếng Việt) / GoSplit (tiếng Anh)
- [x] Chốt cách xác định "ai đang thao tác" trên mỗi thiết bị (R26, R27)
- [x] Đưa Gợi ý quán ăn từ cộng đồng vào MVP (R34–R45)
- [x] Khu vực nhập tự do, tìm gần đúng theo chữ không dấu (R34)
- [x] Đơn vị tiền tệ cố định `$`; vẫn giữ field `currencyUnit` để mở rộng sau (R1)
- [x] Khóa nhập passcode theo plan, không giới hạn theo IP (R9)
- [x] Làm tròn lên đến bội số 0,5 gần nhất; không cần chọn người nhận phần dư, phần chênh lệch thuộc về người thu tiền (R19)
- [x] Đường đến quán nhập tự do, nhận mọi loại link (R36)
- [x] Username không cần duy nhất, hiển thị kèm huy hiệu tag; chủ quán được đăng; danh sách gợi ý cần ít nhất 3 quán khác nhau; không giới hạn số danh sách đăng mỗi ngày (R35, R37, R45)
- [x] Áp dụng được nhiều danh sách gợi ý vào một plan, món đã áp dụng tự sửa được; mỗi lần áp dụng vào một plan tăng lượt sử dụng (R41)
- [x] Bảo vệ dữ liệu và chống crawl (R46–R53)
- [x] Không cho công cụ tìm kiếm lập chỉ mục plan và danh sách gợi ý (R46)
- [x] Chốt câu hỏi mở: trang hồ sơ tác giả để sau MVP; link chia sẻ có khóa bí mật (R3)
- [x] Tải một QR chuyển khoản duy nhất của người thu tiền trong mục tổng kết; quyền giống các thao tác chỉnh sửa khác; ảnh xuất tổng kết mặc định kèm QR (R54–R57)
- [x] Ảnh nền riêng và ảnh QR: ai mở được plan đều thấy, nhưng file ảnh không có địa chỉ công khai riêng, chỉ tải qua link plan (R30, R57)
- [x] Chia requirements và tasks thành các file dưới 200 dòng; bỏ bản tiếng Anh của requirements
- [x] Vẽ data model (ERD) từ phần Dữ liệu của các module requirements: [data-model](../data-model/README.md)
- [x] Chốt quy tắc xóa người tham gia, gỡ danh sách gợi ý và lượt sử dụng (R13, R26, R39, R41, R44)
- [x] Xóa hoạt động thì xóa luôn khoản chi phí gắn vào; tổng kết có tạm khóa (mở lại được) và chốt cuối cùng (không mở lại được); khi khóa thì không sửa người tham gia, hoạt động, chi phí (R58, R59)
- [x] Danh sách có ngày giờ hiển thị theo thời gian tăng dần; lịch trình và chi phí xem theo "Tất cả" hoặc từng ngày (R60)
- [x] Danh sách món ăn là một danh sách chung, không chia theo ngày; biểu tượng buổi và nhãn ngày; lọc theo ngày và buổi (R33)
- [x] Kế hoạch chỉ có ngày; hoạt động có ngày giờ dự kiến; chỉ người có quyền chỉnh sửa được tạm khóa, mở khóa và chốt tổng kết (R59, R60)

## 1. Chốt giao diện

- [x] Chọn style giao diện: Gạo ấm (style 3 trong [canvas wireframe](https://claude.ai/artifact/6iUe9YoLbxwwiQHG7R47o9))
- [x] Chốt vị trí Gợi ý quán ăn trong plan: tab riêng, tách khỏi "Ăn gì"
- [ ] Wireframe theo style Gạo ấm cho cả điện thoại và desktop: danh sách plan, tạo plan, chi tiết plan (lịch trình, người tham gia, chi phí, tổng kết kèm QR chuyển khoản), form chi phí, nhập passcode, đổi passcode, đổi link chia sẻ, nơi ở, danh sách món ăn (biểu tượng buổi, nhãn ngày, bộ lọc)
- [ ] Wireframe Gợi ý quán ăn: mục "Gợi ý quán ăn" ở màn hình chính, tab "Gợi ý quán" trong plan, tìm theo điểm đến, xem danh sách gợi ý (username kèm huy hiệu tag), chọn username, đăng danh sách gợi ý, áp dụng vào plan, báo cáo, trang admin
- [ ] Màn hình kiểm tra chống bot khi vượt giới hạn truy cập
- [ ] Chốt danh sách theme cho MVP (đề xuất: Gạo ấm, Biển, Núi rừng, Phố cổ, Đêm)
- [ ] Chuẩn bị hình minh họa cho từng theme (tự vẽ, thuê vẽ hoặc mua từ thư viện có license dùng thương mại)
- [ ] Thiết kế từng theme trên các màn hình chính
