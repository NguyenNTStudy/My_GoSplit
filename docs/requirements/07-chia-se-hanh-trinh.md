# 07 — Chia sẻ hành trình

Chủ kế hoạch chia sẻ hành trình của một chuyến đi đã chốt tổng kết lên cộng đồng: lịch trình, nơi ở, món ăn và chi phí ước tính mỗi người, không có thông tin của người tham gia. Người khác tìm theo điểm đến để tham khảo, rồi sao chép thành kế hoạch mới của mình.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) · [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) · [Tổng quan](README.md)

## Vị trí trong ứng dụng

- **Mục "Khám phá"** ở màn hình chính, bên cạnh mục "Kế hoạch", gồm hai lựa chọn: "Hành trình" và "Quán ăn" (danh sách gợi ý, [04](04-goi-y-quan-an.md)). Người dùng tìm được hành trình cả khi chưa tạo kế hoạch.
- **Trong kế hoạch:** khi tổng kết đã chốt, chủ kế hoạch thấy nút "Chia sẻ hành trình" trong tab Tổng kết.

## Ai được làm gì

| Thao tác | Ai được làm |
|---|---|
| Tìm và xem hành trình | Mọi người, kể cả chưa đăng nhập |
| Chia sẻ hành trình | Chủ kế hoạch, khi tổng kết đã chốt |
| Sửa, gỡ hành trình | Tác giả |
| Sao chép thành kế hoạch mới, bấm "Hữu ích" | Người đã đăng nhập |
| Báo cáo | Mọi người, có rate limit theo IP |

Lý do chỉ chủ kế hoạch được chia sẻ: hành trình gắn với tài khoản của người đăng, và có thông tin của cả nhóm như số người và chi phí ước tính. Lý do chỉ chia sẻ khi đã chốt: lịch trình và chi phí không còn thay đổi.

## Dữ liệu

### Hành trình

- `itineraryId`: mã định danh duy nhất của hành trình.
- `authorId`: tài khoản đăng hành trình, là chủ kế hoạch gốc.
- `sourcePlanId`: kế hoạch gốc; mỗi kế hoạch có tối đa một hành trình (R63). Không bao giờ gửi cho người xem; được đặt trống khi kế hoạch gốc bị xóa (R66).
- `title`: tiêu đề, mặc định là tên kế hoạch, ví dụ `Đà Lạt 3 ngày 2 đêm cho nhóm bạn`; từ 1 đến 50 ký tự như tên kế hoạch ([R73](01-ke-hoach-va-quyen-truy-cap.md)).
- `destination`: điểm đến, mặc định là điểm đến của kế hoạch; tìm kiếm không phân biệt dấu ([R34](04-goi-y-quan-an.md)).
- `description`: mô tả ngắn (tùy chọn).
- `language`: ngôn ngữ viết hành trình.
- `theme`: theme của kế hoạch gốc; hành trình hiển thị theo theme này ([R29](05-ngon-ngu-va-theme.md)).
- `dayCount`: số ngày của chuyến đi.
- `groupSize`: số người của nhóm, là số người tham gia có trong tổng kết.
- `estimatedCostPerPerson`: chi phí ước tính mỗi người (R65); trống nếu tác giả bỏ ra.
- `currency`: tiền tệ của kế hoạch gốc ([R1](02-nguoi-tham-gia-va-chi-phi.md)); chi phí ước tính hiển thị theo tiền tệ này, không quy đổi sang tiền tệ của người xem.
- `status`: đang hiển thị, bị ẩn do báo cáo, hoặc bị admin gỡ (R69).
- `helpfulCount`: số lượt "Hữu ích".
- `copyCount`: lượt sao chép: số kế hoạch đã được tạo từ hành trình (R68).
- `createdAt`: ngày giờ tạo.
- `updatedAt`: ngày giờ cập nhật gần nhất; hiển thị là "Cập nhật lần cuối".

### Mục trong hành trình

Hoạt động, nơi ở và món ăn được sao chép từ kế hoạch gốc ([03](03-lich-trinh-noi-o-mon-an.md)); ngày thật được thay bằng số thứ tự ngày (Ngày 1, Ngày 2, …):

- **Hoạt động:** `day` (số thứ tự ngày), `time` (giờ dự kiến), `name`, `location`, `mapLink`, `notes`, `order`.
- **Nơi ở:** `name`, `area`, `country`, `address`, `mapLink`, `checkInDay` (ngày của đêm đầu tiên), `checkOutDay` (ngày rời đi).
- **Món ăn:** `dishName`, `placeName`, `directions`, `mealSlots`, `notes`, `order`.

### Lượt hữu ích và báo cáo

Giống danh sách gợi ý ([04](04-goi-y-quan-an.md)): mỗi tài khoản một lượt "Hữu ích" cho mỗi hành trình; báo cáo lưu lý do, người báo cáo (tài khoản, hoặc địa chỉ IP đã hash) và thời điểm. Lý do báo cáo hành trình: quảng cáo, sai thông tin, lộ thông tin cá nhân, hoặc nội dung không phù hợp.

