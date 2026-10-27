# 01 — Kế hoạch và quyền truy cập

Đăng nhập của người tạo kế hoạch; tạo và quản lý kế hoạch, link chia sẻ, passcode chỉnh sửa, edit lock và xóa kế hoạch.

Liên quan: [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) · [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) · [Tổng quan](README.md)

## Dữ liệu

### Kế hoạch chuyến đi

- `planId`: mã định danh duy nhất của kế hoạch; là chuỗi 10 chữ số được sinh ngẫu nhiên (ví dụ: `0041234567`). Lưu dạng chuỗi để giữ số 0 ở đầu và có thể tăng độ dài sau này.
- `shareKey`: khóa ngẫu nhiên dài, cùng với `planId` tạo thành link chia sẻ của kế hoạch (R3); người có quyền chỉnh sửa có thể đổi khóa.
- `name`: tên kế hoạch, từ 1 đến 50 ký tự (R73).
- `location`: điểm đến của chuyến đi; nếu đi qua nhiều nơi thì ghi ngắn gọn, ví dụ `Đà Lạt – Nha Trang`.
- `startDate`: ngày bắt đầu chuyến đi.
- `endDate`: ngày kết thúc chuyến đi.
- `notes`: ghi chú kế hoạch (tùy chọn).
- `currency`: mã tiền tệ của kế hoạch theo ISO 4217, ví dụ `VND`, `USD`; chọn khi tạo kế hoạch ([R1](02-nguoi-tham-gia-va-chi-phi.md), [R70](02-nguoi-tham-gia-va-chi-phi.md)), đổi được khi chưa có khoản chi phí ([R72](02-nguoi-tham-gia-va-chi-phi.md)).
- `theme`: theme của kế hoạch, chọn khi tạo kế hoạch; mặc định là Gạo ấm.
- `coverImage`: ảnh riêng (tùy chọn) được tải lên để thay hình minh họa của theme, kèm vùng ảnh được chọn để hiển thị; ai xem được kế hoạch đều thấy, nhưng ảnh chỉ được tải qua link của kế hoạch ([R57](02-nguoi-tham-gia-va-chi-phi.md)).
- `createdAt`: ngày giờ tạo.
- `updatedAt`: ngày giờ cập nhật gần nhất.
- `summaryStatus`: trạng thái tổng kết: đang mở, tạm khóa hoặc đã chốt ([R59](02-nguoi-tham-gia-va-chi-phi.md)).
- `summaryStatusChangedAt`: thời điểm tạm khóa hoặc chốt gần nhất; hiển thị trong tổng kết.
- `ownerId`: tài khoản của chủ kế hoạch, tức người tạo kế hoạch; bắt buộc (R61).
- `ownerParticipantId`: người tham gia được tạo tự động cho chủ kế hoạch khi tạo kế hoạch ([R26](02-nguoi-tham-gia-va-chi-phi.md)).
- `collectorParticipantId`: người thu tiền của kế hoạch, giữ tiền đóng và nhận số còn thiếu của mọi người; mặc định là người tham gia đại diện chủ kế hoạch ([R54](02-nguoi-tham-gia-va-chi-phi.md)).
- `editPasscode`: passcode 6 chữ số dùng để chỉnh sửa, do người dùng tự đặt khi tạo kế hoạch. Được lưu như thông tin xác thực được bảo vệ và không được để lộ cho người xem.
- `passcodeLock`: số lần nhập sai passcode liên tiếp và thời điểm hết khóa nhập passcode.
- `editLock`: người đang giữ edit lock của kế hoạch và thời điểm lock hết hạn.

### Tài khoản

Tài khoản do hệ thống đăng nhập quản lý: đăng nhập bằng Google, hoặc bằng email hay username kèm mật khẩu (R61, R78). Ngoài thông tin đăng nhập, ứng dụng lưu:

- `language`: ngôn ngữ đã chọn ([R28](05-ngon-ngu-va-theme.md)).
- `displayName`: tên hiển thị, là tên tác giả của danh sách gợi ý và hành trình; không cần là duy nhất (R78).
- `username`: tên đăng nhập, là duy nhất; chỉ dùng để đăng nhập, không hiển thị cho người khác (R78).
- `userTag`: mã ngắn do ứng dụng cấp cho tài khoản, hiển thị thành huy hiệu sau tên hiển thị ([R37](04-goi-y-quan-an.md)); là duy nhất.
- `isAdmin`: tài khoản có phải admin hay không ([R44](04-goi-y-quan-an.md)).
- `isBlocked`: tài khoản có bị admin khóa hay không ([R44](04-goi-y-quan-an.md)).

