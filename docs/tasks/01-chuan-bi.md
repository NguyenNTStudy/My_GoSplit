# Chuẩn bị: chốt requirements và giao diện

Tech stack và thứ tự làm: [README](README.md).

## 0. Chốt requirements

- [x] Chốt tên app: Góp Gạo (tiếng Việt) / GoSplit (tiếng Anh)
- [x] Chốt cách xác định "ai đang thao tác" trên mỗi thiết bị (R26, R27)
- [x] Đưa Gợi ý quán ăn từ cộng đồng vào MVP (R34–R45)
- [x] Khu vực nhập tự do, tìm gần đúng theo chữ không dấu (R34)
- [x] Mỗi plan chọn một tiền tệ khi tạo (ISO 4217): chọn sẵn theo plan gần nhất, vùng của trình duyệt, rồi ngôn ngữ; tìm theo mã, tên tiền tệ, tên nước; chỉ đổi được khi chưa có khoản chi; không quy đổi, không nhiều tiền tệ trong một plan (R1, R70–R72)
- [x] Khóa nhập passcode theo plan, không giới hạn theo IP (R9)
- [x] Người tạo plan bắt buộc đăng nhập (Google hoặc email + mật khẩu); bỏ plan không có tài khoản, email khôi phục riêng và tự xóa sau 30 ngày; chủ plan tự đổi passcode trong cài đặt (R7, R9–R11, R24, R61)
- [x] Danh sách plan chia hai mục: Sắp diễn ra (tổng kết đang mở hoặc tạm khóa) và Đã tổng kết (đã chốt, mới nhất lên trước); plan chỉ kết thúc khi đã chốt tổng kết (R62)
- [x] Đưa Chia sẻ hành trình vào MVP: chủ plan chia sẻ plan đã chốt lên mục Khám phá (lịch trình theo Ngày 1…N, nơi ở, món ăn, chi phí ước tính mỗi người; không có người tham gia, khoản chi, QR, ngày thật); ai cũng tìm, xem được; người đã đăng nhập sao chép thành plan mới (R63–R69)
- [x] Ghi tiền đóng của từng người (ghi nhanh cùng số tiền hoặc mỗi người một số), thay cho đợt đóng góp và đánh dấu đã thanh toán; tổng kết từng người: chi tiêu, đã đóng, còn thiếu hoặc dư; người thu tiền cấp kế hoạch, mặc định là chủ plan (R23, R54, R75, R76)
- [x] Tên plan và tiêu đề hành trình 1–50 ký tự, cắt 2 dòng trên thẻ (R73); số tiền tròn nghìn hiện `k` / `K` (R74)
- [x] Màu trạng thái tiền thống nhất cả app, không theo theme: xanh lá là đủ hoặc dư, đỏ là thiếu; số tiền không kèm chữ (R77)
- [x] Làm tròn theo bước của tiền tệ (0,5 với tiền tệ có phần lẻ, 1.000 với VND, tiền tệ không có phần lẻ khác theo danh sách, mặc định 1): chi tiêu và còn thiếu làm tròn lên, dư làm tròn xuống; không cần chọn người nhận phần dư, phần chênh lệch thuộc về người thu tiền (R19)
- [x] Đường đến quán nhập tự do, nhận mọi loại link (R36)
- [x] Tài khoản có tên hiển thị (hiện là tác giả, kèm huy hiệu tag) và username (duy nhất, chỉ để đăng nhập); đăng nhập bằng email hoặc username (R78); chủ quán được đăng; danh sách gợi ý cần ít nhất 3 quán khác nhau; không giới hạn số danh sách đăng mỗi ngày (R35, R37, R45)
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
- [x] Danh sách món ăn không gắn với ngày; mỗi món có một hoặc nhiều buổi (3 biểu tượng sáng, chiều, tối); lọc theo buổi (R33)
- [x] Plan có 4 tab: Lịch trình, Ăn gì, Chi phí, Tổng kết; người tham gia mở từ số người ở đầu plan
- [x] Kế hoạch chỉ có ngày; hoạt động có ngày giờ dự kiến; chỉ người có quyền chỉnh sửa được tạm khóa, mở khóa và chốt tổng kết (R59, R60)

## 1. Chốt giao diện

- [x] Chọn style giao diện: Gạo ấm (style 3 trong [canvas wireframe](https://claude.ai/artifact/6iUe9YoLbxwwiQHG7R47o9))
- [x] Chốt vị trí Gợi ý quán ăn trong plan: một lựa chọn trong tab "Ăn gì"
- [ ] Wireframe theo style Gạo ấm cho cả điện thoại và desktop: danh sách plan, tạo plan (kèm chọn tiền tệ), chi tiết plan (lịch trình, người tham gia, chi phí, tổng kết kèm QR chuyển khoản), form chi phí, danh sách và form ghi tiền đóng, đăng nhập (email hoặc username) và đăng ký (tên hiển thị, username), hoàn tất tài khoản khi vào bằng Google, nhập passcode, đổi passcode và tiền tệ trong cài đặt, đổi link chia sẻ, nơi ở, danh sách món ăn (biểu tượng buổi, lọc theo buổi)
- [ ] Wireframe Gợi ý quán ăn: lựa chọn "Quán ăn" trong mục "Khám phá" ở màn hình chính, lựa chọn "Gợi ý quán" trong tab Ăn gì, tìm theo điểm đến, xem danh sách gợi ý (tên hiển thị kèm huy hiệu tag), đăng danh sách gợi ý, áp dụng vào plan, báo cáo, trang admin
- [ ] Wireframe Chia sẻ hành trình: lựa chọn "Hành trình" trong mục Khám phá, tìm theo điểm đến, xem hành trình, nút chia sẻ trong tổng kết đã chốt, xem trước và sửa bản đăng, sao chép thành plan mới
- [ ] Màn hình kiểm tra chống bot khi vượt giới hạn truy cập
- [ ] Chốt danh sách theme cho MVP (đề xuất: Gạo ấm, Biển, Núi rừng, Phố cổ, Đêm)
- [ ] Chuẩn bị hình minh họa cho từng theme (tự vẽ, thuê vẽ hoặc mua từ thư viện có license dùng thương mại)
- [ ] Thiết kế từng theme trên các màn hình chính
