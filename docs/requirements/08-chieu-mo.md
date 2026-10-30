# 08 — Chiêu mộ bạn đồng hành

Chủ kế hoạch đăng tin chiêu mộ để tìm thêm người đi cùng. Người khác xem các tin đang mở và gửi yêu cầu xin đi cùng kèm thông tin liên hệ. Chủ kế hoạch tự liên hệ rồi duyệt hoặc từ chối. Ứng dụng không có chat.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [03 Lịch trình](03-lich-trinh-noi-o-mon-an.md) · [04 Trang người dùng và báo cáo](04-goi-y-quan-an.md) · [06 Bảo vệ dữ liệu](06-bao-mat-du-lieu.md) · [Thiết kế](../design/thanh-vien-va-tim-ban-dong-hanh.md) · [Tổng quan](README.md)

## Vị trí trong ứng dụng

- **Màn hình Kế hoạch:** tab **Chiêu mộ**, nằm cạnh Của bạn và Khám phá, liệt kê các tin đang mở.
- **Trong kế hoạch:** chủ kế hoạch mở Chiêu mộ từ màn Người tham gia để đăng và sửa tin, ngừng hoặc chiêu mộ lại, và duyệt yêu cầu.

## Ai được làm gì

| Thao tác | Ai được làm |
|---|---|
| Xem danh sách và chi tiết tin | Mọi người, kể cả chưa đăng nhập |
| Xin đi cùng | Người đã đăng nhập bằng tài khoản đã xác nhận email, chưa là thành viên của kế hoạch |
| Đăng, sửa tin; ngừng và chiêu mộ lại; duyệt, từ chối yêu cầu; chặn người gửi | Chủ kế hoạch |
| Báo cáo tin | Mọi người, có rate limit theo IP |
| Báo cáo người dùng | Người đã đăng nhập |

## Dữ liệu

### Tin chiêu mộ

- `postId`: mã định danh duy nhất của tin.
- `planId`: kế hoạch; mỗi kế hoạch có tối đa một tin.
- `title`: tiêu đề, 1–50 ký tự như [R73](01-ke-hoach-va-quyen-truy-cap.md); mặc định là tên kế hoạch.
- `seatsWanted`: số người cần thêm, từ 1 đến 20.
- `seatsTaken`: số chỗ đã có người được duyệt.
- `costPerPerson`: chi phí dự kiến mỗi người (tùy chọn), theo tiền tệ của kế hoạch.
- `description`: mô tả, tối đa 1.000 ký tự.
- `wishes`: mong muốn về bạn đi cùng (tùy chọn), tối đa 500 ký tự.
- `language`: ngôn ngữ viết tin.
- `status`: đang mở, đã đóng, bị ẩn do báo cáo, hoặc bị admin gỡ.
- `closedReason`: đủ chỗ, chủ kế hoạch ngừng chiêu mộ, đến ngày đi, hoặc tổng kết không còn mở.
- `closedAt`: thời điểm tin đóng gần nhất.
- `createdAt`, `updatedAt`: thời điểm tạo và cập nhật gần nhất.

Điểm đến, ngày đi, ngày về, số người trong nhóm và lịch trình được lấy trực tiếp từ kế hoạch, không sao chép vào tin.

### Yêu cầu xin đi cùng

- `requestId`: mã định danh duy nhất của yêu cầu.
- `postId`: tin được xin.
- `requesterId`: tài khoản gửi.
- `partySize`: số người đi, tính cả người gửi.
- `message`: lời nhắn giới thiệu bản thân, 1–500 ký tự.
- `contacts`: một hoặc nhiều cặp gồm kênh (Zalo, số điện thoại, Facebook, Instagram, email hoặc khác) và giá trị; lưu mã hóa (R91).
- `status`: đang chờ, đã duyệt, đã từ chối, đã rút, hoặc hết hạn.
- `decidedAt`, `createdAt`: thời điểm có kết quả và thời điểm gửi.

### Chặn và báo cáo

- **Chặn:** tài khoản chặn và tài khoản bị chặn.
- **Báo cáo tin:** tin bị báo cáo; lý do (lừa đảo, quảng cáo, sai thông tin, nội dung không phù hợp); người báo cáo (tài khoản, hoặc địa chỉ IP đã hash, [R53](06-bao-mat-du-lieu.md)); thời điểm.
- **Báo cáo người dùng:** tài khoản bị báo cáo; lý do (lừa đảo, quấy rối, giả mạo, nội dung không phù hợp); tài khoản báo cáo; thời điểm.

