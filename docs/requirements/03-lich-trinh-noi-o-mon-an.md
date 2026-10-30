# 03 — Lịch trình, nơi ở và danh sách món ăn

Lịch trình theo ngày, nơi nhóm ở và danh sách món ăn muốn thử của cả chuyến đi.

Liên quan: [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) · [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) · [Tổng quan](README.md)

## Dữ liệu

### Hoạt động trong lịch trình

- `activityId`: mã định danh duy nhất của hoạt động.
- `name`: tên hoạt động.
- `date`: ngày dự kiến (tùy chọn); trống thì hoạt động nằm ở mục Ngày chưa xác định (R81).
- `time`: giờ dự kiến (tùy chọn); không có giờ thì hoạt động nằm cuối ngày ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- `location`: tên địa điểm của hoạt động (tùy chọn).
- `mapLink`: URL bản đồ (tùy chọn).
- `notes`: ghi chú hoạt động (tùy chọn).
- `createdAt`: thời điểm tạo; dùng khi hai hoạt động trùng giờ hoặc cùng không có giờ (R60).

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
- **R58.** Khi tổng kết đang mở ([R59](02-nguoi-tham-gia-va-chi-phi.md)), người có quyền chỉnh sửa có thể sửa hoạt động, cả tên lẫn thông tin, và xóa hoạt động. Xóa một hoạt động có khoản chi phí gắn vào ([R25](02-nguoi-tham-gia-va-chi-phi.md)) thì các khoản chi phí đó bị xóa theo và không còn được tính vào tổng kết; trước khi xóa, ứng dụng liệt kê các khoản chi phí sẽ bị xóa và hỏi xác nhận. Khi tổng kết đang tạm khóa hoặc đã chốt, không thêm, sửa, chuyển hay xóa được hoạt động.
- **R81.** Lịch trình có mục **Ngày chưa xác định**, hiển thị sau ngày cuối của chuyến đi, gồm các hoạt động không có ngày hoặc có ngày nằm ngoài khoảng ngày của kế hoạch: hoạt động sao chép từ hành trình dài hơn kế hoạch ([R79](07-chia-se-hanh-trinh.md)), hoạt động còn lại sau khi đổi ngày của kế hoạch ([R80](01-ke-hoach-va-quyen-truy-cap.md)), hoặc hoạt động người dùng chưa xếp ngày. Hoạt động trong mục này giữ giờ và xếp như một ngày (R60). Mục chỉ hiện khi có hoạt động; khi đó bộ chọn ngày ([R60](01-ke-hoach-va-quyen-truy-cap.md)) có thêm lựa chọn "Chưa xác định". Người có quyền chỉnh sửa chuyển được hoạt động sang ngày khác, kể cả vào hoặc ra khỏi mục này, theo hai cách:
  - **Kéo thả** hoạt động sang một ngày khác: hoạt động giữ giờ, hoặc vẫn không có giờ, và tự nằm đúng chỗ theo giờ trong ngày mới (R60). Kéo thả chỉ đổi ngày; trong một ngày không có sắp xếp tay. Trên màn hình rộng, lịch trình có cột danh sách ngày bên cạnh, mỗi ngày kèm số hoạt động: bấm một ngày để lọc, thả hoạt động vào một ngày trong cột là chuyển sang ngày đó, nên không phải kéo xa.
  - **Nút "Chuyển"** trên mỗi hoạt động: hộp thoại cho chọn ngày bằng ô chọn ngày (R82) và giờ, điền sẵn ngày và giờ hiện tại; giờ bỏ trống được. Cách này không cần kéo xa, và dùng được bằng bàn phím và trình đọc màn hình.

  Chỉ chuyển được khi tổng kết đang mở (R58). Khoản chi phí gắn với hoạt động giữ nguyên ngày của nó. Hoạt động ở mục Ngày chưa xác định không được đưa vào hành trình khi chia sẻ ([R64](07-chia-se-hanh-trinh.md)).
- **R82.** Ngày của hoạt động được chọn bằng một ô chọn ngày dạng dropdown, giống nhau ở form thêm, sửa hoạt động và hộp thoại Chuyển (R81). Ô hiện ngày đang chọn; bấm vào thì danh sách mở ngay dưới ô, hoặc phía trên nếu bên dưới không đủ chỗ. Danh sách gồm mọi ngày của kế hoạch (tối đa 60 ngày, [R2](01-ke-hoach-va-quyen-truy-cap.md)): mỗi dòng ghi Ngày N, thứ và ngày, và số hoạt động đã có trong ngày đó; dòng cuối là Ngày chưa xác định. Danh sách cao tối đa khoảng 6 dòng, dài hơn thì cuộn dọc, và mở ra ở ngày đang chọn. Chọn một ngày thì danh sách đóng lại. Trong hộp thoại Chuyển, ngày hiện tại của hoạt động được ghi "Đang ở đây". Ô dùng được bằng bàn phím và trình đọc màn hình.

## Acceptance Criteria

### Lịch trình

