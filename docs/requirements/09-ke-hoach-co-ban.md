# 09 — Kế hoạch cơ bản

Kế hoạch có hai loại, chọn khi tạo. **Kế hoạch chi tiết** dành cho chuyến đi, có mọi tính năng của các module 01–08. **Kế hoạch cơ bản** chỉ để chia tiền cho một việc ngắn như một bữa ăn, buổi cafe hay món quà chung. Kế hoạch cơ bản là kế hoạch chi tiết bỏ bớt tính năng; phần còn lại dùng chung quy tắc.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) · [05 Theme](05-ngon-ngu-va-theme.md) · [Tổng quan](README.md)

## Vị trí trong ứng dụng

- **Tạo kế hoạch:** bước đầu tiên là chọn loại.
- **Danh sách kế hoạch:** hai loại nằm chung; thẻ kế hoạch cơ bản có nhãn Cơ bản.
- **Trong kế hoạch cơ bản:** hai tab Chi phí và Tổng kết.

## Hai loại có gì

| Tính năng | Cơ bản | Chi tiết |
|---|---|---|
| Tên, tiền tệ | ✓ | ✓ |
| Mô tả ngắn, hiện dưới tên | ✓ | |
| Ghi chú | | ✓ |
| Người tham gia, Bạn là ai, thành viên có tài khoản và link mời | ✓ | ✓ |
| Khoản chi, tiền đóng, tổng kết, người thu tiền, QR, tạm khóa và chốt, xuất ảnh | ✓ | ✓ |
| Link chia sẻ, passcode, khóa nhập passcode, edit lock | ✓ | ✓ |
| Ngày đi, ngày về, địa điểm | | ✓ |
| Theme và ảnh nền | Luôn là Gạo ấm | ✓ |
| Lịch trình, nơi ở, ăn gì, Khám phá trong kế hoạch | | ✓ |
| Chia sẻ hành trình, chiêu mộ | | ✓ |

## Dữ liệu

- `kind`: loại kế hoạch, `basic` (cơ bản) hoặc `detailed` (chi tiết); đặt khi tạo, không đổi.
- Kế hoạch cơ bản không có ngày đi, ngày về, địa điểm, theme và ảnh nền.
- Mô tả ngắn của kế hoạch cơ bản lưu ở cột ghi chú của kế hoạch, tối đa 100 ký tự.
- Khoản chi và tiền đóng của kế hoạch cơ bản không có ngày giờ; thứ tự dựa vào thời điểm ghi.

## Quy tắc

- **R93.** Loại kế hoạch được chọn ở bước đầu khi tạo kế hoạch.
  - Màn chọn loại có hai lựa chọn, Cơ bản và Kế hoạch chi tiết; dưới mỗi lựa chọn có một đoạn mô tả ngắn những gì loại đó có.
  - Ứng dụng chọn sẵn loại của kế hoạch tạo gần nhất; lần đầu chưa chọn sẵn loại nào.
  - Màn có dòng nhắc loại không đổi được sau khi tạo.
  - Kế hoạch tạo bằng cách sao chép hành trình ([R68](07-chia-se-hanh-trinh.md)) luôn là kế hoạch chi tiết.
- **R94.** Kế hoạch cơ bản gồm tên ([R73](01-ke-hoach-va-quyen-truy-cap.md)), tiền tệ ([R1](02-nguoi-tham-gia-va-chi-phi.md), R70–R72), mô tả ngắn tùy chọn, người tham gia, khoản chi, tiền đóng và tổng kết theo module 02, cùng link chia sẻ, passcode, edit lock và thành viên theo module 01.
  - **Mô tả ngắn:** một dòng, tối đa 100 ký tự, đếm như R73; thay cho ô ghi chú. Mô tả hiện dưới tên ở phần đầu kế hoạch, trên thẻ trong danh sách kế hoạch (một dòng, dài thì cắt bằng dấu …) và trên ảnh xuất tổng kết; không có trên thẻ preview link ([R51](06-bao-mat-du-lieu.md)).
  - **Không có:** ngày, địa điểm, ghi chú, theme, ảnh nền, lịch trình, nơi ở, danh sách món ăn, Khám phá trong kế hoạch, chia sẻ hành trình ([R63](07-chia-se-hanh-trinh.md)) và chiêu mộ ([R86](08-chieu-mo.md)). Giao diện luôn dùng Gạo ấm ([R29](05-ngon-ngu-va-theme.md)).
  - **Màn kế hoạch:** hai tab Chi phí và Tổng kết, mở ở Chi phí. Phần đầu kế hoạch gọn, không có hình minh họa, gồm tên, mô tả ngắn, nhãn Cơ bản và số người.
  - Khoản chi không liên kết với hoạt động ([R25](02-nguoi-tham-gia-va-chi-phi.md)).