## Quy tắc

- **R86.** Chủ kế hoạch đăng được một tin chiêu mộ cho kế hoạch khi tổng kết đang mở ([R59](02-nguoi-tham-gia-va-chi-phi.md)) và ngày đi còn ở tương lai.
  - **Nội dung tin:** tiêu đề, số người cần thêm, chi phí dự kiến mỗi người (tùy chọn), mô tả, mong muốn về bạn đi cùng (tùy chọn) và ngôn ngữ.
  - **Lấy từ kế hoạch:** điểm đến, ngày đi, ngày về, số người tham gia đang hoạt động và lịch trình, nên luôn khớp với kế hoạch. Lịch trình chỉ gồm giờ, tên và địa điểm của hoạt động theo từng ngày, không có hoạt động ở Ngày chưa xác định ([R81](03-lich-trinh-noi-o-mon-an.md)).
  - **Không bao giờ có trong tin:** tên người tham gia, các khoản chi, tiền đóng, ghi chú, nơi ở, link chia sẻ hay passcode.
  - Trước khi đăng, chủ kế hoạch xem trước tin, và đồng ý điều khoản sử dụng khi đăng lần đầu ([R35](04-goi-y-quan-an.md)).
  - Chủ kế hoạch sửa tin được bất cứ lúc nào.
  - **Ngừng chiêu mộ:** chủ kế hoạch đóng tin bất cứ lúc nào bằng nút Ngừng chiêu mộ ở màn Chiêu mộ của kế hoạch. Bước xác nhận nêu số yêu cầu đang chờ sẽ hết hạn (R90) và cho biết người đã được duyệt vẫn ở trong kế hoạch. Tin ẩn khỏi tab Chiêu mộ ngay.
  - **Chiêu mộ lại:** tin đã đóng mở lại được với nội dung cũ khi kế hoạch còn đủ điều kiện trên. Yêu cầu đã hết hạn không tự quay lại.
  - Mỗi tài khoản có tối đa 3 tin đang mở.
- **R87.** Màn hình Kế hoạch có tab Chiêu mộ, cạnh Của bạn và Khám phá. Ai cũng xem được danh sách và chi tiết tin mà không cần đăng nhập.
  - Danh sách chỉ gồm tin đang mở, tìm được theo điểm đến (không phân biệt dấu, gần đúng như [R34](04-goi-y-quan-an.md)), lọc được theo khoảng ngày đi, và xếp theo ngày đi gần nhất.
  - Mỗi thẻ hiện tiêu đề, tác giả (tên hiển thị kèm tag, mở được trang người dùng [R83](04-goi-y-quan-an.md)), ngày, số người trong nhóm, số người cần thêm và chi phí dự kiến.
  - **Ngày hiện gọn:** thẻ chỉ ghi khoảng ngày (05–08/12); trang tin ghi thêm số ngày (05–08/12 · 4 ngày); thứ trong tuần chỉ có ở tiêu đề từng ngày của lịch trình. Năm chỉ hiện khi chuyến đi không nằm trong 12 tháng tới. Bộ lọc ngày ghi khoảng đã chọn kèm biểu tượng lịch (Tháng 12), không lặp chữ "Ngày đi".
  - Người đã đăng nhập có bộ lọc Đã gửi, để xem các tin mình đã xin đi cùng và trạng thái từng yêu cầu.
  - Trang tin không được lập chỉ mục ([R46](06-bao-mat-du-lieu.md)), và tìm kiếm bị giới hạn như [R52](06-bao-mat-du-lieu.md).
- **R88.** Người gửi yêu cầu xin đi cùng phải đăng nhập bằng tài khoản đã xác nhận email ([R61](01-ke-hoach-va-quyen-truy-cap.md)), không bị khóa, và chưa là thành viên của kế hoạch. Mỗi tài khoản gửi được một yêu cầu cho mỗi tin; yêu cầu hết hạn vì tin đóng thì gửi lại được khi tin mở lại.
  - Yêu cầu gồm lời nhắn giới thiệu bản thân, số người đi (tính cả người gửi, không vượt số chỗ còn trống) và ít nhất một thông tin liên hệ: người gửi chọn kênh rồi nhập giá trị.
  - Người gửi phải xác nhận cho chủ kế hoạch xem thông tin liên hệ.
  - Người gửi rút được yêu cầu khi còn đang chờ.
  - Mỗi tài khoản gửi tối đa 10 yêu cầu mỗi ngày.
