# 03 — Lịch trình, nơi ở và danh sách món ăn

Lịch trình theo ngày, nơi nhóm ở và danh sách món ăn muốn thử của cả chuyến đi.

Liên quan: [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) · [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) · [Tổng quan](README.md)

## Dữ liệu

### Hoạt động trong lịch trình

- `activityId`: mã định danh duy nhất của hoạt động.
- `name`: tên hoạt động.
- `dateTime`: ngày giờ dự kiến diễn ra hoạt động.
- `location`: tên địa điểm của hoạt động.
- `mapLink`: URL bản đồ (tùy chọn).
- `notes`: ghi chú hoạt động (tùy chọn).
- `order`: thứ tự giữa các hoạt động cùng giờ ([R60](01-ke-hoach-va-quyen-truy-cap.md)).

### Nơi ở

- `stayId`: mã định danh duy nhất của nơi ở.
- `name`: nơi nhóm ở, ví dụ tên homestay hoặc khách sạn.
- `area`: thành phố hoặc khu vực, nhập tự do, ví dụ `Đà Lạt` hoặc `Kyoto`; tìm kiếm không phân biệt dấu ([R34](04-goi-y-quan-an.md)).
- `country`: mã quốc gia (ISO 3166-1), ví dụ `VN` hoặc `JP`; hiển thị bằng tên theo ngôn ngữ của người dùng.
- `address`: địa chỉ (tùy chọn).
- `mapLink`: URL bản đồ (tùy chọn).
- `checkInDate`: ngày của đêm đầu tiên.
- `checkOutDate`: ngày rời đi.

### Món ăn

- `foodItemId`: mã định danh duy nhất của món ăn.
- `mealSlots`: các buổi có thể ăn món này: sáng, chiều, tối (tùy chọn, chọn được nhiều buổi); mỗi buổi hiển thị bằng một biểu tượng riêng.
- `dishName`: món ăn muốn thử.
- `placeName`: quán ăn (tùy chọn).
- `directions`: đường đến quán (tùy chọn), nhập tự do: địa chỉ, link (bản đồ, trang Facebook, website) hoặc cách đi.
- `notes`: ghi chú (tùy chọn).
- `order`: thứ tự trong danh sách, do người dùng sắp xếp.

Món áp dụng từ danh sách gợi ý là bản sao độc lập, không lưu liên kết tới danh sách gốc ([R41](04-goi-y-quan-an.md)).

## Quy tắc

- **R31.** Một kế hoạch có thể có một hoặc nhiều nơi ở. Ngày nhận và trả phòng của mỗi nơi ở phải nằm trong khoảng ngày của kế hoạch, và ngày trả phải sau ngày nhận. Các nơi ở không được chồng nhau, trừ trường hợp ngày trả phòng của nơi này trùng ngày nhận phòng của nơi tiếp theo. Cho phép có đêm không có nơi ở, ví dụ đi xe giường nằm qua đêm.
- **R32.** Với mỗi ngày trong chuyến đi, ứng dụng hiển thị nơi nhóm ở đêm đó. Vào ngày di chuyển, ứng dụng hiển thị cả nơi rời đi và nơi đến. Lịch trình hiển thị thông tin này cho từng ngày. Khu vực và quốc gia theo ngày này được dùng để đề xuất danh sách gợi ý cho khu vực đó ([R40](04-goi-y-quan-an.md)).
- **R33.** Mỗi kế hoạch có một danh sách món ăn chung, không gắn với ngày. Mỗi món có thể được gán một hoặc nhiều buổi (sáng, chiều, tối), vì một món có thể ăn vào nhiều buổi; mỗi buổi đã chọn hiển thị bằng một biểu tượng riêng trên món để dễ nhận ra. Danh sách theo thứ tự người dùng sắp xếp và lọc được theo buổi. Gợi ý quán ăn là một lựa chọn trong tab Ăn gì ([R40](04-goi-y-quan-an.md)). Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món, và đổi các buổi của món; ai xem được kế hoạch đều xem được danh sách. Món ăn bắt buộc có tên món; buổi, quán ăn, đường đến quán và ghi chú là tùy chọn. Trong MVP, món ăn không liên kết với khoản chi phí.
- **R58.** Khi tổng kết đang mở ([R59](02-nguoi-tham-gia-va-chi-phi.md)), người có quyền chỉnh sửa có thể sửa hoạt động, cả tên lẫn thông tin, và xóa hoạt động. Xóa một hoạt động có khoản chi phí gắn vào ([R25](02-nguoi-tham-gia-va-chi-phi.md)) thì các khoản chi phí đó bị xóa theo và không còn được tính vào tổng kết; trước khi xóa, ứng dụng liệt kê các khoản chi phí sẽ bị xóa và hỏi xác nhận. Khi tổng kết đang tạm khóa hoặc đã chốt, không thêm, sửa hay xóa được hoạt động.

