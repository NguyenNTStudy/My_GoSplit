# Góp Gạo — Yêu cầu MVP Lập kế hoạch chuyến đi và Chia sẻ chi phí

## Tổng quan

Góp Gạo (tên tiếng Anh: GoSplit) là một ứng dụng trực tuyến để lập kế hoạch chuyến đi và theo dõi các khoản chi phí chung. Một kế hoạch bao gồm lịch trình chuyến đi, người tham gia, các khoản chi phí và bản tổng kết chuyến đi. Ứng dụng hỗ trợ kế hoạch thuộc sở hữu của tài khoản và kế hoạch có thể xem mà không cần tài khoản. Kế hoạch có thể truy cập trên nhiều thiết bị.

MVP không bao gồm tính năng phân tích dựa trên AI hoặc LLM. Gợi ý quán ăn từ cộng đồng được lên kế hoạch cho sau MVP.

## Phạm vi

### Trong phạm vi

- Tạo, liệt kê, xem, chỉnh sửa và xóa kế hoạch chuyến đi.
- Lưu giữ thông tin chuyến đi của các kế hoạch thuộc sở hữu tài khoản để chủ tài khoản có thể quay lại xem.
- Cho phép những người có đường link chia sẻ của kế hoạch xem kế hoạch đó mà không cần đăng nhập hay nhập passcode.
- Bảo vệ việc chỉnh sửa bằng passcode 6 chữ số. Ai có passcode cũng chỉnh sửa được kế hoạch, không cần mời qua email. Passcode dùng cho việc chỉnh sửa, không dùng cho việc xem.
- Chủ tài khoản của kế hoạch thuộc sở hữu tài khoản được chỉnh sửa mà không cần passcode. Chỉ chủ tài khoản được xóa kế hoạch thuộc sở hữu tài khoản; kế hoạch không có tài khoản thì ai có passcode cũng xóa được.
- Tại một thời điểm chỉ một người được chỉnh sửa kế hoạch.
- Tự động thêm chủ tài khoản thành người tham gia khi tạo kế hoạch thuộc sở hữu tài khoản.
- Hỏi "Bạn là ai?" khi một người chỉnh sửa kế hoạch lần đầu trên một thiết bị, để ứng dụng biết người tham gia nào đang dùng thiết bị đó.
- Khóa việc nhập passcode khi nhập sai nhiều lần, và cho phép mở khóa qua email khôi phục của kế hoạch.
- Cho phép kế hoạch không có tài khoản có email khôi phục (tùy chọn). Có thể đổi passcode qua link gửi đến email khôi phục.
- Hỗ trợ lưu trữ trực tuyến và xem/chỉnh sửa từ nhiều thiết bị.
- Quản lý người tham gia, các hoạt động trong lịch trình và các khoản chi phí của chuyến đi.
- Ghi lại nơi nhóm ở, kèm ngày của từng nơi. Một chuyến đi có thể có nhiều nơi ở khi đi qua nhiều địa điểm.
- Lưu danh sách món ăn cho từng ngày, chia theo bữa sáng, trưa, chiều và tối.
- Gán một khoản chi phí cho một hoạt động trong lịch trình hoặc ngày giờ tương ứng của hoạt động đó.
- Chia một khoản chi phí cho những người tham gia được chọn theo hệ số tỷ lệ có thể chỉnh sửa.
- Hiển thị bản tổng kết chuyến đi, bao gồm số tiền đã trả/đã chi, tổng chi phí chuyến đi, số tiền mỗi người tham gia cần đóng góp, và các đợt đóng góp tùy chọn (ví dụ: đợt một và đợt hai).
- Cho phép người có quyền chỉnh sửa đánh dấu một người tham gia là đã thanh toán.
- Chia sẻ link mở bản tổng kết chuyến đi, và xuất bản tổng kết thành ảnh.
- Hỗ trợ tiếng Việt và tiếng Anh. Tên ứng dụng là Góp Gạo trong tiếng Việt và GoSplit trong tiếng Anh.
- Cho người dùng chọn theme cho từng kế hoạch khi tạo. Theme có hình minh họa, và mọi người xem kế hoạch đều thấy cùng một theme.
- Cho người có quyền chỉnh sửa thay hình minh họa của theme bằng ảnh riêng.
- Dùng được trên trình duyệt điện thoại và máy tính, và cho phép cài ứng dụng lên màn hình chính của điện thoại.
- Tự động xóa các kế hoạch được tạo mà không có tài khoản sau 30 ngày kể từ lần cập nhật cuối cùng.

### Ngoài phạm vi