## Quy tắc

- **R63.** Chủ kế hoạch có thể chia sẻ hành trình của kế hoạch khi tổng kết đã chốt ([R59](02-nguoi-tham-gia-va-chi-phi.md)). Cần đồng ý điều khoản sử dụng khi đăng lần đầu, như danh sách gợi ý ([R35](04-goi-y-quan-an.md)). Mỗi kế hoạch có tối đa một hành trình; khi kế hoạch đã có hành trình, nút "Chia sẻ hành trình" mở hành trình đó để sửa.
- **R64.** Hành trình là bản sao của kế hoạch tại thời điểm chia sẻ, gồm: tiêu đề, điểm đến, mô tả ngắn, ngôn ngữ viết, theme, số ngày và số người của nhóm; các hoạt động kèm giờ, địa điểm, link bản đồ và ghi chú; các nơi ở kèm khu vực, quốc gia, địa chỉ, link bản đồ và các đêm ở; danh sách món ăn kèm quán, đường đến quán, các buổi và ghi chú; và chi phí ước tính mỗi người (R65), theo tiền tệ của kế hoạch. Ngày thật của chuyến đi không được sao chép: hoạt động và nơi ở chỉ giữ số thứ tự ngày. Hoạt động có ngày nằm ngoài khoảng ngày của kế hoạch không được đưa vào. Link trong hành trình được mở như link trong danh sách gợi ý ([R36](04-goi-y-quan-an.md)).
- **R65.** Tên người tham gia, từng khoản chi phí, tiền đóng, số tiền của từng người, QR chuyển khoản, passcode, link chia sẻ và ảnh nền riêng của kế hoạch không bao giờ được đưa vào hành trình. Chi phí ước tính mỗi người là tổng chi phí của chuyến đi chia đều cho số người của nhóm, làm tròn lên như [R19](02-nguoi-tham-gia-va-chi-phi.md). Tác giả có thể bỏ chi phí ước tính ra khi chia sẻ hoặc khi sửa.
- **R66.** Trước khi đăng, tác giả xem trước hành trình; có thể sửa tiêu đề, điểm đến, mô tả và nội dung từng mục, và bỏ bớt hoạt động, nơi ở hoặc món ăn. Ứng dụng nhắc tác giả kiểm tra ghi chú và địa chỉ để không lộ thông tin cá nhân. Hành trình cần ít nhất một hoạt động. Hành trình đã đăng độc lập với kế hoạch gốc: sửa hay xóa kế hoạch không làm đổi hay xóa hành trình. Tác giả có thể sửa hoặc gỡ hành trình bất cứ lúc nào; tác giả gỡ thì hành trình bị xóa hẳn. Hành trình hiển thị thời điểm cập nhật lần cuối.
- **R67.** Ai cũng tìm và xem được hành trình trong mục Khám phá mà không cần đăng nhập. Tìm theo điểm đến của hành trình và khu vực các nơi ở trong hành trình, không phân biệt dấu và gần đúng như [R34](04-goi-y-quan-an.md). Kết quả được sắp theo lượt "Hữu ích", lượt sao chép (R68) và độ mới, và lọc được theo số ngày và ngôn ngữ. Hành trình hiển thị tên hiển thị kèm huy hiệu tag của tác giả ([R37](04-goi-y-quan-an.md)). Hành trình bị ẩn hoặc đã gỡ không xuất hiện trong kết quả tìm kiếm.
- **R68.** Người đã đăng nhập có thể sao chép một hành trình thành kế hoạch mới của mình, qua các bước tạo kế hoạch được điền sẵn tên, điểm đến, theme và tiền tệ theo hành trình ([R70](02-nguoi-tham-gia-va-chi-phi.md)). Người dùng chọn ngày bắt đầu; ngày kết thúc được tính theo số ngày của hành trình; người dùng đặt passcode như khi tạo kế hoạch. Hoạt động và nơi ở được đặt vào ngày tương ứng của kế hoạch mới, giữ giờ của hoạt động; món ăn được thêm vào danh sách món ăn. Kế hoạch mới chỉ có chủ kế hoạch là người tham gia ([R26](02-nguoi-tham-gia-va-chi-phi.md)) và không có khoản chi phí nào. Kế hoạch mới là bản sao độc lập: sửa được như mọi kế hoạch khác, và hành trình bị sửa hay bị gỡ sau đó không làm đổi kế hoạch. Mỗi lần sao chép thành một kế hoạch mới, lượt sao chép tăng thêm một; xóa kế hoạch đã sao chép không làm giảm lượt sao chép.
- **R69.** "Hữu ích", báo cáo, kiểm duyệt của admin, khóa tài khoản và bộ lọc từ ngữ thô tục áp dụng cho hành trình giống danh sách gợi ý ([R42](04-goi-y-quan-an.md)–[R45](04-goi-y-quan-an.md)): hành trình bị 3 người khác nhau báo cáo bị ẩn cho đến khi admin xem xét; admin gỡ thì hành trình được giữ ở trạng thái đã gỡ; tài khoản bị khóa thì các hành trình của tài khoản đó bị ẩn. Trang admin hiển thị cả hành trình và danh sách gợi ý bị báo cáo.

