# Góp Gạo — Yêu cầu MVP Lập kế hoạch chuyến đi và Chia sẻ chi phí

## Tổng quan

Góp Gạo (tên tiếng Anh: GoSplit) là một ứng dụng trực tuyến để lập kế hoạch chuyến đi và theo dõi các khoản chi phí chung. Một kế hoạch bao gồm lịch trình chuyến đi, người tham gia, các khoản chi phí và bản tổng kết chuyến đi. Người tạo kế hoạch phải đăng nhập; người xem qua link và người chỉnh sửa bằng passcode không cần tài khoản. Kế hoạch có thể truy cập trên nhiều thiết bị.

MVP không bao gồm tính năng phân tích dựa trên AI hoặc LLM. MVP có Gợi ý quán ăn từ cộng đồng: người địa phương đăng món ăn và quán ăn của một khu vực, người đi du lịch áp dụng vào danh sách món ăn của kế hoạch. MVP cũng có Chia sẻ hành trình: chủ kế hoạch chia sẻ lịch trình, nơi ở, món ăn và chi phí ước tính của một chuyến đi đã chốt, để mọi người tham khảo và sao chép thành kế hoạch của mình.

## Thuật ngữ

- **MVP** (Minimum Viable Product): bản phát hành đầu tiên, chỉ gồm các tính năng cần thiết nhất, tức mọi thứ trong mục "Trong phạm vi" bên dưới.
- **Kế hoạch** (plan): một chuyến đi, gồm lịch trình, người tham gia, chi phí, nơi ở, danh sách món ăn và bản tổng kết.
- **Chủ kế hoạch**: người đã đăng nhập và tạo kế hoạch. Mọi kế hoạch đều có chủ.
- **Người xem**: người có link chia sẻ của kế hoạch.
- **Người có quyền chỉnh sửa**: người đã nhập đúng passcode trên thiết bị, hoặc chủ kế hoạch.
- **Người tham gia**: một thành viên của nhóm đi, không nhất thiết có tài khoản.
- **Người thu tiền**: người tham gia giữ tiền đóng của cả nhóm, nhận số còn thiếu và trả lại số dư cho mọi người, có thể qua QR chuyển khoản; mặc định là chủ kế hoạch.
- **Tiền đóng**: tiền một người tham gia đưa cho người thu tiền, ví dụ khi cả nhóm đóng trước một phần để chuẩn bị chuyến đi.
- **Danh sách gợi ý**: danh sách gợi ý quán ăn do người dùng đăng cho một khu vực.
- **Hành trình**: bản chia sẻ công khai của một kế hoạch đã chốt tổng kết, gồm lịch trình, nơi ở, món ăn và chi phí ước tính mỗi người, không có thông tin của người tham gia.
- **Khám phá**: mục ở màn hình chính, bên cạnh mục Kế hoạch, gồm hành trình và danh sách gợi ý quán ăn.
- **R1, R2, …**: mã quy tắc nghiệp vụ, đánh số chung cho mọi module.

## Phạm vi

### Trong phạm vi

**Kế hoạch và quyền truy cập** ([01](01-ke-hoach-va-quyen-truy-cap.md))

- Tạo, liệt kê, xem, chỉnh sửa và xóa kế hoạch chuyến đi.
- Người tạo kế hoạch phải đăng nhập, bằng Google hoặc bằng tài khoản của ứng dụng (email hoặc username, kèm mật khẩu); tài khoản có tên hiển thị và username; chủ kế hoạch quay lại xem các kế hoạch của mình từ danh sách kế hoạch, chia hai mục Sắp diễn ra và Đã tổng kết.
- Cho phép những người có đường link chia sẻ của kế hoạch xem kế hoạch đó mà không cần đăng nhập hay nhập passcode. Link chứa khóa bí mật, nên không thể tìm ra kế hoạch bằng cách đoán mã, và người có quyền chỉnh sửa có thể đổi link khi bị lộ.
- Bảo vệ việc chỉnh sửa bằng passcode 6 chữ số. Ai có passcode cũng chỉnh sửa được kế hoạch, không cần mời qua email. Passcode dùng cho việc chỉnh sửa, không dùng cho việc xem.
- Chủ kế hoạch chỉnh sửa được mà không cần passcode và là người duy nhất được xóa kế hoạch.
- Tại một thời điểm chỉ một người được chỉnh sửa kế hoạch.
- Khóa việc nhập passcode khi nhập sai nhiều lần, và cho phép mở khóa qua email gửi đến chủ kế hoạch.
- Chủ kế hoạch đổi passcode ngay trong cài đặt của kế hoạch.
- Hỗ trợ lưu trữ trực tuyến và xem/chỉnh sửa từ nhiều thiết bị.
- Hiển thị các danh sách có ngày giờ theo thời gian tăng dần; lịch trình và chi phí xem được theo "Tất cả" hoặc từng ngày.

**Người tham gia, chi phí và tổng kết** ([02](02-nguoi-tham-gia-va-chi-phi.md))