- Tích hợp AI hoặc LLM.
- Nhiều loại tiền tệ trong cùng một kế hoạch hoặc quy đổi tiền tệ.
- Xử lý thanh toán hoặc chuyển tiền.
- Theo dõi chi tiết công nợ/quyết toán giữa những người tham gia. MVP chỉ ghi nhận việc xác nhận có thẩm quyền rằng một người tham gia đã thanh toán; không theo dõi giao dịch thanh toán giữa hai người tham gia.
- Hiển thị bản đồ hoặc chỉ đường trong ứng dụng. Các hoạt động trong lịch trình có thể lưu một đường link bản đồ.
- Chỉnh sửa cộng tác realtime (nhiều người cùng chỉnh sửa một kế hoạch cùng lúc).
- Cài đặt sáng/tối riêng cho từng người dùng. Giao diện của kế hoạch do theme của kế hoạch quyết định.
- Tự động kiểm duyệt ảnh người dùng tải lên.
- Xuất bản tổng kết ra định dạng khác ngoài ảnh (ví dụ: PDF hoặc bảng tính), trừ khi được bổ sung thành yêu cầu sau này.

### Dự kiến sau MVP

- Gợi ý quán ăn từ cộng đồng, không dùng AI: người dùng đã đăng nhập, chủ yếu là người địa phương, đăng một danh sách cho một khu vực, gồm các món ăn kèm tên quán và link bản đồ của quán. Ai cũng tìm được danh sách theo điểm đến; người có quyền chỉnh sửa có thể áp dụng cả danh sách hoặc từng mục vào danh sách món của plan. Danh sách có thể được đánh dấu hữu ích hoặc bị báo cáo; danh sách bị nhiều người báo cáo sẽ bị ẩn cho đến khi được xem xét. Gợi ý quán ăn là một mục riêng trong ứng dụng, bên cạnh mục kế hoạch.
- Liên kết món ăn với khoản chi phí.

Kế hoạch chi tiết: [food-suggestions.md](food-suggestions.md).

## Các trường dữ liệu

Tên các trường dưới đây mang tính khái niệm và có thể được điều chỉnh khi triển khai.

### Kế hoạch chuyến đi

- `planId`: mã định danh duy nhất của kế hoạch; là chuỗi 10 chữ số được sinh ngẫu nhiên (ví dụ: `0041234567`). Lưu dạng chuỗi để giữ số 0 ở đầu và có thể tăng độ dài sau này.
- `name`: tên kế hoạch.
- `location`: điểm đến của chuyến đi; nếu đi qua nhiều nơi thì ghi ngắn gọn, ví dụ `Đà Lạt – Nha Trang`.
- `startDate`: ngày bắt đầu chuyến đi.
- `endDate`: ngày kết thúc chuyến đi.
- `notes`: ghi chú kế hoạch (tùy chọn).
- `currencyUnit`: một đơn vị tiền tệ do người dùng nhập cho kế hoạch; mặc định là `$`.
- `theme`: theme của kế hoạch, chọn khi tạo kế hoạch; mặc định là Gạo ấm.
- `coverImage`: ảnh riêng (tùy chọn) được tải lên để thay hình minh họa của theme, kèm vùng ảnh được chọn để hiển thị.
- `createdAt`: ngày giờ tạo.
- `updatedAt`: ngày giờ cập nhật gần nhất; dùng để tính thời hạn 30 ngày của các kế hoạch không có tài khoản.
- `ownerType`: kế hoạch thuộc sở hữu tài khoản hoặc kế hoạch không có tài khoản.
- `ownerId`: mã định danh chủ tài khoản khi kế hoạch thuộc sở hữu tài khoản.
- `ownerParticipantId`: người tham gia được tạo tự động cho chủ tài khoản khi tạo kế hoạch thuộc sở hữu tài khoản.
- `editPasscode`: passcode 6 chữ số dùng để chỉnh sửa, do người dùng tự đặt khi tạo kế hoạch. Được lưu như thông tin xác thực được bảo vệ và không được để lộ cho người xem.
- `recoveryEmail`: email khôi phục (tùy chọn), dùng để mở khóa việc nhập passcode và yêu cầu đổi passcode. Với kế hoạch thuộc sở hữu tài khoản thì dùng email của tài khoản. Không được để lộ cho người xem.
- `roundingRecipientParticipantId`: người tham gia nhận phần dư do làm tròn. Với kế hoạch không có tài khoản, để trống nghĩa là dùng mặc định (người tham gia đã chi nhiều tiền nhất).
- `passcodeLock`: số lần nhập sai passcode liên tiếp và thời điểm hết khóa nhập passcode.
- `editLock`: người đang giữ edit lock của kế hoạch và thời điểm lock hết hạn.

