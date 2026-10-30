# 07 — Chia sẻ hành trình

Chủ kế hoạch chia sẻ hành trình của một chuyến đi đã chốt tổng kết lên cộng đồng: lịch trình, nơi ở, món ăn và chi phí ước tính mỗi người, không có thông tin của người tham gia. Người khác tìm theo điểm đến để tham khảo, rồi sao chép thành kế hoạch mới, hoặc thêm riêng lịch trình hay món ăn vào kế hoạch đang có.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) · [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) · [Tổng quan](README.md)

## Vị trí trong ứng dụng

Khám phá có ở ba nơi, và mỗi nơi chỉ gợi ý đúng loại nội dung của nơi đó:

- **Màn hình Kế hoạch** (cạnh danh sách kế hoạch của bạn): chỉ gợi ý cả kế hoạch, tức các hành trình, để xem và sao chép thành kế hoạch mới (R68). Ai cũng xem được, kể cả chưa đăng nhập hay chưa có kế hoạch.
- **Tab Lịch trình** của một kế hoạch: chỉ gợi ý lịch trình, tức hoạt động theo Ngày 1, Ngày 2, … của các hành trình, để chọn và sao chép vào kế hoạch (R79).
- **Tab Ăn gì** của một kế hoạch: chỉ gợi ý món ăn, gồm danh sách gợi ý quán ([04](04-goi-y-quan-an.md)) và danh sách món ăn của các hành trình, để thêm vào danh sách món ăn (R79).

Khi tổng kết đã chốt, chủ kế hoạch thấy nút "Chia sẻ hành trình" trong tab Tổng kết.

## Ai được làm gì

| Thao tác | Ai được làm |
|---|---|
| Tìm và xem hành trình | Mọi người, kể cả chưa đăng nhập |
| Chia sẻ hành trình | Chủ kế hoạch, khi tổng kết đã chốt |
| Sửa, gỡ hành trình | Tác giả |
| Sao chép thành kế hoạch mới, thả tim | Người đã đăng nhập |
| Thêm lịch trình hoặc món ăn của hành trình vào kế hoạch đang có | Người có quyền chỉnh sửa kế hoạch đó |
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
- `heartCount`: số tim (R69).
- `copyCount`: lượt sao chép: số kế hoạch đã nhận bản sao toàn bộ hoặc một phần của hành trình (R68, R79).
- `createdAt`: ngày giờ tạo.
- `updatedAt`: ngày giờ cập nhật gần nhất; hiển thị là "Cập nhật lần cuối".

### Mục trong hành trình

Hoạt động, nơi ở và món ăn được sao chép từ kế hoạch gốc ([03](03-lich-trinh-noi-o-mon-an.md)); ngày thật được thay bằng số thứ tự ngày (Ngày 1, Ngày 2, …):

- **Hoạt động:** `day` (số thứ tự ngày), `time` (giờ dự kiến, tùy chọn), `name`, `location`, `mapLink`, `notes`.
- **Nơi ở:** `name`, `area`, `country`, `address`, `mapLink`, `checkInDay` (ngày của đêm đầu tiên), `checkOutDay` (ngày rời đi).
- **Món ăn:** `dishName`, `placeName`, `directions`, `mealSlots`, `notes`, `order`.

### Tim và báo cáo

Giống danh sách gợi ý ([04](04-goi-y-quan-an.md)): mỗi tài khoản một tim cho mỗi hành trình; báo cáo lưu lý do, người báo cáo (tài khoản, hoặc địa chỉ IP đã hash) và thời điểm. Lý do báo cáo hành trình: quảng cáo, sai thông tin, lộ thông tin cá nhân, hoặc nội dung không phù hợp.

## Quy tắc