- Người dùng có thể thêm, chỉnh sửa và xóa các hoạt động trong lịch trình.
- Hoạt động bắt buộc có tên; ngày (có thể là Chưa xác định), giờ, địa điểm, link bản đồ và ghi chú là tùy chọn.
- Ngày được chọn bằng cùng một ô dropdown ở form và hộp thoại Chuyển; danh sách gồm mọi ngày của kế hoạch, cuộn dọc khi kế hoạch dài, mỗi ngày ghi số hoạt động đã có (R82).
- Form thêm hoạt động chọn sẵn ngày đang xem ở bộ chọn ngày; khi xem "Tất cả" thì chọn sẵn hôm nay nếu đang trong chuyến đi, nếu không thì Ngày 1.
- Hoạt động hiển thị theo ngày; trong mỗi ngày, hoạt động có giờ xếp theo giờ tăng dần, hoạt động không có giờ nằm cuối ngày; xem được theo "Tất cả" hoặc từng ngày; nơi ở hiển thị theo ngày nhận phòng ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- Có thể xem khoản chi phí được liên kết trong mối liên hệ với hoạt động trong lịch trình hoặc ngày/giờ tương ứng.
- Xóa hoạt động có khoản chi phí gắn vào thì ứng dụng liệt kê các khoản chi phí sẽ bị xóa theo và hỏi xác nhận; sau khi xóa, tổng kết được tính lại.
- Hoạt động không có ngày hoặc nằm ngoài khoảng ngày của kế hoạch hiện ở mục Ngày chưa xác định, sau ngày cuối, giữ giờ; khi thêm hoạt động, chọn được Ngày chưa xác định.
- Người có quyền chỉnh sửa chuyển được hoạt động sang ngày khác bằng kéo thả (giữ giờ) hoặc nút "Chuyển" (chọn ngày và giờ, giờ bỏ trống được).
- Trên màn hình rộng, thả hoạt động vào một ngày ở cột danh sách ngày là chuyển sang ngày đó.
- Khi tổng kết đang tạm khóa hoặc đã chốt, không thêm, sửa, chuyển hay xóa được hoạt động.

### Nơi ở và danh sách món ăn

- Người có quyền chỉnh sửa có thể thêm, sửa và xóa nơi ở với tên, khu vực, quốc gia, địa chỉ và link bản đồ (tùy chọn), cùng ngày nhận/trả phòng.
- Không thể lưu nơi ở chồng lên nơi ở khác hoặc nằm ngoài ngày của kế hoạch; người dùng nhận được thông báo kiểm tra hợp lệ rõ ràng.
- Mỗi ngày trong lịch trình hiển thị nơi nhóm ở đêm đó, và cả hai nơi vào ngày di chuyển. Bấm dòng nơi ở thì mở danh sách nơi ở của kế hoạch; kế hoạch chưa có nơi ở nào thì đầu lịch trình có nút thêm nơi ở.
- Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món ăn, và chọn một hoặc nhiều buổi (sáng, chiều, tối) cho món nếu muốn.
- Món mới nằm cuối danh sách; khi đang lọc theo buổi, form thêm món chọn sẵn buổi đó.
- Ai xem được kế hoạch đều xem được danh sách món ăn mà không cần passcode.
- Danh sách món ăn là một danh sách chung, không gắn với ngày; mỗi món hiển thị biểu tượng của từng buổi đã chọn.
- Danh sách món ăn lọc được theo buổi; Khám phá trong tab Lịch trình và tab Ăn gì thêm hoạt động hoặc món ăn từ hành trình và danh sách gợi ý ([R40](04-goi-y-quan-an.md), [R79](07-chia-se-hanh-trinh.md)).

## Edge Cases

- Xóa hoạt động không có khoản chi phí nào gắn vào; hoạt động bị xóa, tổng kết không đổi.
- Xóa hoạt động có khoản chi phí gắn vào rồi bấm hủy ở bước xác nhận; hoạt động và các khoản chi phí giữ nguyên.
- Người dùng muốn sửa hoặc xóa hoạt động khi tổng kết đang tạm khóa hoặc đã chốt; thao tác bị chặn, kèm thông báo trạng thái của tổng kết. Nếu đang tạm khóa, người dùng có thể mở khóa trước.
- Rút ngắn ngày về khi ngày cuối còn hoạt động; các hoạt động đó hiện ở mục Ngày chưa xác định, không bị xóa; kéo dài lại ngày về thì chúng về lại đúng ngày.
- Hai hoạt động cùng giờ, hoặc cùng không có giờ; hoạt động được tạo trước hiển thị trước.
- Xóa giờ của một hoạt động; hoạt động chuyển xuống cuối ngày. Đặt giờ cho hoạt động không có giờ; hoạt động chuyển lên đúng chỗ theo giờ.
- Kéo hoạt động không có giờ sang ngày khác; hoạt động nằm cuối ngày mới và vẫn không có giờ.
- Kế hoạch dài 10 ngày trở lên; danh sách chọn ngày cuộn được và mở ra ở ngày đang chọn, bộ chọn xem theo ngày ở đầu lịch trình cuộn ngang.
- Chuyển hoạt động có khoản chi phí gắn vào sang ngày khác; khoản chi phí giữ ngày của nó.
- Chuyến đi qua nhiều nơi và nhóm di chuyển vào một ngày; ngày đó hiển thị cả hai nơi ở.
- Có đêm không có nơi ở, ví dụ đi xe qua đêm; ngày đó không hiển thị nơi ở và không báo lỗi.
- Ngày của kế hoạch bị đổi khiến một số nơi ở nằm ngoài khoảng ngày mới; người dùng được cảnh báo trước khi lưu và không có gì bị xóa âm thầm.
- Kế hoạch chưa có món nào, hoặc bộ lọc không có món nào khớp; hiển thị trạng thái trống, kèm nút thêm món cho người có quyền chỉnh sửa.
- Cùng một tên món được thêm nhiều lần, ví dụ ở hai quán khác nhau; điều này được phép.
- Một món ăn được vào nhiều buổi, ví dụ cả chiều và tối; món hiển thị đủ các biểu tượng và hiện khi lọc theo bất kỳ buổi nào trong số đó.
- Món chưa chọn buổi nào; món không có biểu tượng buổi và chỉ hiện khi không lọc theo buổi.