### Người tham gia

- `participantId`: mã định danh duy nhất của người tham gia.
- `displayName`: tên người tham gia.
- `status`: đang tham gia hoặc đã rời kế hoạch.
- `hasPaid`: người có quyền chỉnh sửa đã xác nhận người tham gia này đã thanh toán hay chưa.
- `paymentInstallments`: các bản ghi đợt đóng góp (tùy chọn), chẳng hạn số thứ tự đợt, số tiền và trạng thái đã thanh toán.

### Hoạt động trong lịch trình

- `activityId`: mã định danh duy nhất của hoạt động.
- `name`: tên hoạt động.
- `dateTime`: ngày giờ diễn ra hoạt động.
- `location`: tên địa điểm của hoạt động.
- `mapLink`: URL bản đồ (tùy chọn).
- `notes`: ghi chú hoạt động (tùy chọn).
- `order`: vị trí trong lịch trình của ngày.

### Nơi ở

- `stayId`: mã định danh duy nhất của nơi ở.
- `name`: nơi nhóm ở, ví dụ tên homestay hoặc khách sạn.
- `area`: thành phố hoặc khu vực, ví dụ `Đà Lạt` hoặc `Kyoto`.
- `country`: mã quốc gia (ISO 3166-1), ví dụ `VN` hoặc `JP`; hiển thị bằng tên theo ngôn ngữ của người dùng.
- `address`: địa chỉ (tùy chọn).
- `mapLink`: URL bản đồ (tùy chọn).
- `checkInDate`: ngày của đêm đầu tiên.
- `checkOutDate`: ngày rời đi.

### Món ăn

- `foodItemId`: mã định danh duy nhất của món ăn.
- `date`: ngày trong chuyến đi.
- `mealSlot`: bữa sáng, trưa, chiều hoặc tối.
- `dishName`: món ăn muốn thử.
- `placeName`: quán ăn (tùy chọn).
- `mapLink`: URL bản đồ (tùy chọn).
- `notes`: ghi chú (tùy chọn).
- `order`: vị trí trong bữa.

### Chi phí

- `expenseId`: mã định danh duy nhất của khoản chi phí.
- `description`: tiêu đề hoặc mô tả khoản chi phí.
- `amount`: số tiền dương, nhập tối đa ba chữ số thập phân.
- `paidByParticipantId`: người tham gia đã trả tiền; mặc định là người tạo khoản chi phí và có thể thay đổi bằng bộ chọn.
- `dateTime`: ngày giờ phát sinh chi phí.
- `notes`: ghi chú chi phí (tùy chọn).
- `activityId`: hoạt động trong lịch trình được liên kết (tùy chọn).
- `shares`: những người tham gia được chọn và hệ số tỷ lệ của họ.
- `hasLeftParticipantWarning`: cảnh báo được suy ra khi có người tham gia trong khoản chi phí đã rời kế hoạch.

## Quy tắc nghiệp vụ