- **R63.** Chủ kế hoạch có thể chia sẻ hành trình của kế hoạch khi tổng kết đã chốt ([R59](02-nguoi-tham-gia-va-chi-phi.md)). Cần đồng ý điều khoản sử dụng khi đăng lần đầu, như danh sách gợi ý ([R35](04-goi-y-quan-an.md)). Mỗi kế hoạch có tối đa một hành trình; khi kế hoạch đã có hành trình, nút "Chia sẻ hành trình" mở hành trình đó để sửa.
- **R64.** Hành trình là bản sao của kế hoạch tại thời điểm chia sẻ, gồm: tiêu đề, điểm đến, mô tả ngắn, ngôn ngữ viết, theme, số ngày và số người của nhóm; các hoạt động kèm giờ, địa điểm, link bản đồ và ghi chú; các nơi ở kèm khu vực, quốc gia, địa chỉ, link bản đồ và các đêm ở; danh sách món ăn kèm quán, đường đến quán, các buổi và ghi chú; và chi phí ước tính mỗi người (R65), theo tiền tệ của kế hoạch. Ngày thật của chuyến đi không được sao chép: hoạt động và nơi ở chỉ giữ số thứ tự ngày. Hoạt động ở mục Ngày chưa xác định ([R81](03-lich-trinh-noi-o-mon-an.md)) không được đưa vào. Link trong hành trình được mở như link trong danh sách gợi ý ([R36](04-goi-y-quan-an.md)).
- **R65.** Tên người tham gia, từng khoản chi phí, tiền đóng, số tiền của từng người, QR chuyển khoản, passcode, link chia sẻ và ảnh nền riêng của kế hoạch không bao giờ được đưa vào hành trình. Chi phí ước tính mỗi người là tổng chi phí của chuyến đi chia đều cho số người của nhóm, làm tròn lên như [R19](02-nguoi-tham-gia-va-chi-phi.md). Tác giả có thể bỏ chi phí ước tính ra khi chia sẻ hoặc khi sửa.
- **R66.** Trước khi đăng, tác giả xem trước hành trình; có thể sửa tiêu đề, điểm đến, mô tả và nội dung từng mục, và bỏ bớt hoạt động, nơi ở hoặc món ăn. Ứng dụng nhắc tác giả kiểm tra ghi chú và địa chỉ để không lộ thông tin cá nhân. Hành trình cần ít nhất một hoạt động. Hành trình đã đăng độc lập với kế hoạch gốc: sửa hay xóa kế hoạch không làm đổi hay xóa hành trình. Tác giả có thể sửa hoặc gỡ hành trình bất cứ lúc nào; tác giả gỡ thì hành trình bị xóa hẳn. Hành trình hiển thị thời điểm cập nhật lần cuối.
- **R67.** Ai cũng tìm và xem được hành trình trong Khám phá của màn hình Kế hoạch mà không cần đăng nhập. Tìm theo điểm đến của hành trình và khu vực các nơi ở trong hành trình, không phân biệt dấu và gần đúng như [R34](04-goi-y-quan-an.md). Kết quả được sắp theo số tim, lượt sao chép (R68) và độ mới, và lọc được theo số ngày và ngôn ngữ. Hành trình hiển thị tên hiển thị kèm huy hiệu tag của tác giả ([R37](04-goi-y-quan-an.md)). Hành trình bị ẩn hoặc đã gỡ không xuất hiện trong kết quả tìm kiếm.
- **R68.** Người đã đăng nhập có thể sao chép toàn bộ một hành trình thành kế hoạch mới của mình. Khi bấm sao chép, người dùng chỉ chọn ngày đi và đặt passcode ([R5](01-ke-hoach-va-quyen-truy-cap.md)); ngày về tính theo số ngày của hành trình, còn tên, điểm đến, theme và tiền tệ lấy theo hành trình ([R70](02-nguoi-tham-gia-va-chi-phi.md)). Kế hoạch mới có các hoạt động và nơi ở ở đúng ngày tương ứng, giữ giờ của hoạt động, và có danh sách món ăn của hành trình. Số người, chi phí ước tính, khoản chi phí và tiền đóng không được sao chép: kế hoạch mới chỉ có chủ kế hoạch là người tham gia ([R26](02-nguoi-tham-gia-va-chi-phi.md)). Kế hoạch mới là bản sao độc lập: người dùng sửa được ngày ([R80](01-ke-hoach-va-quyen-truy-cap.md)), tên và mọi thông tin khác như mọi kế hoạch, và hành trình bị sửa hay bị gỡ sau đó không làm đổi kế hoạch. Mỗi kế hoạch nhận bản sao của một hành trình, toàn bộ hay một phần (R79), làm lượt sao chép của hành trình tăng thêm một, chỉ một lần cho mỗi kế hoạch; xóa kế hoạch không làm giảm lượt sao chép.
- **R69.** Tim, báo cáo, kiểm duyệt của admin, khóa tài khoản và bộ lọc từ ngữ thô tục áp dụng cho hành trình giống danh sách gợi ý ([R42](04-goi-y-quan-an.md)–[R45](04-goi-y-quan-an.md)): hành trình bị 3 người khác nhau báo cáo bị ẩn cho đến khi admin xem xét; admin gỡ thì hành trình được giữ ở trạng thái đã gỡ; tài khoản bị khóa thì các hành trình của tài khoản đó bị ẩn. Trang admin hiển thị cả hành trình và danh sách gợi ý bị báo cáo.
- **R79.** Người có quyền chỉnh sửa một kế hoạch thêm được một phần của hành trình vào kế hoạch đó, không cần đăng nhập nếu đã có passcode. Chỉ phần được chọn được sao chép; số người, chi phí và các phần khác của hành trình không làm đổi kế hoạch.
  - **Khám phá ở tab Lịch trình** chỉ hiện lịch trình của các hành trình: hoạt động theo ngày, không có nơi ở, món ăn, số người hay chi phí; tìm theo điểm đến, hiện sẵn điểm đến của kế hoạch. Xem một lịch trình là một danh sách chọn, giống khi áp dụng danh sách gợi ý ([R41](04-goi-y-quan-an.md)): mỗi ngày có một ô chọn, bên dưới là ô chọn của từng hoạt động; mặc định chọn tất cả. Chọn hoặc bỏ ô của ngày là chọn hoặc bỏ mọi hoạt động của ngày đó; khi chỉ chọn một phần, ô của ngày hiện trạng thái chọn một phần. Mỗi ngày ghi ngày của kế hoạch sẽ nhận hoạt động. Nút "Sao chép N hoạt động" ở cuối màn hình thêm các hoạt động đã chọn: hoạt động của Ngày N vào ngày thứ N của kế hoạch, giữ giờ, kể cả không có giờ, và xếp cùng các hoạt động đã có ([R60](01-ke-hoach-va-quyen-truy-cap.md)). Ngày của hành trình vượt quá số ngày của kế hoạch thì hoạt động vào mục Ngày chưa xác định, giữ giờ; người dùng chuyển chúng sang ngày khác sau ([R81](03-lich-trinh-noi-o-mon-an.md)). Nơi ở của hành trình không được thêm. Chỉ sao chép được khi tổng kết đang mở ([R58](03-lich-trinh-noi-o-mon-an.md)).
  - **Khám phá ở tab Ăn gì** chỉ hiện danh sách món ăn, gộp chung trong một danh sách: danh sách gợi ý quán ([R41](04-goi-y-quan-an.md)) và danh sách món ăn của các hành trình. Với món ăn của hành trình, nút "Thêm vào Ăn gì" thêm cả danh sách món ăn của hành trình hoặc từng món, như khi áp dụng danh sách gợi ý: giữ quán, đường đến quán, các buổi và ghi chú, và đánh dấu món đã có trong kế hoạch.

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
- Người đã đăng nhập sao chép được toàn bộ hành trình thành kế hoạch mới chỉ bằng chọn ngày đi và đặt passcode; hoạt động và nơi ở nằm đúng ngày tương ứng, hoạt động giữ giờ; tên, theme và tiền tệ theo hành trình, sửa được sau.
- Kế hoạch sao chép chỉ có chủ kế hoạch là người tham gia, không có khoản chi phí nào, và sửa được như mọi kế hoạch.
- Mỗi kế hoạch nhận bản sao làm lượt sao chép tăng thêm một, chỉ một lần cho mỗi kế hoạch; xóa kế hoạch không làm giảm.
- Trong tab Lịch trình, người có quyền chỉnh sửa chọn được từng hoạt động hoặc cả ngày của một hành trình và sao chép vào kế hoạch đang có: Ngày N vào ngày thứ N của kế hoạch, giữ giờ; ngày vượt quá kế hoạch vào mục Ngày chưa xác định; trong tab Ăn gì, thêm được cả danh sách món ăn hoặc từng món của hành trình.
- Tim, báo cáo và kiểm duyệt của admin hoạt động với hành trình như với danh sách gợi ý.