- Mỗi kế hoạch có một tiền tệ, chọn khi tạo kế hoạch: ứng dụng chọn sẵn theo kế hoạch gần nhất, vùng của trình duyệt hoặc ngôn ngữ; người dùng tìm tiền tệ theo mã, tên tiền tệ hoặc tên nước. Số chữ số lẻ và bước làm tròn theo từng tiền tệ.
- Tự động thêm chủ kế hoạch thành người tham gia khi tạo kế hoạch.
- Hỏi "Bạn là ai?" khi một người chỉnh sửa kế hoạch lần đầu trên một thiết bị, để ứng dụng biết người tham gia nào đang dùng thiết bị đó.
- Quản lý người tham gia, các hoạt động trong lịch trình và các khoản chi phí của chuyến đi.
- Gán một khoản chi phí cho một hoạt động trong lịch trình hoặc ngày giờ tương ứng của hoạt động đó.
- Chia một khoản chi phí cho những người tham gia được chọn theo hệ số tỷ lệ có thể chỉnh sửa.
- Ghi lại tiền đóng của mọi người, ví dụ đợt đóng trước chuyến đi: ghi nhanh cho nhiều người cùng một số tiền, hoặc mỗi người một số.
- Hiển thị bản tổng kết chuyến đi: tổng chi phí, số tiền người thu tiền đang giữ, và cho từng người số chi tiêu, đã đóng, còn thiếu hoặc dư. Người có quyền chỉnh sửa ghi nhanh một người đã đóng đủ, hoặc đã được trả lại phần dư.
- Mỗi kế hoạch có một người thu tiền, mặc định là chủ kế hoạch. Cho người có quyền chỉnh sửa tải lên một mã QR chuyển khoản ngân hàng của người thu tiền trong mục tổng kết, để mọi người quét và chuyển tiền cho người đó.
- Chia sẻ link mở bản tổng kết chuyến đi, và xuất bản tổng kết thành ảnh.
- Tạm khóa tổng kết (mở lại được) hoặc chốt cuối cùng (không mở lại được); khi đang khóa, người tham gia, hoạt động và khoản chi phí không sửa hay xóa được.

**Lịch trình, nơi ở và danh sách món ăn** ([03](03-lich-trinh-noi-o-mon-an.md))

- Ghi lại nơi nhóm ở, kèm ngày của từng nơi. Một chuyến đi có thể có nhiều nơi ở khi đi qua nhiều địa điểm.
- Lưu danh sách món ăn muốn thử của cả chuyến đi, không gắn với ngày; mỗi món có thể có một hoặc nhiều buổi (sáng, chiều, tối), hiển thị bằng biểu tượng, và lọc được theo buổi.

**Gợi ý quán ăn từ cộng đồng** ([04](04-goi-y-quan-an.md))

- Gợi ý quán ăn từ cộng đồng, không dùng AI: người dùng đã đăng nhập, chủ yếu là người địa phương, đăng một danh sách gợi ý quán ăn (gọi tắt: danh sách gợi ý) cho một khu vực, gồm các món ăn kèm tên quán và đường đến quán. Gợi ý quán ăn là lựa chọn "Quán ăn" trong mục Khám phá, bên cạnh mục kế hoạch, và là một lựa chọn trong tab Ăn gì của mỗi kế hoạch.
- Cho mọi người tìm danh sách gợi ý theo điểm đến, không phân biệt dấu và tìm gần đúng; người có quyền chỉnh sửa có thể áp dụng một hoặc nhiều danh sách gợi ý, hoặc từng mục, vào danh sách món ăn của kế hoạch rồi tự chỉnh sửa.
- Cho người đã đăng nhập đánh dấu danh sách gợi ý là hữu ích, và cho mọi người báo cáo danh sách gợi ý. Danh sách gợi ý bị nhiều người báo cáo sẽ bị ẩn cho đến khi admin xem xét.
- Có trang admin để xem xét danh sách gợi ý bị báo cáo và khóa tài khoản spam.

**Chia sẻ hành trình** ([07](07-chia-se-hanh-trinh.md))

- Cho chủ kế hoạch chia sẻ hành trình của một kế hoạch đã chốt tổng kết lên mục Khám phá: lịch trình theo Ngày 1, Ngày 2, …, nơi ở, món ăn và chi phí ước tính mỗi người; không có tên người tham gia, từng khoản chi phí, QR hay ngày thật của chuyến đi.
- Cho mọi người tìm hành trình theo điểm đến, và cho người đã đăng nhập sao chép hành trình thành kế hoạch mới của mình.
- Hữu ích, báo cáo và kiểm duyệt của admin giống danh sách gợi ý.

**Ngôn ngữ, theme và ảnh nền** ([05](05-ngon-ngu-va-theme.md))

- Hỗ trợ tiếng Việt và tiếng Anh. Tên ứng dụng là Góp Gạo trong tiếng Việt và GoSplit trong tiếng Anh. Số tiền tròn nghìn hiển thị rút gọn với `k` (tiếng Việt) hoặc `K` (tiếng Anh).
- Cho người dùng chọn theme cho từng kế hoạch khi tạo. Theme có hình minh họa, và mọi người xem kế hoạch đều thấy cùng một theme.
- Cho người có quyền chỉnh sửa thay hình minh họa của theme bằng ảnh riêng.
- Dùng được trên trình duyệt điện thoại và máy tính, và cho phép cài ứng dụng lên màn hình chính của điện thoại.