1. Mỗi kế hoạch có đúng một đơn vị tiền tệ. Đơn vị này do người dùng nhập và mặc định là `$`. Không được kết hợp nhiều đơn vị tiền tệ khác nhau trong một kế hoạch.
2. Không thể lưu kế hoạch nếu ngày kết thúc sớm hơn ngày bắt đầu. Người dùng có thể chỉnh sửa ngày, nhưng khoảng thời gian không hợp lệ phải được sửa trước khi lưu.
3. Có thể xem kế hoạch qua đường link chia sẻ mà không cần xác thực hay passcode.
4. `planId` là số 10 chữ số được sinh ngẫu nhiên, không sinh tuần tự. Nếu mã sinh ra đã tồn tại thì sinh mã mới.
5. Mỗi kế hoạch có một passcode chỉnh sửa gồm 6 chữ số, do người dùng tự đặt khi tạo kế hoạch. Ai có passcode hợp lệ cũng chỉnh sửa được kế hoạch. Không cần passcode để xem.
6. Nếu passcode được chọn quá dễ đoán (ví dụ: `123456`, `000000` hoặc `111111`), ứng dụng hiển thị cảnh báo nhưng vẫn chấp nhận.
7. Với kế hoạch thuộc sở hữu tài khoản, chủ tài khoản chỉnh sửa được mà không cần nhập passcode và là người duy nhất được xóa kế hoạch. Với kế hoạch không có tài khoản, ai có passcode cũng xóa được.
8. Tại một thời điểm chỉ một người được chỉnh sửa kế hoạch. Người đầu tiên vào chế độ chỉnh sửa sẽ giữ edit lock của kế hoạch; những người khác chỉ xem được kế hoạch, kèm thông báo đang có người chỉnh sửa. Lock được nhả khi người chỉnh sửa thoát chế độ chỉnh sửa hoặc sau 5 phút không thao tác. Thao tác lưu sau khi lock của người chỉnh sửa đã hết hạn sẽ bị từ chối, thay vì ghi đè âm thầm lên thay đổi khác.
9. Sau 5 lần nhập sai passcode liên tiếp, việc nhập passcode của kế hoạch bị khóa 12 giờ. Mỗi lần khóa, hệ thống gửi một email kèm link mở khóa đến email khôi phục của kế hoạch; mở link thì khóa được gỡ ngay. Nếu không có email khôi phục, khóa kéo dài đủ 12 giờ. Các thiết bị đã có quyền chỉnh sửa từ trước không bị ảnh hưởng.
10. Khi tạo kế hoạch không có tài khoản, người dùng có thể nhập email khôi phục. Nếu kế hoạch chưa có email khôi phục, người có quyền chỉnh sửa có thể thêm sau; khi email đã được xác nhận thì không thể sửa nữa. Email này phải được xác nhận qua link gửi đến nó trước khi dùng để mở khóa hoặc đổi passcode. Với kế hoạch thuộc sở hữu tài khoản thì dùng email của tài khoản.
11. Để đổi passcode, người dùng nhập email khôi phục của kế hoạch. Nếu email khớp với email khôi phục đã xác nhận (hoặc email tài khoản với kế hoạch thuộc sở hữu tài khoản), hệ thống gửi một link đổi passcode chỉ dùng được một lần và có hiệu lực trong 1 giờ; mở link thì người dùng đặt được passcode mới. Ứng dụng hiển thị cùng một thông báo dù email có khớp hay không, để không làm lộ email khôi phục. Kế hoạch không có email khôi phục thì không thể đổi hay khôi phục passcode. Sau khi đổi, các thiết bị dùng passcode cũ mất quyền chỉnh sửa, và khóa nhập passcode (nếu có) được gỡ.
12. Chỉ có thể chọn một người tham gia cho các khoản chi phí mới khi người đó còn đang tham gia kế hoạch.
13. Không được xóa vật lý những người tham gia đã có chi phí trong lịch sử. Người có quyền chỉnh sửa có thể đánh dấu họ là đã rời kế hoạch. Các bản ghi chi phí trong lịch sử của họ được giữ nguyên.
14. Một khoản chi phí phải thuộc về một kế hoạch, có số tiền dương, có một người trả tiền và có ít nhất một người tham gia chia phần.
15. Người trả tiền mặc định là người tạo khoản chi phí (xem quy tắc 26 và 27). Có thể thay đổi người trả tiền, và người trả tiền không bắt buộc phải nằm trong số những người chia khoản chi phí đó.
16. Phần chia chi phí được phân bổ theo tỷ lệ. Tỷ lệ mặc định cho mỗi người tham gia được chọn là `1`; người dùng có thể thay đổi. Tỷ lệ phải lớn hơn không.
17. Phần chia chưa làm tròn của một người tham gia được tính bằng `số tiền chi phí × tỷ lệ của người tham gia / tổng tỷ lệ của những người tham gia được chọn`.
18. Số tiền chi phí nhập vào hỗ trợ tối đa ba chữ số sau dấu thập phân. Các phép tính giữ nguyên độ chính xác và chỉ làm tròn khi đưa ra kết quả cuối cùng.
19. Số tiền cuối cùng được làm tròn lên đến đơn vị tiền tệ nguyên tiếp theo (ví dụ: `52.3333` thành `53`). Với kế hoạch thuộc sở hữu tài khoản, người tham gia đại diện cho chủ tài khoản nhận phần dư do làm tròn (quy tắc 26). Với kế hoạch không có tài khoản, mặc định người tham gia đã chi nhiều tiền nhất cho chuyến đi nhận phần dư; người có quyền chỉnh sửa có thể chọn người khác. Nếu nhiều người cùng chi số tiền cao nhất, người được thêm vào kế hoạch sớm nhất sẽ nhận. Phần dư không được theo dõi như một khoản tiền hay giao dịch riêng.
20. Hệ thống tính lại phần chia chi phí, tổng số đã trả/đã chi và kết quả đóng góp khi một khoản chi phí được tạo, chỉnh sửa hoặc xóa.
21. Nếu một khoản chi phí có người tham gia sau đó rời kế hoạch, khoản chi phí đó được giữ nguyên và hiển thị cảnh báo cho người có quyền chỉnh sửa. Việc chỉnh sửa khoản chi phí như vậy cần một thao tác riêng có xác nhận và sẽ tính lại các phần chia bị ảnh hưởng.
22. Xóa kế hoạch cần xác nhận vì thao tác này sẽ xóa kế hoạch cùng với lịch trình, người tham gia và các khoản chi phí liên quan.
23. Người có quyền chỉnh sửa có thể đánh dấu một người tham gia là đã thanh toán. Việc xác nhận này tách biệt với khoản chi phí và không được tính vào chi tiêu của chuyến đi.
24. Các kế hoạch được tạo mà không có tài khoản sẽ hết hạn và bị xóa sau 30 ngày kể từ lần cập nhật cuối cùng.
25. Một khoản chi phí có thể được liên kết với một hoạt động trong lịch trình. Ngày giờ của khoản chi phí có thể được hiển thị cùng với mục tương ứng trong lịch trình.
26. Khi tạo kế hoạch thuộc sở hữu tài khoản, chủ tài khoản được tự động thêm thành người tham gia. Trên các thiết bị chủ tài khoản đã đăng nhập, ứng dụng dùng người tham gia này mà không cần hỏi.
27. Lần đầu một người chỉnh sửa kế hoạch trên một thiết bị, ứng dụng hỏi "Bạn là ai?" và người dùng chọn tên mình trong danh sách người tham gia đang hoạt động. Lựa chọn được lưu trên thiết bị đó và có thể đổi sau. Lựa chọn này được dùng làm người trả tiền mặc định cho các khoản chi phí mới. Người dùng có thể bỏ qua câu hỏi (ví dụ: người tổ chức nhưng không đi cùng); nếu không chọn, phải chọn người trả tiền cho từng khoản chi phí.
28. Giao diện có tiếng Việt và tiếng Anh. Lần đầu sử dụng, ứng dụng theo ngôn ngữ của trình duyệt; nếu là ngôn ngữ khác thì dùng tiếng Anh. Người dùng có thể đổi ngôn ngữ bất cứ lúc nào; lựa chọn được lưu trên thiết bị và, khi đã đăng nhập, theo tài khoản. Link chia sẻ không chứa ngôn ngữ, nên mỗi người mở link thấy kế hoạch theo ngôn ngữ của mình. Ngày giờ và số được định dạng theo ngôn ngữ đang chọn; đơn vị tiền tệ của kế hoạch không thay đổi. Email được gửi theo ngôn ngữ người dùng đang dùng lúc yêu cầu.
29. Mỗi kế hoạch có một theme, được chọn khi tạo kế hoạch (mặc định: Gạo ấm). Theme quyết định màu sắc và hình minh họa của kế hoạch. Mọi người mở kế hoạch đều thấy theme đó, và người có quyền chỉnh sửa có thể đổi theme sau. Các màn hình không thuộc một kế hoạch cụ thể, như danh sách kế hoạch, dùng theme mặc định. Ảnh xuất bản tổng kết và thẻ preview của link dùng theme của kế hoạch.
30. Người có quyền chỉnh sửa có thể thay hình minh họa của theme bằng ảnh riêng (JPG, PNG, WebP hoặc HEIC, tối đa 10 MB). Ứng dụng tự thu nhỏ và nén ảnh, xóa thông tin vị trí và metadata khác, và cho người dùng chọn vùng ảnh được hiển thị. Màu của theme giữ nguyên. Ảnh vẫn giữ khi đổi theme, và người có quyền chỉnh sửa có thể gỡ ảnh để quay về hình minh họa của theme. Mọi người xem được kế hoạch đều thấy ảnh này; ứng dụng nhắc người tải ảnh về điều đó. Ảnh bị xóa cùng với kế hoạch. Khi kế hoạch có ảnh riêng, ảnh xuất bản tổng kết và thẻ preview của link dùng ảnh đó.
31. Một kế hoạch có thể có một hoặc nhiều nơi ở. Ngày nhận và trả phòng của mỗi nơi ở phải nằm trong khoảng ngày của kế hoạch, và ngày trả phải sau ngày nhận. Các nơi ở không được chồng nhau, trừ trường hợp ngày trả phòng của nơi này trùng ngày nhận phòng của nơi tiếp theo. Cho phép có đêm không có nơi ở, ví dụ đi xe giường nằm qua đêm.
32. Với mỗi ngày trong chuyến đi, ứng dụng hiển thị nơi nhóm ở đêm đó. Vào ngày di chuyển, ứng dụng hiển thị cả nơi rời đi và nơi đến. Lịch trình và danh sách món ăn đều hiển thị thông tin này cho từng ngày. Khu vực và quốc gia theo ngày này sẽ được dùng để gợi ý danh sách quán ăn của cộng đồng cho khu vực đó sau này.
33. Mỗi ngày trong chuyến đi có một danh sách món ăn chia thành bốn bữa: sáng, trưa, chiều và tối. Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món; ai xem được kế hoạch đều xem được danh sách. Món ăn bắt buộc có tên món; quán ăn, link bản đồ và ghi chú là tùy chọn. Trong MVP, món ăn không liên kết với khoản chi phí.

