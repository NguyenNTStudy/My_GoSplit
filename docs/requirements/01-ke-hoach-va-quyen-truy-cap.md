# 01 — Kế hoạch và quyền truy cập

Tạo và quản lý kế hoạch, link chia sẻ, passcode chỉnh sửa, email khôi phục, edit lock, xóa và hết hạn kế hoạch.

Liên quan: [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) · [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) · [Tổng quan](README.md)

## Dữ liệu

### Kế hoạch chuyến đi

- `planId`: mã định danh duy nhất của kế hoạch; là chuỗi 10 chữ số được sinh ngẫu nhiên (ví dụ: `0041234567`). Lưu dạng chuỗi để giữ số 0 ở đầu và có thể tăng độ dài sau này.
- `shareKey`: khóa ngẫu nhiên dài, cùng với `planId` tạo thành link chia sẻ của kế hoạch (R3); người có quyền chỉnh sửa có thể đổi khóa.
- `name`: tên kế hoạch.
- `location`: điểm đến của chuyến đi; nếu đi qua nhiều nơi thì ghi ngắn gọn, ví dụ `Đà Lạt – Nha Trang`.
- `startDate`: ngày bắt đầu chuyến đi.
- `endDate`: ngày kết thúc chuyến đi.
- `notes`: ghi chú kế hoạch (tùy chọn).
- `currencyUnit`: đơn vị tiền tệ của kế hoạch; hiện luôn là `$` ([R1](02-nguoi-tham-gia-va-chi-phi.md)), giữ lại để sau này có thể cho chọn đơn vị.
- `theme`: theme của kế hoạch, chọn khi tạo kế hoạch; mặc định là Gạo ấm.
- `coverImage`: ảnh riêng (tùy chọn) được tải lên để thay hình minh họa của theme, kèm vùng ảnh được chọn để hiển thị; ai xem được kế hoạch đều thấy, nhưng ảnh chỉ được tải qua link của kế hoạch ([R57](02-nguoi-tham-gia-va-chi-phi.md)).
- `createdAt`: ngày giờ tạo.
- `updatedAt`: ngày giờ cập nhật gần nhất; dùng để tính thời hạn 30 ngày của các kế hoạch không có tài khoản.
- `summaryStatus`: trạng thái tổng kết: đang mở, tạm khóa hoặc đã chốt ([R59](02-nguoi-tham-gia-va-chi-phi.md)).
- `summaryStatusChangedAt`: thời điểm tạm khóa hoặc chốt gần nhất; hiển thị trong tổng kết.
- `ownerType`: kế hoạch thuộc sở hữu tài khoản hoặc kế hoạch không có tài khoản.
- `ownerId`: mã định danh chủ tài khoản khi kế hoạch thuộc sở hữu tài khoản.
- `ownerParticipantId`: người tham gia được tạo tự động cho chủ tài khoản khi tạo kế hoạch thuộc sở hữu tài khoản.
- `editPasscode`: passcode 6 chữ số dùng để chỉnh sửa, do người dùng tự đặt khi tạo kế hoạch. Được lưu như thông tin xác thực được bảo vệ và không được để lộ cho người xem.
- `recoveryEmail`: email khôi phục (tùy chọn), dùng để mở khóa việc nhập passcode và yêu cầu đổi passcode. Với kế hoạch thuộc sở hữu tài khoản thì dùng email của tài khoản. Không được để lộ cho người xem.
- `passcodeLock`: số lần nhập sai passcode liên tiếp và thời điểm hết khóa nhập passcode.
- `editLock`: người đang giữ edit lock của kế hoạch và thời điểm lock hết hạn.

### Tài khoản

Tài khoản do hệ thống đăng nhập quản lý. Ngoài thông tin đăng nhập, ứng dụng lưu:

- `language`: ngôn ngữ đã chọn ([R28](05-ngon-ngu-va-theme.md)).
- `username`: biệt danh, hiển thị là tác giả của các danh sách gợi ý của tài khoản; chọn trước khi đăng danh sách gợi ý đầu tiên; không cần là duy nhất ([R35](04-goi-y-quan-an.md)).
- `userTag`: mã ngắn do ứng dụng cấp cho tài khoản, hiển thị thành huy hiệu sau username ([R37](04-goi-y-quan-an.md)); username và tag kết hợp lại là duy nhất.
- `isAdmin`: tài khoản có phải admin hay không ([R44](04-goi-y-quan-an.md)).
- `isBlocked`: tài khoản có bị admin khóa hay không ([R44](04-goi-y-quan-an.md)).

## Quy tắc