## Quy tắc

- **R2.** Không thể lưu kế hoạch nếu ngày kết thúc sớm hơn ngày bắt đầu. Người dùng có thể chỉnh sửa ngày, nhưng khoảng thời gian không hợp lệ phải được sửa trước khi lưu.
- **R3.** Có thể xem kế hoạch qua đường link chia sẻ mà không cần xác thực hay passcode. Link chứa `planId` và một khóa chia sẻ ngẫu nhiên dài; cần cả hai mới mở được kế hoạch, nên không thể mở kế hoạch bằng cách đoán hoặc chỉ gõ `planId`. Sai mã hay sai khóa đều nhận cùng một thông báo "Không tìm thấy kế hoạch". Chủ kế hoạch cũng mở được kế hoạch từ danh sách kế hoạch của mình. Người có quyền chỉnh sửa có thể đổi khóa chia sẻ; link cũ khi đó không dùng được nữa, thiết bị đang có quyền chỉnh sửa và chủ kế hoạch được chuyển sang link mới, còn những người khác cần nhận link mới.
- **R4.** `planId` là số 10 chữ số được sinh ngẫu nhiên, không sinh tuần tự. Nếu mã sinh ra đã tồn tại thì sinh mã mới.
- **R5.** Mỗi kế hoạch có một passcode chỉnh sửa gồm 6 chữ số, do người dùng tự đặt khi tạo kế hoạch. Ai có passcode hợp lệ cũng chỉnh sửa được kế hoạch. Không cần passcode để xem.
- **R6.** Nếu passcode được chọn quá dễ đoán (ví dụ: `123456`, `000000` hoặc `111111`), ứng dụng hiển thị cảnh báo nhưng vẫn chấp nhận.
- **R7.** Chủ kế hoạch chỉnh sửa được mà không cần nhập passcode và là người duy nhất được xóa kế hoạch. Người chỉnh sửa bằng passcode không xóa được kế hoạch.
- **R8.** Tại một thời điểm chỉ một người được chỉnh sửa kế hoạch. Người đầu tiên vào chế độ chỉnh sửa sẽ giữ edit lock của kế hoạch; những người khác chỉ xem được kế hoạch, kèm thông báo đang có người chỉnh sửa. Lock được nhả khi người chỉnh sửa thoát chế độ chỉnh sửa hoặc sau 5 phút không thao tác. Thao tác lưu sau khi lock của người chỉnh sửa đã hết hạn sẽ bị từ chối, thay vì ghi đè âm thầm lên thay đổi khác.
- **R9.** Sau 5 lần nhập sai passcode liên tiếp, việc nhập passcode của kế hoạch bị khóa 12 giờ. Mỗi lần khóa, hệ thống gửi một email kèm link mở khóa đến email tài khoản của chủ kế hoạch; mở link thì khóa được gỡ ngay. Các thiết bị đã có quyền chỉnh sửa từ trước không bị ảnh hưởng, và chủ kế hoạch vẫn chỉnh sửa được vì không cần passcode.
- **R10.** Kế hoạch không có email khôi phục riêng. Email nhận link mở khóa (R9) là email tài khoản của chủ kế hoạch, và không bao giờ hiển thị cho người xem hay người chỉnh sửa bằng passcode.
- **R11.** Chỉ chủ kế hoạch được đổi passcode, ngay trong phần cài đặt của kế hoạch khi đã đăng nhập, không cần link qua email. Passcode được lưu dạng mã hóa nên không xem lại được; người chỉnh sửa quên passcode thì hỏi chủ kế hoạch, và chủ kế hoạch đặt passcode mới nếu cần. Sau khi đổi, các thiết bị dùng passcode cũ mất quyền chỉnh sửa, và khóa nhập passcode (R9, nếu có) được gỡ.
- **R22.** Xóa kế hoạch cần xác nhận vì thao tác này sẽ xóa kế hoạch cùng với lịch trình, người tham gia và các khoản chi phí liên quan.
- **R24.** Kế hoạch không tự hết hạn; kế hoạch chỉ bị xóa khi chủ kế hoạch xóa (R22).
- **R60.** Các danh sách có ngày giờ hiển thị từ trên xuống dưới theo thời gian tăng dần, từ quá khứ đến tương lai: danh sách kế hoạch theo ngày bắt đầu (riêng mục Đã tổng kết xếp chuyến mới nhất lên trước, R62), hoạt động trong lịch trình theo ngày giờ dự kiến, nơi ở theo ngày nhận phòng, và khoản chi phí theo ngày giờ phát sinh. Kế hoạch chỉ có ngày, chọn bằng bộ chọn ngày; ngày giờ dự kiến của hoạt động và ngày giờ của khoản chi phí được chọn bằng bộ chọn ngày giờ. Hai mục cùng ngày giờ thì mục được tạo trước hiển thị trước; riêng hoạt động cùng giờ thì theo thứ tự người dùng sắp xếp. Lịch trình và danh sách khoản chi phí có bộ chọn xem "Tất cả" hoặc từng ngày của chuyến đi, mặc định là "Tất cả"; danh sách món ăn không gắn với ngày và lọc theo buổi ([R33](03-lich-trinh-noi-o-mon-an.md)). Khoản chi phí có ngày nằm ngoài khoảng ngày của kế hoạch chỉ hiện ở "Tất cả", và vẫn được tính vào tổng kết.
- **R61.** Người tạo kế hoạch phải đăng nhập, bằng một trong hai cách: đăng nhập bằng tài khoản Google, hoặc đăng ký tài khoản của ứng dụng; tài khoản có tên hiển thị và username (R78). Tài khoản đăng ký bằng email phải xác nhận email qua link trước khi tạo kế hoạch; quên mật khẩu thì đặt lại qua link gửi đến email đó. Nếu cùng một email dùng cả hai cách, hai cách đăng nhập dùng chung một tài khoản. Người xem kế hoạch qua link và người chỉnh sửa bằng passcode không cần đăng nhập.
- **R62.** Danh sách kế hoạch của chủ kế hoạch chia thành hai mục, theo trạng thái tổng kết ([R59](02-nguoi-tham-gia-va-chi-phi.md)): **Sắp diễn ra** gồm các kế hoạch có tổng kết đang mở hoặc tạm khóa, xếp theo ngày bắt đầu tăng dần (R60); **Đã tổng kết** gồm các kế hoạch có tổng kết đã chốt, xếp theo ngày bắt đầu giảm dần, chuyến mới nhất lên trước. Mục Sắp diễn ra hiển thị trước. Kế hoạch chỉ kết thúc khi tổng kết đã chốt: kế hoạch chuyển sang mục Đã tổng kết ngay khi chốt, còn chuyến đi đã qua ngày kết thúc mà chưa chốt vẫn ở mục Sắp diễn ra, kèm nhãn "Chưa chốt tổng kết". Mục không có kế hoạch nào thì hiển thị một dòng thông báo ngắn.
- **R73.** Tên kế hoạch dài từ 1 đến 50 ký tự, tính sau khi bỏ khoảng trắng ở đầu và cuối. Ký tự được đếm sau khi chuẩn hóa Unicode (NFC), để một chữ có dấu như `ệ` luôn tính là một ký tự, dù gõ bằng bộ gõ nào. Ô nhập hiện số ký tự còn lại khi gần đến giới hạn, và không tự cắt bớt tên dán vào. Trên thẻ ở danh sách kế hoạch, tên hiện tối đa 2 dòng, dài hơn thì cắt bằng dấu `…`; màn chi tiết kế hoạch hiện tên đầy đủ. Tiêu đề hành trình có cùng giới hạn ([R64](07-chia-se-hanh-trinh.md)).
- **R78.** Tài khoản có tên hiển thị và username. Tên hiển thị dài 1–40 ký tự, không cần là duy nhất và đổi được bất cứ lúc nào; đây là tên tác giả của danh sách gợi ý và hành trình, kèm huy hiệu tag ([R37](04-goi-y-quan-an.md)), và là tên của người tham gia đại diện chủ kế hoạch khi tạo kế hoạch ([R26](02-nguoi-tham-gia-va-chi-phi.md)). Username dài 3–20 ký tự, gồm chữ thường không dấu, số, dấu chấm và gạch dưới; là duy nhất, không phân biệt hoa thường, và chỉ dùng để đăng nhập: không bao giờ hiển thị cho người khác. Username đổi được trong tài khoản nếu username mới chưa có ai dùng. Khi đăng ký, người dùng nhập tên hiển thị, username, email và mật khẩu; ô username báo ngay khi đã có người dùng. Lần đầu đăng nhập bằng Google, người dùng chọn username, còn tên hiển thị được điền sẵn theo tài khoản Google. Đăng nhập bằng email hoặc username kèm mật khẩu; sai thông tin nào cũng nhận cùng một thông báo, để không lộ email hay username nào đang có tài khoản. Quên mật khẩu thì nhập email hoặc username; link đặt lại luôn được gửi đến email của tài khoản.