## Acceptance Criteria

### Kế hoạch và quyền truy cập

- Người dùng có thể tạo, liệt kê, xem, chỉnh sửa và xóa kế hoạch.
- Kế hoạch lưu tên, địa điểm, ngày bắt đầu/kết thúc, ghi chú, đơn vị tiền tệ và các mốc thời gian.
- Kế hoạch mới được cấp một mã kế hoạch ngẫu nhiên gồm 10 chữ số.
- Không thể lưu kế hoạch có ngày kết thúc trước ngày bắt đầu; người dùng nhận được thông báo kiểm tra hợp lệ rõ ràng.
- Người xem có thể mở kế hoạch được chia sẻ mà không cần đăng nhập hay nhập passcode.
- Người dùng không có passcode đúng thì không thể chỉnh sửa kế hoạch, trừ khi là chủ tài khoản của kế hoạch thuộc sở hữu tài khoản.
- Passcode hợp lệ cho phép chỉnh sửa mọi kế hoạch và xóa kế hoạch không có tài khoản.
- Chỉ chủ tài khoản mới xóa được kế hoạch thuộc sở hữu tài khoản.
- Passcode dễ đoán vẫn được chấp nhận, kèm cảnh báo.
- Sau 5 lần nhập sai passcode liên tiếp, việc nhập passcode bị khóa 12 giờ và một email mở khóa được gửi đến email khôi phục; link mở khóa gỡ khóa ngay lập tức.
- Passcode và email khôi phục không bao giờ hiển thị cho người xem.
- Có thể thêm email khôi phục sau nếu kế hoạch chưa có, và không thể sửa khi email đã được xác nhận.
- Người dùng có thể đổi passcode qua link gửi đến email khôi phục đã xác nhận. Sau khi đổi, các thiết bị dùng passcode cũ mất quyền chỉnh sửa.
- Khi một người đang chỉnh sửa kế hoạch, những người khác chỉ xem được, kèm thông báo đang có người chỉnh sửa.
- Edit lock được nhả khi người chỉnh sửa thoát chế độ chỉnh sửa hoặc sau 5 phút không thao tác.
- Chủ tài khoản có thể mở kế hoạch thuộc sở hữu tài khoản từ nhiều thiết bị.
- Các thay đổi thực hiện trên một thiết bị sẽ có trên các thiết bị khác.
- Xóa kế hoạch cần có xác nhận rõ ràng.
- Kế hoạch không có tài khoản đủ điều kiện bị xóa sau 30 ngày kể từ lần cập nhật cuối cùng.