- **R2.** Không thể lưu kế hoạch nếu ngày kết thúc sớm hơn ngày bắt đầu. Người dùng có thể chỉnh sửa ngày, nhưng khoảng thời gian không hợp lệ phải được sửa trước khi lưu.
- **R3.** Có thể xem kế hoạch qua đường link chia sẻ mà không cần xác thực hay passcode. Link chứa `planId` và một khóa chia sẻ ngẫu nhiên dài; cần cả hai mới mở được kế hoạch, nên không thể mở kế hoạch bằng cách đoán hoặc chỉ gõ `planId`. Sai mã hay sai khóa đều nhận cùng một thông báo "Không tìm thấy kế hoạch". Chủ tài khoản cũng mở được kế hoạch từ danh sách kế hoạch của mình. Người có quyền chỉnh sửa có thể đổi khóa chia sẻ; link cũ khi đó không dùng được nữa, thiết bị đang có quyền chỉnh sửa và chủ tài khoản được chuyển sang link mới, còn những người khác cần nhận link mới.
- **R4.** `planId` là số 10 chữ số được sinh ngẫu nhiên, không sinh tuần tự. Nếu mã sinh ra đã tồn tại thì sinh mã mới.
- **R5.** Mỗi kế hoạch có một passcode chỉnh sửa gồm 6 chữ số, do người dùng tự đặt khi tạo kế hoạch. Ai có passcode hợp lệ cũng chỉnh sửa được kế hoạch. Không cần passcode để xem.
- **R6.** Nếu passcode được chọn quá dễ đoán (ví dụ: `123456`, `000000` hoặc `111111`), ứng dụng hiển thị cảnh báo nhưng vẫn chấp nhận.
- **R7.** Với kế hoạch thuộc sở hữu tài khoản, chủ tài khoản chỉnh sửa được mà không cần nhập passcode và là người duy nhất được xóa kế hoạch. Với kế hoạch không có tài khoản, ai có passcode cũng xóa được.
- **R8.** Tại một thời điểm chỉ một người được chỉnh sửa kế hoạch. Người đầu tiên vào chế độ chỉnh sửa sẽ giữ edit lock của kế hoạch; những người khác chỉ xem được kế hoạch, kèm thông báo đang có người chỉnh sửa. Lock được nhả khi người chỉnh sửa thoát chế độ chỉnh sửa hoặc sau 5 phút không thao tác. Thao tác lưu sau khi lock của người chỉnh sửa đã hết hạn sẽ bị từ chối, thay vì ghi đè âm thầm lên thay đổi khác.
- **R9.** Sau 5 lần nhập sai passcode liên tiếp, việc nhập passcode của kế hoạch bị khóa 12 giờ. Mỗi lần khóa, hệ thống gửi một email kèm link mở khóa đến email khôi phục của kế hoạch; mở link thì khóa được gỡ ngay. Nếu không có email khôi phục, khóa kéo dài đủ 12 giờ. Các thiết bị đã có quyền chỉnh sửa từ trước không bị ảnh hưởng.
- **R10.** Khi tạo kế hoạch không có tài khoản, người dùng có thể nhập email khôi phục. Nếu kế hoạch chưa có email khôi phục, người có quyền chỉnh sửa có thể thêm sau; khi email đã được xác nhận thì không thể sửa nữa. Email này phải được xác nhận qua link gửi đến nó trước khi dùng để mở khóa hoặc đổi passcode. Với kế hoạch thuộc sở hữu tài khoản thì dùng email của tài khoản.
- **R11.** Để đổi passcode, người dùng nhập email khôi phục của kế hoạch. Nếu email khớp với email khôi phục đã xác nhận (hoặc email tài khoản với kế hoạch thuộc sở hữu tài khoản), hệ thống gửi một link đổi passcode chỉ dùng được một lần và có hiệu lực trong 1 giờ; mở link thì người dùng đặt được passcode mới. Ứng dụng hiển thị cùng một thông báo dù email có khớp hay không, để không làm lộ email khôi phục. Kế hoạch không có email khôi phục thì không thể đổi hay khôi phục passcode. Sau khi đổi, các thiết bị dùng passcode cũ mất quyền chỉnh sửa, và khóa nhập passcode (R9, nếu có) được gỡ.
- **R22.** Xóa kế hoạch cần xác nhận vì thao tác này sẽ xóa kế hoạch cùng với lịch trình, người tham gia và các khoản chi phí liên quan.
- **R24.** Các kế hoạch được tạo mà không có tài khoản sẽ hết hạn và bị xóa sau 30 ngày kể từ lần cập nhật cuối cùng.
- **R60.** Các danh sách có ngày giờ hiển thị từ trên xuống dưới theo thời gian tăng dần, từ quá khứ đến tương lai: danh sách kế hoạch theo ngày bắt đầu, hoạt động trong lịch trình theo ngày giờ dự kiến, nơi ở theo ngày nhận phòng, và khoản chi phí theo ngày giờ phát sinh. Kế hoạch chỉ có ngày, chọn bằng bộ chọn ngày; ngày giờ dự kiến của hoạt động và ngày giờ của khoản chi phí được chọn bằng bộ chọn ngày giờ. Hai mục cùng ngày giờ thì mục được tạo trước hiển thị trước; riêng hoạt động cùng giờ thì theo thứ tự người dùng sắp xếp. Lịch trình và danh sách khoản chi phí có bộ chọn xem "Tất cả" hoặc từng ngày của chuyến đi, mặc định là "Tất cả"; danh sách món ăn có bộ lọc riêng theo ngày và buổi ([R33](03-lich-trinh-noi-o-mon-an.md)). Khoản chi phí có ngày nằm ngoài khoảng ngày của kế hoạch chỉ hiện ở "Tất cả", và vẫn được tính vào tổng kết.

