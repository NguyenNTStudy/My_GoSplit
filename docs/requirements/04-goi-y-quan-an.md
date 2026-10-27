# 04 — Gợi ý quán ăn từ cộng đồng

Người dùng đã đăng nhập, chủ yếu là người địa phương, đăng danh sách gợi ý quán ăn cho một khu vực. Người đi du lịch tìm theo điểm đến rồi áp dụng vào danh sách món ăn của kế hoạch. Tính năng không dùng AI.

Liên quan: [03 Lịch trình, nơi ở và danh sách món ăn](03-lich-trinh-noi-o-mon-an.md) · [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) · [07 Chia sẻ hành trình](07-chia-se-hanh-trinh.md) · [Tổng quan](README.md)

## Vị trí trong ứng dụng

- **Lựa chọn "Quán ăn" trong mục "Khám phá"** ở màn hình chính, bên cạnh mục "Kế hoạch"; mục Khám phá còn có lựa chọn "Hành trình" ([07](07-chia-se-hanh-trinh.md)). Nhờ vậy người dùng tìm được quán ăn cả khi chưa tạo kế hoạch.
- **Trong kế hoạch:** lựa chọn "Gợi ý quán" bên trong tab "Ăn gì", hiện sẵn các khu vực nơi ở của kế hoạch.

## Ai được làm gì

| Thao tác | Ai được làm |
|---|---|
| Tìm và xem danh sách | Mọi người, kể cả chưa đăng nhập |
| Áp dụng vào kế hoạch | Người có quyền chỉnh sửa kế hoạch đó |
| Đăng danh sách, bấm "Hữu ích" | Người đã đăng nhập |
| Báo cáo | Mọi người, có rate limit theo IP |

Lý do bắt buộc đăng nhập mới được đăng: để biết ai đăng khi cần xử lý spam hay quảng cáo, và để tác giả sửa hoặc gỡ danh sách về sau.

## Dữ liệu

### Danh sách gợi ý quán ăn

- `guideId`: mã định danh duy nhất của danh sách gợi ý.
- `authorId`: tài khoản đăng danh sách gợi ý.
- `title`: tiêu đề, ví dụ `Ăn gì ở Đà Lạt — người Đà Lạt chỉ`.
- `area`: thành phố hoặc khu vực, nhập tự do (R34).
- `country`: mã quốc gia (ISO 3166-1).
- `description`: mô tả ngắn.
- `language`: ngôn ngữ viết danh sách gợi ý.
- `isLocal`: tác giả có đánh dấu "Tôi sống ở đây" hay không.
- `status`: đang hiển thị, bị ẩn do báo cáo, hoặc bị admin gỡ (R44).
- `helpfulCount`: số lượt "Hữu ích".
- `applyCount`: lượt sử dụng: số kế hoạch đã áp dụng danh sách gợi ý (R41).
- `createdAt`: ngày giờ tạo.
- `updatedAt`: ngày giờ cập nhật gần nhất; hiển thị là "Cập nhật lần cuối".

### Mục trong danh sách gợi ý

- `entryId`: mã định danh duy nhất của mục.
- `dishName`: tên món.
- `placeName`: tên quán.
- `directions`: đường đến quán, nhập tự do: địa chỉ, link (bản đồ, trang Facebook, website) hoặc cách đi (R36).
- `mealSlots`: các buổi phù hợp (tùy chọn, chọn được nhiều buổi): sáng, chiều, tối.
- `notes`: ghi chú (tùy chọn), ví dụ giá hoặc giờ mở cửa.
- `order`: vị trí trong danh sách gợi ý.

Ví dụ một mục:

| Thông tin | Bắt buộc | Ví dụ |
|---|---|---|
| Tên món | Có | Bánh căn |
| Tên quán | Có | Bánh căn Nhà Chung |
| Đường đến quán | Có | Địa chỉ, link Google Maps hoặc trang Facebook của quán, hoặc cách đi |
| Buổi phù hợp | Không | Sáng, chiều |
| Ghi chú | Không | Khoảng 30.000đ/phần, mở 6h–10h |

### Lượt hữu ích

- `guideId`: danh sách gợi ý được đánh dấu hữu ích.
- `accountId`: tài khoản đánh dấu; mỗi tài khoản một lượt cho mỗi danh sách gợi ý.

### Báo cáo