### Người tham gia và phân quyền

- Người có quyền chỉnh sửa có thể thêm người tham gia và cập nhật tên hiển thị của họ.
- Khi tạo kế hoạch thuộc sở hữu tài khoản, chủ tài khoản xuất hiện trong danh sách người tham gia.
- Lần đầu chỉnh sửa kế hoạch trên một thiết bị, ứng dụng hỏi người dùng là ai trong danh sách người tham gia đang hoạt động; lựa chọn được ghi nhớ trên thiết bị đó, có thể đổi hoặc bỏ qua.
- Khoản chi phí mới dùng người tham gia đã chọn trên thiết bị làm người trả tiền mặc định.
- Người tham gia đã có chi phí trong lịch sử có thể được đánh dấu là đã rời kế hoạch mà không xóa các bản ghi lịch sử của họ.
- Người tham gia đã rời kế hoạch không thể được chọn để chia các khoản chi phí mới.
- Các khoản chi phí có người tham gia đã rời kế hoạch sẽ hiển thị cảnh báo cho người có quyền chỉnh sửa.
- Chỉ người có quyền chỉnh sửa mới có thể xác nhận một người tham gia đã thanh toán.
- Việc xác nhận thanh toán không làm tăng chi tiêu chuyến đi hay tổng chi phí.

### Lịch trình

- Người dùng có thể thêm, chỉnh sửa và xóa các hoạt động trong lịch trình.
- Một hoạt động có thể lưu tên, ngày/giờ, tên địa điểm, link bản đồ (tùy chọn), ghi chú và thứ tự.
- Có thể xem khoản chi phí được liên kết trong mối liên hệ với hoạt động trong lịch trình hoặc ngày/giờ tương ứng.