- **R95.** Tạo kế hoạch cơ bản có hai bước:
  - **Thông tin:** tên, tiền tệ, người tham gia và mô tả ngắn. Chủ kế hoạch có sẵn trong danh sách người tham gia ([R26](02-nguoi-tham-gia-va-chi-phi.md)). Các tên khác thêm nhanh từng tên; bỏ trống được và thêm sau ở màn Người tham gia.
  - **Passcode:** như [R5](01-ke-hoach-va-quyen-truy-cap.md) và R6.
  - Kế hoạch chi tiết giữ ba bước: Thông tin, Theme, Passcode.
- **R96.** Kế hoạch cơ bản không có ngày. Quy tắc này thay [R60](01-ke-hoach-va-quyen-truy-cap.md) cho kế hoạch cơ bản.
  - Khoản chi và tiền đóng không có ngày giờ; form không có ô ngày giờ.
  - Danh sách khoản chi và tiền đóng xếp theo thứ tự ghi, khoản ghi trước ở trên. Không có bộ chọn "Tất cả" hoặc từng ngày. Các khoản ghi cùng lúc trong Ghi tiền đóng vẫn hiện thành nhóm ([R75](02-nguoi-tham-gia-va-chi-phi.md)).
  - Trong danh sách kế hoạch ([R62](01-ke-hoach-va-quyen-truy-cap.md)), kế hoạch cơ bản dùng ngày tạo thay cho ngày bắt đầu để xếp. Thẻ hiện nhãn Cơ bản thay cho khoảng ngày, và không có nhãn "Chưa chốt tổng kết".
  - Thẻ preview link ([R51](06-bao-mat-du-lieu.md)) không có dòng ngày. Ảnh xuất tổng kết thay dòng ngày bằng mô tả ngắn, nếu có.

## Acceptance Criteria

- Khi tạo kế hoạch, người dùng chọn Cơ bản hoặc Kế hoạch chi tiết; mỗi lựa chọn có mô tả; loại không đổi được sau khi tạo.
- Kế hoạch cơ bản tạo được trong hai bước, chỉ cần tên, tiền tệ và passcode; thêm được tên người tham gia và mô tả ngắn ngay khi tạo. Mô tả ngắn hiện dưới tên ở phần đầu kế hoạch và trên thẻ trong danh sách.
- Kế hoạch cơ bản chỉ có hai tab Chi phí và Tổng kết; không có ngày, theme, lịch trình, nơi ở, ăn gì, chia sẻ hành trình hay chiêu mộ.
- Khoản chi và tiền đóng của kế hoạch cơ bản không có ngày giờ và hiện theo thứ tự ghi.
- Tính tiền, làm tròn, tiền đóng, người thu tiền, QR, tạm khóa, chốt và xuất ảnh hoạt động như kế hoạch chi tiết.
- Danh sách kế hoạch hiện cả hai loại; thẻ kế hoạch cơ bản có nhãn Cơ bản.
- Quyền xem và sửa giống kế hoạch chi tiết: có link thì xem; có passcode, là chủ kế hoạch hoặc thành viên Sửa thì sửa.

## Edge Cases

- Người dùng muốn thêm lịch trình cho kế hoạch cơ bản: MVP không chuyển loại được; họ tạo kế hoạch chi tiết mới.
- Bỏ trống người tham gia khi tạo: kế hoạch chỉ có chủ kế hoạch; thêm người sau ở màn Người tham gia.
- Kế hoạch cơ bản tạo đã lâu mà chưa chốt: vẫn ở mục Sắp diễn ra, xếp theo ngày tạo.
- Mở đường dẫn tới tab không có trong kế hoạch cơ bản (ví dụ tab Ăn gì): chuyển về tab Chi phí.
- Kế hoạch cơ bản đã chốt: không có nút Chia sẻ hành trình.
- Dán mô tả dài hơn 100 ký tự: ô nhập báo vượt giới hạn, không tự cắt âm thầm (như R73).
- Ghi nhiều khoản chi liên tiếp: khoản mới luôn nằm cuối danh sách, kể cả khi sửa khoản cũ.