- `guideId`: danh sách gợi ý bị báo cáo.
- `reason`: quảng cáo, sai thông tin, quán đã đóng cửa, hoặc nội dung không phù hợp.
- `reporter`: tài khoản báo cáo, hoặc địa chỉ IP đã hash nếu chưa đăng nhập ([R53](06-bao-mat-du-lieu.md)).
- `createdAt`: ngày giờ báo cáo.

## Quy tắc

- **R34.** Khu vực của nơi ở và của danh sách gợi ý được nhập tự do. Khi tìm kiếm, khu vực được so sánh không phân biệt dấu và chữ hoa/thường, và tìm gần đúng, nên `Đà Lạt`, `Da Lat` và `dalat` cho ra cùng các danh sách gợi ý. Khi người dùng gõ khu vực, ứng dụng gợi ý các khu vực của danh sách gợi ý đã đăng; người dùng có thể bỏ qua gợi ý và giữ chữ mình gõ.
- **R35.** Chỉ người đã đăng nhập mới được đăng danh sách gợi ý; tác giả hiển thị bằng tên hiển thị của tài khoản (R37). Một danh sách gợi ý có tiêu đề, khu vực, quốc gia, mô tả ngắn, ngôn ngữ viết, và các mục có ít nhất 3 quán khác nhau; nhiều món ở cùng một quán chỉ tính là một quán. Mỗi mục bắt buộc có tên món, tên quán và đường đến quán (R36); buổi phù hợp và ghi chú là tùy chọn. Tác giả xem trước trước khi đăng, và đồng ý điều khoản sử dụng khi đăng lần đầu. Chủ quán được đăng danh sách gợi ý có quán của mình.
- **R36.** Đường đến quán trong mục được nhập tự do: địa chỉ, link bất kỳ (ví dụ bản đồ, trang Facebook hoặc website) hoặc mô tả cách đi. Link trong đó bấm vào được; link được đánh dấu là nội dung người dùng để công cụ tìm kiếm không đi theo, và được mở mà không gửi kèm địa chỉ trang hiện tại.
- **R37.** Danh sách gợi ý hiển thị tên hiển thị của tác giả ([R78](01-ke-hoach-va-quyen-truy-cap.md)), kèm một huy hiệu tag ở cuối do ứng dụng cấp cho tài khoản (ví dụ `Thảo` `#4821`), để phân biệt các tác giả trùng tên. Username đăng nhập không bao giờ được hiển thị. Khi đăng, tác giả có thể đánh dấu "Tôi sống ở đây"; danh sách gợi ý khi đó có huy hiệu Người địa phương. Huy hiệu do tác giả tự khai báo, không được xác minh.
- **R38.** Người đã đăng nhập và có quyền chỉnh sửa một kế hoạch có thể tạo danh sách gợi ý từ danh sách món ăn của kế hoạch đó. Chỉ tên món, tên quán, đường đến quán, buổi và ghi chú được sao chép; tên người tham gia, chi phí và các thông tin khác của kế hoạch không được sao chép. Món chưa có tên quán hoặc đường đến quán phải được bổ sung hoặc bỏ ra trước khi đăng.
- **R39.** Danh sách gợi ý đã đăng độc lập với kế hoạch: sửa kế hoạch dùng để tạo nó không làm đổi danh sách gợi ý. Tác giả có thể sửa hoặc gỡ danh sách gợi ý bất cứ lúc nào; tác giả gỡ thì danh sách gợi ý bị xóa hẳn. Danh sách gợi ý hiển thị thời điểm cập nhật lần cuối.
- **R40.** Ai cũng tìm và xem được danh sách gợi ý mà không cần đăng nhập. Tìm theo điểm đến (R34). Trong mỗi kế hoạch, Gợi ý quán ăn là một lựa chọn trong tab Ăn gì, hiện sẵn các khu vực nơi ở của kế hoạch. Kết quả được sắp theo lượt "Hữu ích", lượt sử dụng (R41) và độ mới, và lọc được theo buổi và ngôn ngữ. Danh sách gợi ý bị ẩn hoặc đã gỡ không xuất hiện trong kết quả tìm kiếm.
- **R41.** Người có quyền chỉnh sửa một kế hoạch có thể áp dụng cả danh sách gợi ý hoặc từng mục vào danh sách món ăn của kế hoạch, và có thể áp dụng nhiều danh sách gợi ý vào cùng một kế hoạch. Các mục được thêm vào danh sách món ăn của kế hoạch, giữ nguyên tên món, quán, đường đến quán và các buổi; khi áp dụng một mục lẻ, người dùng có thể chọn lại các buổi. Món được áp dụng là bản sao độc lập, không còn liên kết với danh sách gợi ý gốc, và trở thành món bình thường của kế hoạch: người có quyền chỉnh sửa có thể sửa, sắp xếp hoặc xóa; danh sách gợi ý bị sửa hoặc bị gỡ sau đó không làm đổi kế hoạch. Mỗi lần một danh sách gợi ý được áp dụng vào một kế hoạch, lượt sử dụng của nó tăng thêm một; áp dụng lại cùng danh sách gợi ý vào cùng kế hoạch thì không tăng thêm. Xóa món đã áp dụng hoặc xóa kế hoạch không làm giảm lượt sử dụng.
- **R42.** Người đã đăng nhập có thể đánh dấu một danh sách gợi ý là "Hữu ích", tối đa một lần cho mỗi danh sách gợi ý, và có thể bỏ đánh dấu.
- **R43.** Ai cũng báo cáo được danh sách gợi ý, kèm lý do: quảng cáo, sai thông tin, quán đã đóng cửa, hoặc nội dung không phù hợp. Việc báo cáo bị giới hạn theo địa chỉ IP, và mỗi người (một tài khoản, hoặc một địa chỉ IP nếu chưa đăng nhập) chỉ được tính một lần cho mỗi danh sách gợi ý. Danh sách gợi ý bị 3 người khác nhau báo cáo sẽ bị ẩn với mọi người, trừ tác giả và admin, cho đến khi admin xem xét.
- **R44.** Admin là các tài khoản do người vận hành ứng dụng chỉ định. Trên trang admin, admin xem các danh sách gợi ý bị báo cáo, có thể khôi phục hoặc gỡ, và có thể khóa tài khoản spam. Danh sách bị admin gỡ được giữ lại ở trạng thái đã gỡ để xử lý spam, và không ai ngoài admin thấy được. Tài khoản bị khóa không thể đăng, đánh dấu hữu ích hay báo cáo, và các danh sách gợi ý của tài khoản đó bị ẩn.
- **R45.** Nội dung danh sách gợi ý, tên hiển thị và username được kiểm tra bằng bộ lọc từ ngữ thô tục cơ bản trước khi đăng. Không giới hạn số danh sách gợi ý một tài khoản đăng mỗi ngày.