## Acceptance Criteria

### Lịch trình

- Người dùng có thể thêm, chỉnh sửa và xóa các hoạt động trong lịch trình.
- Một hoạt động có thể lưu tên, ngày/giờ, tên địa điểm, link bản đồ (tùy chọn), ghi chú và thứ tự.
- Hoạt động hiển thị theo ngày giờ tăng dần, xem được theo "Tất cả" hoặc từng ngày; nơi ở hiển thị theo ngày nhận phòng ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- Có thể xem khoản chi phí được liên kết trong mối liên hệ với hoạt động trong lịch trình hoặc ngày/giờ tương ứng.
- Xóa hoạt động có khoản chi phí gắn vào thì ứng dụng liệt kê các khoản chi phí sẽ bị xóa theo và hỏi xác nhận; sau khi xóa, tổng kết được tính lại.
- Khi tổng kết đang tạm khóa hoặc đã chốt, không thêm, sửa hay xóa được hoạt động.

### Nơi ở và danh sách món ăn

- Người có quyền chỉnh sửa có thể thêm, sửa và xóa nơi ở với tên, khu vực, quốc gia, địa chỉ và link bản đồ (tùy chọn), cùng ngày nhận/trả phòng.
- Không thể lưu nơi ở chồng lên nơi ở khác hoặc nằm ngoài ngày của kế hoạch; người dùng nhận được thông báo kiểm tra hợp lệ rõ ràng.
- Mỗi ngày trong lịch trình hiển thị nơi nhóm ở đêm đó, và cả hai nơi vào ngày di chuyển.
- Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món ăn, và chọn một hoặc nhiều buổi (sáng, chiều, tối) cho món nếu muốn.
- Ai xem được kế hoạch đều xem được danh sách món ăn mà không cần passcode.
- Danh sách món ăn là một danh sách chung, không gắn với ngày; mỗi món hiển thị biểu tượng của từng buổi đã chọn.
- Danh sách món ăn lọc được theo buổi; Gợi ý quán là một lựa chọn trong tab Ăn gì ([R40](04-goi-y-quan-an.md)).

## Edge Cases

- Xóa hoạt động không có khoản chi phí nào gắn vào; hoạt động bị xóa, tổng kết không đổi.
- Xóa hoạt động có khoản chi phí gắn vào rồi bấm hủy ở bước xác nhận; hoạt động và các khoản chi phí giữ nguyên.
- Người dùng muốn sửa hoặc xóa hoạt động khi tổng kết đang tạm khóa hoặc đã chốt; thao tác bị chặn, kèm thông báo trạng thái của tổng kết. Nếu đang tạm khóa, người dùng có thể mở khóa trước.
- Chuyến đi qua nhiều nơi và nhóm di chuyển vào một ngày; ngày đó hiển thị cả hai nơi ở.
- Có đêm không có nơi ở, ví dụ đi xe qua đêm; ngày đó không hiển thị nơi ở và không báo lỗi.
- Ngày của kế hoạch bị đổi khiến một số nơi ở nằm ngoài khoảng ngày mới; người dùng được cảnh báo trước khi lưu và không có gì bị xóa âm thầm.
- Kế hoạch chưa có món nào, hoặc bộ lọc không có món nào khớp; hiển thị trạng thái trống, kèm nút thêm món cho người có quyền chỉnh sửa.
- Cùng một tên món được thêm nhiều lần, ví dụ ở hai quán khác nhau; điều này được phép.
- Một món ăn được vào nhiều buổi, ví dụ cả chiều và tối; món hiển thị đủ các biểu tượng và hiện khi lọc theo bất kỳ buổi nào trong số đó.
- Món chưa chọn buổi nào; món không có biểu tượng buổi và chỉ hiện khi không lọc theo buổi.