## Acceptance Criteria

- Người dùng có thể tạo, liệt kê, xem, chỉnh sửa và xóa kế hoạch.
- Tên kế hoạch rỗng hoặc dài hơn 50 ký tự không lưu được; trên thẻ ở danh sách kế hoạch, tên dài hiện tối đa 2 dòng.
- Kế hoạch lưu tên, địa điểm, ngày bắt đầu/kết thúc, ghi chú, tiền tệ và các mốc thời gian.
- Kế hoạch mới được cấp một mã kế hoạch ngẫu nhiên gồm 10 chữ số.
- Không thể lưu kế hoạch có ngày kết thúc trước ngày bắt đầu; người dùng nhận được thông báo kiểm tra hợp lệ rõ ràng.
- Người xem có thể mở kế hoạch được chia sẻ mà không cần đăng nhập hay nhập passcode.
- Không mở được kế hoạch nếu chỉ có `planId` hoặc sai khóa chia sẻ; cả hai trường hợp nhận cùng thông báo "Không tìm thấy kế hoạch".
- Người có quyền chỉnh sửa có thể đổi link chia sẻ; link cũ không dùng được nữa.
- Người dùng không có passcode đúng thì không thể chỉnh sửa kế hoạch, trừ khi là chủ kế hoạch.
- Passcode hợp lệ cho phép chỉnh sửa kế hoạch nhưng không cho xóa kế hoạch.
- Chỉ chủ kế hoạch mới xóa được kế hoạch.
- Passcode dễ đoán vẫn được chấp nhận, kèm cảnh báo.
- Sau 5 lần nhập sai passcode liên tiếp, việc nhập passcode bị khóa 12 giờ và một email mở khóa được gửi đến email tài khoản của chủ kế hoạch; link mở khóa gỡ khóa ngay lập tức.
- Passcode và email tài khoản của chủ kế hoạch không bao giờ hiển thị cho người xem.
- Chủ kế hoạch có thể đổi passcode trong phần cài đặt kế hoạch. Sau khi đổi, các thiết bị dùng passcode cũ mất quyền chỉnh sửa.
- Khi một người đang chỉnh sửa kế hoạch, những người khác chỉ xem được, kèm thông báo đang có người chỉnh sửa.
- Edit lock được nhả khi người chỉnh sửa thoát chế độ chỉnh sửa hoặc sau 5 phút không thao tác.
- Chủ kế hoạch có thể mở kế hoạch của mình từ nhiều thiết bị.
- Các thay đổi thực hiện trên một thiết bị sẽ có trên các thiết bị khác.
- Xóa kế hoạch cần có xác nhận rõ ràng.
- Chưa đăng nhập thì không tạo được kế hoạch; ứng dụng mời đăng nhập bằng Google hoặc bằng email và mật khẩu.
- Người dùng đăng ký được tài khoản bằng tên hiển thị, username, email và mật khẩu, xác nhận email qua link, và đặt lại mật khẩu khi quên.
- Người dùng đăng nhập được bằng email hoặc username; username không hiển thị cho người khác.
- Người xem và người chỉnh sửa bằng passcode không cần đăng nhập.
- Danh sách kế hoạch có hai mục: Sắp diễn ra (tổng kết đang mở hoặc tạm khóa) ở trên, và Đã tổng kết (tổng kết đã chốt) ở dưới, chuyến mới nhất lên trước.
- Danh sách kế hoạch ở mục Sắp diễn ra, lịch trình, nơi ở và khoản chi phí hiển thị từ trên xuống dưới theo thời gian tăng dần, từ quá khứ đến tương lai.
- Lịch trình và danh sách khoản chi phí xem được theo "Tất cả" hoặc theo từng ngày của chuyến đi.