**Bảo vệ dữ liệu và chống crawl** ([06](06-bao-mat-du-lieu.md))

- Bảo vệ dữ liệu kế hoạch và người dùng khỏi bị crawl: kế hoạch không công khai, kế hoạch, danh sách gợi ý và hành trình không được công cụ tìm kiếm lập chỉ mục, việc đọc dữ liệu bị giới hạn, và người xem chỉ nhận dữ liệu mà màn hình cần.

### Ngoài phạm vi

- Tích hợp AI hoặc LLM.
- Tạo kế hoạch khi chưa đăng nhập.
- Nhiều loại tiền tệ trong cùng một kế hoạch, hoặc quy đổi tiền tệ.
- Xử lý thanh toán hoặc chuyển tiền. Ứng dụng có thể hiển thị QR chuyển khoản ([R54](02-nguoi-tham-gia-va-chi-phi.md)), nhưng không xử lý hay xác minh giao dịch chuyển tiền.
- Theo dõi công nợ giữa từng cặp người tham gia. MVP chỉ ghi tiền đóng và tiền trả lại giữa mỗi người và người thu tiền; không theo dõi tiền chuyển trực tiếp giữa hai người tham gia khác.
- Hiển thị bản đồ hoặc chỉ đường trong ứng dụng. Các hoạt động trong lịch trình có thể lưu một đường link bản đồ.
- Chỉnh sửa cộng tác realtime (nhiều người cùng chỉnh sửa một kế hoạch cùng lúc).
- Cài đặt sáng/tối riêng cho từng người dùng. Giao diện của kế hoạch do theme của kế hoạch quyết định.
- Tự động kiểm duyệt ảnh người dùng tải lên.
- Xuất bản tổng kết ra định dạng khác ngoài ảnh (ví dụ: PDF hoặc bảng tính), trừ khi được bổ sung thành yêu cầu sau này.

### Dự kiến sau MVP

- Liên kết món ăn với khoản chi phí.
- Trang hồ sơ tác giả: thông tin tác giả và các danh sách gợi ý, hành trình đã đăng, nhóm theo khu vực.
- Trang "Quán được nhắc đến nhiều nhất" của mỗi khu vực, gộp từ nhiều danh sách.
- Theo dõi các tác giả địa phương mình thích.
- Ảnh món ăn trong danh sách (cần thêm kiểm duyệt ảnh).
- Bình luận hoặc hỏi tác giả về quán.
- Đánh dấu món "đã ăn" và chấm điểm.
- Sao chép hành trình vào một kế hoạch đã có; MVP chỉ sao chép thành kế hoạch mới.

## Các module

| Module | Nội dung | Rule |
|---|---|---|
| [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) | Đăng nhập của người tạo, tên hiển thị và username, kế hoạch, giới hạn tên, link chia sẻ, passcode, edit lock, xóa kế hoạch, danh sách kế hoạch hai mục, thứ tự hiển thị theo thời gian | R2–R11, R22, R24, R60–R62, R73, R78 |
| [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) | Tiền tệ của kế hoạch, người tham gia, chi phí, tiền đóng, làm tròn, tổng kết từng người, tạm khóa và chốt tổng kết, người thu tiền, QR chuyển khoản | R1, R12–R21, R23, R25–R27, R54–R57, R59, R70–R72, R75, R76 |
| [03 Lịch trình, nơi ở và danh sách món ăn](03-lich-trinh-noi-o-mon-an.md) | Lịch trình, nơi ở, danh sách món ăn | R31–R33, R58 |
| [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) | Đăng, tìm, áp dụng danh sách gợi ý; báo cáo; admin | R34–R45 |
| [05 Ngôn ngữ, theme và ảnh nền](05-ngon-ngu-va-theme.md) | Song ngữ, rút gọn số tiền, theme, màu trạng thái tiền, ảnh nền riêng, PWA | R28–R30, R74, R77 |
| [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) | Chống crawl, noindex, giới hạn lượt đọc | R46–R53 |
| [07 Chia sẻ hành trình](07-chia-se-hanh-trinh.md) | Chia sẻ hành trình của kế hoạch đã chốt, tìm, sao chép thành kế hoạch mới, báo cáo | R63–R69 |

## Quy ước

- Tên các trường trong phần Dữ liệu của mỗi module mang tính khái niệm và có thể được điều chỉnh khi triển khai.
- Mỗi module gồm: Dữ liệu → Quy tắc → Acceptance Criteria → Edge Cases.
- Mã rule không đổi khi chuyển giữa các file. Rule mới lấy số tiếp theo (hiện là R79), ghi vào đúng module và cập nhật bảng trên.
- Mỗi file giữ dưới khoảng 200 dòng; module dài hơn thì tách tiếp.
- Data model (ERD): [data-model](../data-model/README.md).
- Công việc triển khai: [tasks](../tasks/README.md).