## Acceptance Criteria

- Người đã đăng nhập có thể đăng, sửa và gỡ danh sách gợi ý; người chưa đăng nhập không đăng được.
- Danh sách gợi ý hiển thị tên hiển thị của tác giả kèm huy hiệu tag ở cuối, để phân biệt các tác giả trùng tên; không hiển thị username.
- Danh sách gợi ý có ít hơn 3 quán khác nhau thì không đăng được; người dùng nhận được thông báo rõ ràng.
- Mục thiếu tên món, tên quán hoặc đường đến quán thì không đăng được; người dùng nhận được thông báo rõ ràng.
- Link trong đường đến quán bấm vào được.
- Người dùng có thể tạo danh sách gợi ý từ danh sách món ăn của một kế hoạch, và danh sách gợi ý không chứa tên người tham gia, chi phí hay thông tin khác của kế hoạch.
- Ai cũng tìm được danh sách gợi ý theo điểm đến mà không cần đăng nhập; tìm `Đà Lạt`, `Da Lat` hay `dalat` đều ra cùng kết quả.
- Trong kế hoạch, lựa chọn Gợi ý quán trong tab Ăn gì hiện sẵn các khu vực nơi ở của kế hoạch.
- Kết quả sắp xếp được, và lọc được theo buổi và ngôn ngữ; danh sách gợi ý của người tự khai là người địa phương có huy hiệu Người địa phương.
- Người có quyền chỉnh sửa có thể áp dụng cả danh sách gợi ý hoặc từng mục; mục được áp dụng giữ các buổi của mục, hoặc các buổi người dùng chọn lại.
- Có thể áp dụng nhiều danh sách gợi ý vào cùng một kế hoạch.
- Áp dụng một danh sách gợi ý vào một kế hoạch làm lượt sử dụng tăng thêm một; áp dụng lại vào cùng kế hoạch thì không tăng.
- Xóa món đã áp dụng hoặc xóa kế hoạch không làm giảm lượt sử dụng của danh sách gợi ý.
- Món đã áp dụng sửa, sắp xếp và xóa được như mọi món khác.
- Sửa hoặc gỡ danh sách gợi ý sau khi đã áp dụng không làm đổi kế hoạch.
- Người đã đăng nhập có thể đánh dấu "Hữu ích" một lần và bỏ đánh dấu.
- Ai cũng báo cáo được danh sách gợi ý kèm lý do; danh sách gợi ý bị 3 người khác nhau báo cáo không còn xuất hiện trong kết quả tìm kiếm cho đến khi admin xem xét.
- Admin có thể khôi phục hoặc gỡ danh sách gợi ý bị báo cáo, và khóa tài khoản spam.