## Edge Cases

- Ngày bắt đầu và ngày kết thúc của kế hoạch trùng nhau.
- Tên kế hoạch có chữ có dấu được gõ bằng các bộ gõ khác nhau; cùng một tên luôn có cùng số ký tự.
- Người dùng dán một tên dài hơn 50 ký tự; ô nhập báo vượt giới hạn, không tự cắt âm thầm.
- Ngày kết thúc sớm hơn ngày bắt đầu trong khi chỉnh sửa.
- Hai người cùng vào chỉnh sửa một kế hoạch gần như cùng lúc; chỉ một người giữ được edit lock, người còn lại chỉ xem được kế hoạch.
- Người chỉnh sửa đóng tab hoặc mất kết nối mà không thoát chế độ chỉnh sửa; edit lock được nhả sau thời gian không thao tác.
- Lock của người chỉnh sửa hết hạn trong khi họ còn thay đổi chưa lưu; thao tác lưu bị từ chối kèm thông báo rõ ràng, thay vì ghi đè âm thầm lên thay đổi mới hơn.
- Kế hoạch được xem mà không có passcode, hoặc người không có quyền chỉnh sửa cố gắng chỉnh sửa/xóa kế hoạch.
- Có người cố tình nhập sai passcode để khóa kế hoạch. Các thiết bị đã có quyền chỉnh sửa vẫn hoạt động bình thường, chủ kế hoạch vẫn chỉnh sửa được, và link trong email gửi chủ kế hoạch gỡ được khóa.
- Việc nhập passcode bị khóa lại ngay sau khi vừa mở khóa; hệ thống không được gửi email không giới hạn (tối đa một email cho mỗi lần khóa).
- Link mở khóa được mở sau khi khóa đã hết hạn hoặc sau khi link đã được dùng.
- Người chỉnh sửa quên passcode; họ hỏi chủ kế hoạch, và chủ kế hoạch đặt passcode mới nếu cần, vì passcode cũ không xem lại được.
- Người chỉnh sửa bằng passcode muốn xóa kế hoạch; không có thao tác xóa cho họ.
- Mã kế hoạch được sinh ra đã tồn tại; hệ thống sinh mã mới.
- Có người chỉ gõ `planId` 10 chữ số, hoặc mở link sai khóa; kế hoạch không mở được, và thông báo không cho biết kế hoạch có tồn tại hay không.
- Khóa chia sẻ bị đổi; người có link cũ không mở được kế hoạch nữa, còn thiết bị đang có quyền chỉnh sửa và chủ kế hoạch được chuyển sang link mới.
- Người chưa đăng nhập bấm tạo kế hoạch; ứng dụng chuyển sang đăng nhập, xong thì quay lại bước tạo kế hoạch.
- Người đăng ký bằng email chưa xác nhận email; chưa tạo được kế hoạch cho đến khi xác nhận.
- Cùng một email đã đăng ký bằng mật khẩu, sau đó đăng nhập bằng Google; hai cách đăng nhập dùng chung một tài khoản.
- Lần đầu đăng nhập bằng Google; ứng dụng hỏi username trước khi tạo kế hoạch, tên hiển thị điền sẵn theo Google.
- Người dùng gõ username có chữ hoa; chữ hoa tự đổi thành chữ thường. Username có dấu, khoảng trắng, hoặc đã có người dùng; ô nhập báo ngay.
- Người dùng nhập sai username hoặc sai mật khẩu; cả hai trường hợp nhận cùng một thông báo.
- Người dùng quên mật khẩu; đặt lại qua link gửi đến email, link dùng một lần và có hạn.
- Hai khoản chi phí có cùng ngày giờ; khoản được tạo trước hiển thị trước.
- Sửa ngày giờ của một khoản chi phí, một hoạt động, hoặc ngày bắt đầu của kế hoạch; mục đó chuyển sang đúng vị trí mới trong danh sách.
- Khoản chi phí có ngày trước hoặc sau chuyến đi, ví dụ đặt phòng từ trước; khoản đó chỉ hiện khi chọn "Tất cả" và vẫn được tính vào tổng kết.
- Chọn xem một ngày không có hoạt động hay khoản chi phí nào; hiển thị trạng thái trống.
- Chốt tổng kết của một kế hoạch; kế hoạch chuyển từ mục Sắp diễn ra sang mục Đã tổng kết. Tạm khóa thì kế hoạch vẫn ở mục Sắp diễn ra.
- Chuyến đi đã kết thúc nhưng tổng kết chưa chốt; kế hoạch chưa được coi là kết thúc, vẫn ở mục Sắp diễn ra kèm nhãn "Chưa chốt tổng kết" cho đến khi chốt.
- Chủ kế hoạch chưa có kế hoạch nào đã chốt, hoặc mọi kế hoạch đều đã chốt; mục trống hiển thị thông báo ngắn.
