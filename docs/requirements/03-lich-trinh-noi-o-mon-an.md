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
- `date`: ngày trong chuyến đi (tùy chọn); để trống nếu chưa xếp ngày.
- `mealSlot`: buổi sáng, chiều hoặc tối (tùy chọn); mỗi buổi hiển thị bằng một biểu tượng riêng.
- `dishName`: món ăn muốn thử.
- `placeName`: quán ăn (tùy chọn).
- `directions`: đường đến quán (tùy chọn), nhập tự do: địa chỉ, link (bản đồ, trang Facebook, website) hoặc cách đi.
- `notes`: ghi chú (tùy chọn).
- `order`: thứ tự giữa các món cùng ngày và cùng buổi.

Món áp dụng từ danh sách gợi ý là bản sao độc lập, không lưu liên kết tới danh sách gốc ([R41](04-goi-y-quan-an.md)).

## Quy tắc

- **R31.** Một kế hoạch có thể có một hoặc nhiều nơi ở. Ngày nhận và trả phòng của mỗi nơi ở phải nằm trong khoảng ngày của kế hoạch, và ngày trả phải sau ngày nhận. Các nơi ở không được chồng nhau, trừ trường hợp ngày trả phòng của nơi này trùng ngày nhận phòng của nơi tiếp theo. Cho phép có đêm không có nơi ở, ví dụ đi xe giường nằm qua đêm.
- **R32.** Với mỗi ngày trong chuyến đi, ứng dụng hiển thị nơi nhóm ở đêm đó. Vào ngày di chuyển, ứng dụng hiển thị cả nơi rời đi và nơi đến. Lịch trình hiển thị thông tin này cho từng ngày; danh sách món ăn hiển thị thông tin này khi lọc theo một ngày. Khu vực và quốc gia theo ngày này được dùng để đề xuất danh sách gợi ý cho khu vực đó ([R40](04-goi-y-quan-an.md)).
- **R33.** Mỗi kế hoạch có một danh sách món ăn chung, không chia theo ngày. Mỗi món có thể được gán một ngày trong chuyến đi và một buổi (sáng, chiều hoặc tối), hoặc để trống, ví dụ các mục vừa áp dụng từ danh sách gợi ý. Mỗi món hiển thị biểu tượng của buổi (ba biểu tượng cho sáng, chiều, tối) và nhãn ngày để dễ nhận ra; món chưa có ngày hiển thị nhãn "Chưa xếp ngày". Danh sách sắp theo ngày tăng dần (món chưa có ngày ở cuối), rồi theo buổi từ sáng đến tối; cùng ngày và cùng buổi thì theo thứ tự người dùng sắp xếp. Người dùng lọc được theo ngày (Tất cả, từng ngày, Chưa xếp ngày) và theo buổi. Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món, và đổi ngày, buổi của món; ai xem được kế hoạch đều xem được danh sách. Món ăn bắt buộc có tên món; ngày, buổi, quán ăn, đường đến quán và ghi chú là tùy chọn. Trong MVP, món ăn không liên kết với khoản chi phí.
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
- Mỗi ngày trong lịch trình hiển thị nơi nhóm ở đêm đó, và cả hai nơi vào ngày di chuyển; danh sách món ăn hiển thị thông tin này khi lọc theo một ngày.
- Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món ăn, và gán ngày, buổi (sáng, chiều, tối) cho món nếu muốn.
- Ai xem được kế hoạch đều xem được danh sách món ăn mà không cần passcode.
- Danh sách món ăn là một danh sách chung; mỗi món hiển thị biểu tượng buổi và nhãn ngày, món chưa có ngày hiển thị nhãn "Chưa xếp ngày".
- Danh sách món ăn lọc được theo ngày (Tất cả, từng ngày, Chưa xếp ngày) và theo buổi.

## Edge Cases

- Xóa hoạt động không có khoản chi phí nào gắn vào; hoạt động bị xóa, tổng kết không đổi.
- Xóa hoạt động có khoản chi phí gắn vào rồi bấm hủy ở bước xác nhận; hoạt động và các khoản chi phí giữ nguyên.
- Người dùng muốn sửa hoặc xóa hoạt động khi tổng kết đang tạm khóa hoặc đã chốt; thao tác bị chặn, kèm thông báo trạng thái của tổng kết. Nếu đang tạm khóa, người dùng có thể mở khóa trước.
- Chuyến đi qua nhiều nơi và nhóm di chuyển vào một ngày; ngày đó hiển thị cả hai nơi ở.
- Có đêm không có nơi ở, ví dụ đi xe qua đêm; ngày đó không hiển thị nơi ở và không báo lỗi.
- Ngày của kế hoạch bị đổi khiến một số nơi ở hoặc món ăn nằm ngoài khoảng ngày mới; người dùng được cảnh báo trước khi lưu và không có gì bị xóa âm thầm.
- Kế hoạch chưa có món nào, hoặc bộ lọc không có món nào khớp; hiển thị trạng thái trống, kèm nút thêm món cho người có quyền chỉnh sửa.
- Cùng một món được thêm vào nhiều ngày hoặc nhiều buổi; điều này được phép.
- Ngày của kế hoạch bị đổi trong khi có món chưa xếp ngày; các món đó không bị ảnh hưởng.
- Món có ngày nhưng chưa có buổi; món hiển thị nhãn ngày, không có biểu tượng buổi, và vẫn hiện khi lọc theo ngày đó.