## Edge Cases

- Nơi ở và danh sách gợi ý ghi cùng một khu vực theo cách khác nhau (`Đà Lạt`, `Da Lat`, `Dalat`); tìm kiếm vẫn ra danh sách gợi ý đó.
- Điểm đến được gõ sai chính tả nhẹ hoặc thừa khoảng trắng; tìm kiếm vẫn ra các kết quả gần đúng. Điểm đến không có kết quả gần đúng thì hiển thị trạng thái trống, mời người địa phương đăng danh sách gợi ý đầu tiên.
- Kế hoạch chưa có nơi ở; ô tìm kiếm không có khu vực gợi ý sẵn, người dùng tự gõ điểm đến.
- Danh sách gợi ý có ít hơn 3 quán khác nhau, ví dụ nhiều món ở cùng một quán; không đăng được. Sửa danh sách gợi ý đã đăng mà làm còn ít hơn 3 quán thì không lưu được.
- Chủ quán đăng danh sách gợi ý có quán của mình; được phép nếu danh sách có ít nhất 3 quán khác nhau.
- Đường đến quán chứa link trang bán hàng hoặc khuyến mãi; được phép, và người xem có thể báo cáo danh sách gợi ý là quảng cáo.
- Hai người có cùng tên hiển thị; cả hai đều được, và huy hiệu tag giúp phân biệt họ.
- Tạo danh sách gợi ý từ danh sách món ăn có món chưa có tên quán hoặc đường đến quán; tác giả bổ sung hoặc bỏ các món đó ra trước khi đăng.
- Cùng một danh sách gợi ý được áp dụng vào kế hoạch hai lần, hoặc hai danh sách gợi ý đã áp dụng có cùng món ở cùng quán; ứng dụng cho biết mục nào đã có trong kế hoạch và cho bỏ qua. Áp dụng lại cùng danh sách gợi ý vào cùng kế hoạch không làm tăng lượt sử dụng.
- Người dùng sửa hoặc xóa món áp dụng từ danh sách gợi ý; danh sách gợi ý gốc không bị đổi.
- Danh sách gợi ý bị sửa, bị ẩn hoặc bị gỡ sau khi đã được áp dụng; các món đã sao chép vào kế hoạch giữ nguyên.
- Kế hoạch đã áp dụng danh sách gợi ý bị xóa, hoặc món đã áp dụng bị xóa; lượt sử dụng của danh sách không giảm.
- Cùng một người báo cáo một danh sách gợi ý nhiều lần; chỉ tính một lần.
- Tác giả sửa danh sách gợi ý đang bị ẩn; danh sách gợi ý vẫn bị ẩn cho đến khi admin xem xét.
- Admin khóa một tài khoản; các danh sách gợi ý của tài khoản đó không còn xuất hiện trong kết quả tìm kiếm, các món đã áp dụng vào kế hoạch giữ nguyên.

## Khởi động khi chưa có dữ liệu

- Trước khi phát hành, team và người quen ở các thành phố đăng sẵn danh sách cho khoảng 20–30 điểm đến phổ biến.
- Nơi chưa có danh sách: hiện trạng thái trống và mời người địa phương đăng danh sách đầu tiên.

## Pháp lý

- Điều khoản sử dụng cho nội dung người dùng đăng: quyền hiển thị, quyền gỡ nội dung vi phạm.
- Ghi rõ thông tin quán do người dùng cung cấp, ứng dụng không bảo đảm tính chính xác.
- Người dùng đồng ý điều khoản khi đăng lần đầu.

## Chỉ số đánh giá

- Số danh sách đã đăng và số khu vực có ít nhất một danh sách.
- Số lượt tìm kiếm và lượt sử dụng (áp dụng vào kế hoạch).
- Tỷ lệ danh sách bị báo cáo.