## Edge Cases

- Chủ kế hoạch muốn chia sẻ khi tổng kết đang mở hoặc tạm khóa; nút chia sẻ chưa dùng được, kèm thông báo cần chốt tổng kết trước.
- Người chỉnh sửa bằng passcode muốn chia sẻ hành trình; không có thao tác chia sẻ cho họ.
- Kế hoạch có hoạt động ở mục Ngày chưa xác định; hoạt động đó không được đưa vào, và màn hình xem trước cho biết.
- Kế hoạch không có khoản chi phí nào; hành trình không có chi phí ước tính.
- Ghi chú hoặc địa chỉ có thông tin cá nhân, như số điện thoại hay mã đặt phòng; tác giả được nhắc kiểm tra trước khi đăng, và người xem có thể báo cáo "lộ thông tin cá nhân".
- Chủ kế hoạch xóa kế hoạch gốc; hành trình vẫn còn, và tác giả vẫn sửa, gỡ được.
- Tác giả gỡ hành trình rồi chia sẻ lại từ cùng kế hoạch; hành trình mới có số tim và lượt sao chép bắt đầu từ 0.
- Người chưa đăng nhập bấm sao chép; ứng dụng chuyển sang đăng nhập, xong thì quay lại bước sao chép ([R61](01-ke-hoach-va-quyen-truy-cap.md)).
- Một người sao chép cùng hành trình hai lần; tạo hai kế hoạch riêng, lượt sao chép tăng hai.
- Sao chép lịch trình 4 ngày vào kế hoạch 3 ngày; danh sách chọn ghi Ngày 4 vào "Chưa xác định", và các hoạt động đã chọn của Ngày 4 vào mục Ngày chưa xác định, giữ giờ.
- Chỉ chọn vài hoạt động của một ngày; ô của ngày hiện trạng thái chọn một phần, và chỉ các hoạt động đã chọn được thêm. Bỏ chọn hết thì nút sao chép bị tắt.
- Thêm lịch trình rồi thêm món ăn của cùng hành trình vào cùng kế hoạch; lượt sao chép chỉ tăng một.
- Tổng kết đang tạm khóa hoặc đã chốt; không sao chép được hoạt động, nhưng vẫn thêm được món ăn.
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