## Acceptance Criteria

- Người dùng có thể tạo, liệt kê, xem, chỉnh sửa và xóa kế hoạch.
- Kế hoạch lưu tên, địa điểm, ngày bắt đầu/kết thúc, ghi chú, đơn vị tiền tệ (hiện là `$`) và các mốc thời gian.
- Kế hoạch mới được cấp một mã kế hoạch ngẫu nhiên gồm 10 chữ số.
- Không thể lưu kế hoạch có ngày kết thúc trước ngày bắt đầu; người dùng nhận được thông báo kiểm tra hợp lệ rõ ràng.
- Người xem có thể mở kế hoạch được chia sẻ mà không cần đăng nhập hay nhập passcode.
- Không mở được kế hoạch nếu chỉ có `planId` hoặc sai khóa chia sẻ; cả hai trường hợp nhận cùng thông báo "Không tìm thấy kế hoạch".
- Người có quyền chỉnh sửa có thể đổi link chia sẻ; link cũ không dùng được nữa.
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
- Danh sách kế hoạch, lịch trình, nơi ở và khoản chi phí hiển thị từ trên xuống dưới theo thời gian tăng dần, từ quá khứ đến tương lai.
- Lịch trình và danh sách khoản chi phí xem được theo "Tất cả" hoặc theo từng ngày của chuyến đi.

## Edge Cases

- Ngày bắt đầu và ngày kết thúc của kế hoạch trùng nhau.
- Ngày kết thúc sớm hơn ngày bắt đầu trong khi chỉnh sửa.
- Hai người cùng vào chỉnh sửa một kế hoạch gần như cùng lúc; chỉ một người giữ được edit lock, người còn lại chỉ xem được kế hoạch.
- Người chỉnh sửa đóng tab hoặc mất kết nối mà không thoát chế độ chỉnh sửa; edit lock được nhả sau thời gian không thao tác.
- Lock của người chỉnh sửa hết hạn trong khi họ còn thay đổi chưa lưu; thao tác lưu bị từ chối kèm thông báo rõ ràng, thay vì ghi đè âm thầm lên thay đổi mới hơn.
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
- Có người chỉ gõ `planId` 10 chữ số, hoặc mở link sai khóa; kế hoạch không mở được, và thông báo không cho biết kế hoạch có tồn tại hay không.
- Khóa chia sẻ bị đổi; người có link cũ không mở được kế hoạch nữa, còn thiết bị đang có quyền chỉnh sửa và chủ tài khoản được chuyển sang link mới.
- Kế hoạch không có tài khoản đạt mốc 30 ngày kể từ lần cập nhật cuối cùng. Quy trình hết hạn phải dựa trên mốc thời gian cập nhật cuối cùng của kế hoạch.
- Hai khoản chi phí có cùng ngày giờ; khoản được tạo trước hiển thị trước.
- Sửa ngày giờ của một khoản chi phí, một hoạt động, hoặc ngày bắt đầu của kế hoạch; mục đó chuyển sang đúng vị trí mới trong danh sách.
- Khoản chi phí có ngày trước hoặc sau chuyến đi, ví dụ đặt phòng từ trước; khoản đó chỉ hiện khi chọn "Tất cả" và vẫn được tính vào tổng kết.
- Chọn xem một ngày không có hoạt động hay khoản chi phí nào; hiển thị trạng thái trống.