- **R89.** Chỉ chủ kế hoạch xem và xử lý yêu cầu, trong màn Chiêu mộ của kế hoạch (mở từ màn Người tham gia).
  - Mỗi yêu cầu hiện tên hiển thị kèm tag (mở được trang người dùng), số người, lời nhắn và thông tin liên hệ.
  - Ứng dụng không có chat: chủ kế hoạch tự liên hệ người gửi bằng thông tin họ để lại.
  - **Duyệt:** chủ kế hoạch chọn quyền Xem (mặc định) hoặc Sửa. Người gửi trở thành thành viên ([R84](01-ke-hoach-va-quyen-truy-cap.md)), gắn với một người tham gia mới mang tên hiển thị của họ; người đi cùng không có tài khoản thì chủ kế hoạch tự thêm. Trước khi duyệt, ứng dụng nhắc rằng thành viên mới sẽ thấy người tham gia và chi phí của kế hoạch. Không duyệt được yêu cầu có số người lớn hơn số chỗ còn trống, và chỉ duyệt được khi tổng kết đang mở.
  - **Từ chối:** không cần lý do, và người gửi không gửi lại được cho tin đó.
  - Thẻ kế hoạch trong danh sách của chủ kế hoạch hiện số yêu cầu đang chờ ([R62](01-ke-hoach-va-quyen-truy-cap.md)).
- **R90.** Tin tự đóng khi đủ chỗ, khi đến ngày đi, khi tổng kết không còn mở, hoặc khi kế hoạch bị xóa; chủ kế hoạch cũng ngừng chiêu mộ được (R86). Khi tin đóng, các yêu cầu đang chờ hết hạn.
  - **Email cho chủ kế hoạch:** khi có yêu cầu mới, gộp tối đa một email mỗi giờ.
  - **Email cho người gửi:** khi yêu cầu được duyệt, bị từ chối hoặc hết hạn.
  - Người dùng tắt được các email này trong tài khoản.
  - Trong ứng dụng, trạng thái hiện ở hai nơi: số yêu cầu đang chờ trên thẻ kế hoạch (R89), và trạng thái yêu cầu ở bộ lọc Đã gửi (R87).
- **R91.** Thông tin liên hệ trong yêu cầu chỉ được gửi cho chủ kế hoạch, không cho admin, thành viên khác hay ai khác ([R48](06-bao-mat-du-lieu.md)).
  - Thông tin được mã hóa khi lưu, và mỗi lần chủ kế hoạch xem đều được ghi lại.
  - Thông tin bị xóa 30 ngày sau khi yêu cầu được duyệt, bị từ chối, rút lại hoặc hết hạn.
  - Thông tin hiện dưới dạng chữ để sao chép, không thành link bấm được.
  - Thông tin không bao giờ có trong hành trình, ảnh xuất, thẻ preview hay trang người dùng.
- **R92.** Báo cáo, chặn và nhắc an toàn:
  - **Báo cáo tin:** ai cũng báo cáo được, với lý do lừa đảo, quảng cáo, sai thông tin hoặc nội dung không phù hợp. Tin bị 3 người khác nhau báo cáo bị ẩn cho đến khi admin xem xét, như [R43](04-goi-y-quan-an.md).
  - **Báo cáo người dùng:** người đã đăng nhập báo cáo được, từ trang người dùng hoặc từ yêu cầu xin đi cùng, với lý do lừa đảo, quấy rối, giả mạo hoặc nội dung không phù hợp. Báo cáo người dùng vào hàng chờ của admin.
  - **Kiểm duyệt:** kiểm duyệt của admin, khóa tài khoản và bộ lọc từ ngữ thô tục áp dụng như với danh sách gợi ý ([R44](04-goi-y-quan-an.md), [R45](04-goi-y-quan-an.md)). Trang admin có thêm hai loại Chiêu mộ và Người dùng.
  - **Tài khoản bị khóa:** tin của tài khoản đó bị ẩn, và yêu cầu của họ không còn hiện cho chủ kế hoạch.
  - **Chặn:** chủ kế hoạch chặn được người gửi yêu cầu. Tài khoản bị chặn không thấy các tin của người chặn và không gửi được yêu cầu.
  - **Nhắc an toàn:** trang tin và màn xin đi cùng nhắc gặp nhau ở nơi công cộng và không chuyển cọc cho người lạ. Ứng dụng không xác minh danh tính ngoài email.