### Nơi ở và danh sách món ăn

- Người có quyền chỉnh sửa có thể thêm, sửa và xóa nơi ở với tên, khu vực, quốc gia, địa chỉ và link bản đồ (tùy chọn), cùng ngày nhận/trả phòng.
- Không thể lưu nơi ở chồng lên nơi ở khác hoặc nằm ngoài ngày của kế hoạch; người dùng nhận được thông báo kiểm tra hợp lệ rõ ràng.
- Mỗi ngày trong lịch trình và danh sách món ăn hiển thị nơi nhóm ở đêm đó, và cả hai nơi vào ngày di chuyển.
- Người có quyền chỉnh sửa có thể thêm, sửa, sắp xếp và xóa món ăn cho từng ngày và từng bữa (sáng, trưa, chiều, tối).
- Ai xem được kế hoạch đều xem được danh sách món ăn mà không cần passcode.

### Chi phí và tổng kết

- Người dùng có thể thêm, chỉnh sửa và xóa một khoản chi phí với mô tả, số tiền dương, người trả tiền, ngày/giờ và ít nhất một người tham gia được chọn.
- Người trả tiền mặc định là người tạo khoản chi phí và có thể đổi sang người tham gia khác; người trả tiền không bắt buộc phải chia khoản chi phí đó.
- Mỗi người tham gia được chọn bắt đầu với tỷ lệ `1`; người dùng có thể nhập một tỷ lệ dương khác.
- Hệ thống phân bổ khoản chi phí theo tỷ lệ đã chọn và giữ nguyên độ chính xác tính toán cho đến kết quả cuối cùng.
- Số tiền nhập vào có hơn ba chữ số thập phân hoặc không dương sẽ bị từ chối kèm thông báo kiểm tra hợp lệ rõ ràng.
- Kết quả đóng góp cuối cùng được hiển thị theo quy tắc làm tròn lên đã thống nhất. Phần dư do làm tròn thuộc về người tạo kế hoạch với kế hoạch thuộc sở hữu tài khoản, hoặc mặc định thuộc về người đã chi nhiều tiền nhất với kế hoạch không có tài khoản, và không có bản ghi phần dư riêng.
- Chỉnh sửa hoặc xóa một khoản chi phí sẽ cập nhật các tổng số và kết quả liên quan.
- Bản tổng kết chuyến đi hiển thị số tiền đã trả/đã chi, tổng chi phí chuyến đi và số tiền những người tham gia cần đóng góp.
- Bản tổng kết có thể hiển thị các đợt đóng góp, chẳng hạn đợt một và đợt hai.
- Người có quyền chỉnh sửa có thể đánh dấu một người tham gia là đã thanh toán, và bản tổng kết phản ánh trạng thái đó.
- Người dùng có thể chia sẻ link mở bản tổng kết chuyến đi.
- Người dùng có thể xuất bản tổng kết chuyến đi thành ảnh.

### Ngôn ngữ và theme

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