## Acceptance Criteria

- Chỉ chủ kế hoạch chia sẻ được hành trình, và chỉ khi tổng kết đã chốt.
- Mỗi kế hoạch có tối đa một hành trình.
- Hành trình có hoạt động theo Ngày 1, Ngày 2, …, nơi ở, món ăn, số người và chi phí ước tính mỗi người.
- Hành trình không chứa ngày thật, tên người tham gia, từng khoản chi phí, tiền đóng, QR, passcode, link chia sẻ hay ảnh nền riêng của kế hoạch.
- Chi phí ước tính mỗi người bằng tổng chi phí chia đều cho số người của nhóm, làm tròn lên theo bước làm tròn của tiền tệ ([R19](02-nguoi-tham-gia-va-chi-phi.md)), và hiển thị theo tiền tệ của kế hoạch gốc; tác giả bỏ được chi phí ước tính.
- Tác giả xem trước, sửa và bỏ bớt mục trước khi đăng; hành trình không có hoạt động nào thì không đăng được.
- Sửa hoặc xóa kế hoạch gốc không làm đổi hay xóa hành trình đã đăng.
- Tác giả sửa và gỡ được hành trình; tác giả gỡ là xóa hẳn.
- Ai cũng tìm được hành trình theo điểm đến mà không cần đăng nhập; tìm `Đà Lạt`, `Da Lat` hay `dalat` đều ra cùng kết quả, kể cả khi khu vực đó chỉ có ở nơi ở của hành trình.
- Kết quả sắp xếp được, và lọc được theo số ngày và ngôn ngữ.
- Người đã đăng nhập sao chép được hành trình thành kế hoạch mới: chọn ngày bắt đầu, đặt passcode; tiền tệ được điền sẵn theo hành trình và đổi được; hoạt động và nơi ở nằm đúng ngày tương ứng, hoạt động giữ giờ.
- Kế hoạch sao chép chỉ có chủ kế hoạch là người tham gia, không có khoản chi phí nào, và sửa được như mọi kế hoạch.
- Mỗi lần sao chép làm lượt sao chép tăng thêm một; xóa kế hoạch đã sao chép không làm giảm.
- "Hữu ích", báo cáo và kiểm duyệt của admin hoạt động với hành trình như với danh sách gợi ý.

## Edge Cases

- Chủ kế hoạch muốn chia sẻ khi tổng kết đang mở hoặc tạm khóa; nút chia sẻ chưa dùng được, kèm thông báo cần chốt tổng kết trước.
- Người chỉnh sửa bằng passcode muốn chia sẻ hành trình; không có thao tác chia sẻ cho họ.
- Kế hoạch có hoạt động nằm ngoài khoảng ngày của chuyến đi; hoạt động đó không được đưa vào, và màn hình xem trước cho biết.
- Kế hoạch không có khoản chi phí nào; hành trình không có chi phí ước tính.
- Ghi chú hoặc địa chỉ có thông tin cá nhân, như số điện thoại hay mã đặt phòng; tác giả được nhắc kiểm tra trước khi đăng, và người xem có thể báo cáo "lộ thông tin cá nhân".
- Chủ kế hoạch xóa kế hoạch gốc; hành trình vẫn còn, và tác giả vẫn sửa, gỡ được.
- Tác giả gỡ hành trình rồi chia sẻ lại từ cùng kế hoạch; hành trình mới có lượt hữu ích và lượt sao chép bắt đầu từ 0.
- Người chưa đăng nhập bấm sao chép; ứng dụng chuyển sang đăng nhập, xong thì quay lại bước sao chép ([R61](01-ke-hoach-va-quyen-truy-cap.md)).
- Một người sao chép cùng hành trình hai lần; tạo hai kế hoạch riêng, lượt sao chép tăng hai.
- Hành trình bị sửa, bị ẩn hoặc bị gỡ sau khi đã được sao chép; các kế hoạch đã sao chép giữ nguyên.
- Admin khóa một tài khoản; các hành trình của tài khoản đó bị ẩn, các kế hoạch đã sao chép giữ nguyên.
- Hành trình dùng tiền tệ khác với tiền tệ người xem quen dùng (ví dụ `JPY`); chi phí ước tính hiển thị bằng `JPY`, không quy đổi. Khi sao chép, kế hoạch mới được điền sẵn `JPY`, và người dùng đổi được.

## Khởi động khi chưa có dữ liệu

- Trước khi phát hành, team chia sẻ sẵn hành trình cho một số điểm đến phổ biến.
- Điểm đến chưa có hành trình: hiện trạng thái trống và mời người dùng chia sẻ hành trình đầu tiên.

## Chỉ số đánh giá

- Số hành trình đã đăng và số điểm đến có ít nhất một hành trình.
- Số lượt tìm kiếm và lượt sao chép.
- Tỷ lệ hành trình bị báo cáo.