## Acceptance Criteria

- Chủ kế hoạch đăng được tin chiêu mộ khi tổng kết đang mở và ngày đi còn ở tương lai.
- Tin hiện điểm đến, ngày, số người trong nhóm, số chỗ còn trống, chi phí dự kiến (nếu có), mô tả và lịch trình theo ngày. Tin không hiện tên người tham gia, các khoản chi, ghi chú hay link kế hoạch.
- Tab Chiêu mộ liệt kê các tin đang mở, tìm được theo điểm đến không dấu, lọc được theo ngày đi, xếp theo ngày đi gần nhất. Ai cũng xem được.
- Người đã đăng nhập gửi được yêu cầu xin đi cùng, gồm lời nhắn, số người và ít nhất một thông tin liên hệ. Mỗi tin một yêu cầu; rút được khi đang chờ; xem được trạng thái ở bộ lọc Đã gửi.
- Chủ kế hoạch thấy các yêu cầu đang chờ, kèm thông tin liên hệ.
- Chủ kế hoạch duyệt (chọn quyền Xem hoặc Sửa) hoặc từ chối. Người được duyệt trở thành thành viên và người tham gia. Hết chỗ thì tin tự đóng.
- Chủ kế hoạch ngừng chiêu mộ sau một bước xác nhận: tin ẩn khỏi tab Chiêu mộ ngay và yêu cầu đang chờ hết hạn. Chủ kế hoạch chiêu mộ lại được khi kế hoạch còn đủ điều kiện.
- Thông tin liên hệ chỉ chủ kế hoạch thấy, và bị xóa 30 ngày sau khi yêu cầu có kết quả.
- Chủ kế hoạch nhận email khi có yêu cầu mới; người gửi nhận email khi được duyệt, bị từ chối hoặc yêu cầu hết hạn.
- Báo cáo tin, báo cáo người dùng và chặn người gửi hoạt động như quy tắc.

## Edge Cases

- Đổi ngày đi của kế hoạch khi tin đang mở: tin hiện ngày mới. Nếu ngày đi mới đã qua thì tin đóng.
- Chủ kế hoạch tạm khóa tổng kết: tin đóng, yêu cầu đang chờ hết hạn. Mở khóa lại thì chủ kế hoạch chiêu mộ lại được.
- Mở link tin đã đóng: trang chỉ hiện tiêu đề và dòng "Tin đã ngừng chiêu mộ", không có lịch trình hay nút Xin đi cùng.
- Yêu cầu có số người lớn hơn số chỗ còn trống: nút Duyệt bị tắt, kèm lý do. Chủ kế hoạch tăng số chỗ hoặc từ chối.
- Người đã là thành viên mở tin của kế hoạch đó: thay cho nút Xin đi cùng là dòng "Bạn đã ở trong nhóm".
- Chủ kế hoạch mở tin của mình trong tab Chiêu mộ: thay cho nút Xin đi cùng là nút quản lý tin.
- Người bị từ chối mở lại tin: nút Xin đi cùng bị tắt, ghi "Yêu cầu đã bị từ chối".
- Tài khoản bị chặn tìm tin hoặc mở link tin của người chặn: hiện "Không tìm thấy tin".
- Kế hoạch bị xóa khi còn yêu cầu đang chờ: tin bị xóa, người gửi nhận email báo yêu cầu hết hạn.
- Người được duyệt rời kế hoạch: chỗ của họ không tự mở lại; chủ kế hoạch tăng số chỗ nếu muốn.
- Người gửi rút yêu cầu sau khi chủ kế hoạch đã chép thông tin liên hệ: ứng dụng không thu hồi được bản đã chép; thông tin vẫn bị xóa khỏi ứng dụng theo R91.
- Thông tin liên hệ chứa link: hiện dạng chữ, không bấm được.
