# 05 — Ngôn ngữ, theme và ảnh nền

Giao diện tiếng Việt và tiếng Anh, theme của kế hoạch và ảnh nền riêng. Ứng dụng dùng được trên trình duyệt điện thoại và máy tính, và cài được lên màn hình chính của điện thoại (PWA).

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) · [Tổng quan](README.md)

## Dữ liệu

Không có bảng riêng. Module này dùng `theme`, `coverImage` của kế hoạch và `language` của tài khoản; xem phần Dữ liệu ở [01](01-ke-hoach-va-quyen-truy-cap.md).

## Quy tắc

- **R28.** Giao diện có tiếng Việt và tiếng Anh. Lần đầu sử dụng, ứng dụng theo ngôn ngữ của trình duyệt; nếu là ngôn ngữ khác thì dùng tiếng Anh. Người dùng có thể đổi ngôn ngữ bất cứ lúc nào; lựa chọn được lưu trên thiết bị và, khi đã đăng nhập, theo tài khoản. Link chia sẻ không chứa ngôn ngữ, nên mỗi người mở link thấy kế hoạch theo ngôn ngữ của mình. Ngày giờ và số được định dạng theo ngôn ngữ đang chọn; ký hiệu tiền tệ `$` không thay đổi. Email được gửi theo ngôn ngữ người dùng đang dùng lúc yêu cầu.
- **R29.** Mỗi kế hoạch có một theme, được chọn khi tạo kế hoạch (mặc định: Gạo ấm). Theme quyết định màu sắc và hình minh họa của kế hoạch. Mọi người mở kế hoạch đều thấy theme đó, và người có quyền chỉnh sửa có thể đổi theme sau. Các màn hình không thuộc một kế hoạch cụ thể, như danh sách kế hoạch, dùng theme mặc định. Ảnh xuất bản tổng kết và thẻ preview của link dùng theme của kế hoạch.
- **R30.** Người có quyền chỉnh sửa có thể thay hình minh họa của theme bằng ảnh riêng (JPG, PNG, WebP hoặc HEIC, tối đa 10 MB). Ứng dụng tự thu nhỏ và nén ảnh, xóa thông tin vị trí và metadata khác, và cho người dùng chọn vùng ảnh được hiển thị. Màu của theme giữ nguyên. Ảnh vẫn giữ khi đổi theme, và người có quyền chỉnh sửa có thể gỡ ảnh để quay về hình minh họa của theme. Mọi người xem được kế hoạch đều thấy ảnh này; ứng dụng nhắc người tải ảnh về điều đó. Ảnh bị xóa cùng với kế hoạch. Khi kế hoạch có ảnh riêng, ảnh xuất bản tổng kết và thẻ preview của link dùng ảnh đó. File ảnh không có địa chỉ công khai riêng: giống ảnh QR, ảnh chỉ được tải qua link của kế hoạch ([R57](02-nguoi-tham-gia-va-chi-phi.md)).

## Acceptance Criteria

- Người dùng có thể đổi giữa tiếng Việt và tiếng Anh, và lựa chọn được ghi nhớ.
- Người dùng lần đầu thấy ứng dụng theo ngôn ngữ của trình duyệt, hoặc tiếng Anh nếu trình duyệt không dùng tiếng Việt hay tiếng Anh.
- Ngày giờ và số theo ngôn ngữ đang chọn, và có thể nhập số tiền với dấu thập phân của ngôn ngữ đó.
- Người dùng có thể chọn theme khi tạo kế hoạch, và người có quyền chỉnh sửa có thể đổi theme sau.
- Mọi người mở kế hoạch đều thấy kế hoạch theo theme của nó.
- Ảnh xuất bản tổng kết và thẻ preview của link dùng theme của kế hoạch.
- Chữ giữ đủ độ tương phản ở mọi theme, kể cả chữ đặt trên hình minh họa hoặc ảnh riêng.
- Người có quyền chỉnh sửa có thể thay hình minh họa của theme bằng ảnh riêng, chọn vùng ảnh hiển thị, và gỡ ảnh đi.
- Ảnh tải lên không còn thông tin vị trí hay metadata khác.

## Edge Cases

- Người dùng nhập số tiền với dấu thập phân của ngôn ngữ kia (ví dụ: `86,5` khi đang dùng tiếng Anh). Số tiền phải được hiểu đúng hoặc bị từ chối kèm thông báo rõ ràng, không bao giờ bị đọc thành một số tiền khác.
- Hai người mở cùng một link chia sẻ bằng hai ngôn ngữ khác nhau; cả hai thấy cùng dữ liệu, mỗi người theo ngôn ngữ của mình.
- Kế hoạch dùng một theme sau đó bị gỡ khỏi ứng dụng; kế hoạch chuyển về theme mặc định.
- Hình minh họa của theme không tải được hoặc tải chậm khi mạng yếu; kế hoạch vẫn đọc được nhờ màu của theme.
- Ảnh tải lên quá lớn, sai định dạng hoặc tải lên thất bại; người dùng nhận thông báo rõ ràng và ảnh hiện tại được giữ nguyên.
- Kế hoạch có ảnh riêng bị xóa hoặc hết hạn; ảnh cũng bị xóa theo.