- Ngày bắt đầu và ngày kết thúc của kế hoạch trùng nhau.
- Ngày kết thúc sớm hơn ngày bắt đầu trong khi chỉnh sửa.
- Kế hoạch không có người tham gia nào, hoặc khoản chi phí không có người tham gia nào được chọn.
- Khoản chi phí có số tiền bằng không, âm hoặc có hơn ba chữ số thập phân.
- Tỷ lệ bằng không, âm, bị thiếu, hoặc tổng tất cả tỷ lệ được chọn bằng không.
- Người trả tiền không nằm trong danh sách chia khoản chi phí.
- Người trả tiền hoặc một người tham gia được chọn rời kế hoạch sau khi khoản chi phí đã được tạo.
- Kế hoạch chưa có người tham gia nào khi ứng dụng hỏi "Bạn là ai?"; người dùng có thể tự thêm mình trước hoặc bỏ qua câu hỏi.
- Người tham gia đã chọn trên thiết bị sau đó rời kế hoạch, hoặc dữ liệu trình duyệt bị xóa; ứng dụng hỏi lại "Bạn là ai?".
- Người dùng cố gắng xóa một người tham gia có xuất hiện trong các khoản chi phí trong lịch sử.
- Người dùng chỉnh sửa một khoản chi phí có người tham gia đã rời kế hoạch.
- Hai người cùng vào chỉnh sửa một kế hoạch gần như cùng lúc; chỉ một người giữ được edit lock, người còn lại chỉ xem được kế hoạch.
- Người chỉnh sửa đóng tab hoặc mất kết nối mà không thoát chế độ chỉnh sửa; edit lock được nhả sau thời gian không thao tác.
- Lock của người chỉnh sửa hết hạn trong khi họ còn thay đổi chưa lưu; thao tác lưu bị từ chối kèm thông báo rõ ràng, thay vì ghi đè âm thầm lên thay đổi mới hơn.
- Phần chia hoặc khoản đóng góp cuối cùng được tính ra có phần lẻ của đơn vị tiền tệ và phải tuân theo quy tắc làm tròn cuối cùng.
- Nhiều người cùng chi số tiền cao nhất, hoặc chưa ai chi tiền, khi chọn người nhận phần dư mặc định.
- Kế hoạch được xem mà không có passcode, hoặc người không có quyền chỉnh sửa cố gắng chỉnh sửa/xóa kế hoạch.
- Có người cố tình nhập sai passcode để khóa kế hoạch. Các thiết bị đã có quyền chỉnh sửa vẫn hoạt động bình thường, và email khôi phục có thể mở khóa.
- Việc nhập passcode bị khóa lại ngay sau khi vừa mở khóa; hệ thống không được gửi email không giới hạn (tối đa một email cho mỗi lần khóa).
- Link mở khóa được mở sau khi khóa đã hết hạn hoặc sau khi link đã được dùng.
- Kế hoạch không có email khôi phục và việc nhập passcode bị khóa; khóa kéo dài đủ 12 giờ.
- Mất passcode. Người dùng đổi passcode qua link gửi đến email khôi phục. Không có email khôi phục thì không thể khôi phục passcode.
- Yêu cầu đổi passcode với email không khớp email khôi phục; ứng dụng vẫn hiển thị cùng thông báo và không gửi email.
- Yêu cầu link đổi passcode nhiều lần liên tiếp; hệ thống giới hạn số email được gửi.
- Link đổi passcode được mở sau khi đã hết hạn hoặc đã được dùng.
- Người có quyền chỉnh sửa cố sửa email khôi phục đã được xác nhận; thao tác này không được phép.
- Mã kế hoạch được sinh ra đã tồn tại; hệ thống sinh mã mới.
- Kế hoạch không có tài khoản đạt mốc 30 ngày kể từ lần cập nhật cuối cùng. Quy trình hết hạn phải dựa trên mốc thời gian cập nhật cuối cùng của kế hoạch.
- Người dùng xác nhận thanh toán của một người tham gia nhiều lần; hệ thống phải tránh xác nhận trùng lặp hoặc hiển thị rõ trạng thái xác nhận hiện có.
- Chuyến đi có chi phí nhưng không có đợt đóng góp nào, hoặc tổng các đợt không khớp với số tiền phải đóng. Ứng dụng phải phân biệt các bản ghi đóng góp này với chi phí chuyến đi.
- Người dùng nhập số tiền với dấu thập phân của ngôn ngữ kia (ví dụ: `86,5` khi đang dùng tiếng Anh). Số tiền phải được hiểu đúng hoặc bị từ chối kèm thông báo rõ ràng, không bao giờ bị đọc thành một số tiền khác.
- Hai người mở cùng một link chia sẻ bằng hai ngôn ngữ khác nhau; cả hai thấy cùng dữ liệu, mỗi người theo ngôn ngữ của mình.
- Kế hoạch dùng một theme sau đó bị gỡ khỏi ứng dụng; kế hoạch chuyển về theme mặc định.
- Hình minh họa của theme không tải được hoặc tải chậm khi mạng yếu; kế hoạch vẫn đọc được nhờ màu của theme.
- Ảnh tải lên quá lớn, sai định dạng hoặc tải lên thất bại; người dùng nhận thông báo rõ ràng và ảnh hiện tại được giữ nguyên.
- Kế hoạch có ảnh riêng bị xóa hoặc hết hạn; ảnh cũng bị xóa theo.
- Chuyến đi qua nhiều nơi và nhóm di chuyển vào một ngày; ngày đó hiển thị cả hai nơi ở.
- Có đêm không có nơi ở, ví dụ đi xe qua đêm; ngày đó không hiển thị nơi ở và không báo lỗi.
- Ngày của kế hoạch bị đổi khiến một số nơi ở hoặc món ăn nằm ngoài khoảng ngày mới; người dùng được cảnh báo trước khi lưu và không có gì bị xóa âm thầm.
- Một bữa chưa có món nào; hiển thị trạng thái trống, kèm nút thêm món cho người có quyền chỉnh sửa.
- Cùng một món được thêm vào nhiều ngày hoặc nhiều bữa; điều này được phép.
