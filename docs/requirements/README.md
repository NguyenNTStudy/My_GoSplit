# Góp Gạo — Yêu cầu MVP Lập kế hoạch chuyến đi và Chia sẻ chi phí

## Tổng quan

Góp Gạo (tên tiếng Anh: GoSplit) là một ứng dụng trực tuyến để lập kế hoạch chuyến đi và theo dõi các khoản chi phí chung. Một kế hoạch bao gồm lịch trình chuyến đi, người tham gia, các khoản chi phí và bản tổng kết chuyến đi. Ứng dụng hỗ trợ kế hoạch thuộc sở hữu của tài khoản và kế hoạch có thể xem mà không cần tài khoản. Kế hoạch có thể truy cập trên nhiều thiết bị.

MVP không bao gồm tính năng phân tích dựa trên AI hoặc LLM. MVP có Gợi ý quán ăn từ cộng đồng: người địa phương đăng món ăn và quán ăn của một khu vực, người đi du lịch áp dụng vào danh sách món ăn của kế hoạch.

## Thuật ngữ

- **MVP** (Minimum Viable Product): bản phát hành đầu tiên, chỉ gồm các tính năng cần thiết nhất, tức mọi thứ trong mục "Trong phạm vi" bên dưới.
- **Kế hoạch** (plan): một chuyến đi, gồm lịch trình, người tham gia, chi phí, nơi ở, danh sách món ăn và bản tổng kết.
- **Kế hoạch thuộc sở hữu tài khoản / không có tài khoản**: kế hoạch được tạo khi đã đăng nhập / chưa đăng nhập. Kế hoạch không có tài khoản bị xóa sau 30 ngày không cập nhật.
- **Chủ tài khoản** (chủ kế hoạch): người đã đăng nhập và tạo kế hoạch thuộc sở hữu tài khoản.
- **Người xem**: người có link chia sẻ của kế hoạch.
- **Người có quyền chỉnh sửa**: người đã nhập đúng passcode trên thiết bị, hoặc chủ tài khoản.
- **Người tham gia**: một thành viên của nhóm đi, không nhất thiết có tài khoản.
- **Người thu tiền**: người tham gia nhận tiền đóng góp của cả nhóm qua QR chuyển khoản.
- **Danh sách gợi ý**: danh sách gợi ý quán ăn do người dùng đăng cho một khu vực.
- **R1, R2, …**: mã quy tắc nghiệp vụ, đánh số chung cho mọi module.

## Phạm vi

### Trong phạm vi

**Kế hoạch và quyền truy cập** ([01](01-ke-hoach-va-quyen-truy-cap.md))

- Tạo, liệt kê, xem, chỉnh sửa và xóa kế hoạch chuyến đi.
- Lưu giữ thông tin chuyến đi của các kế hoạch thuộc sở hữu tài khoản để chủ tài khoản có thể quay lại xem.
- Cho phép những người có đường link chia sẻ của kế hoạch xem kế hoạch đó mà không cần đăng nhập hay nhập passcode. Link chứa khóa bí mật, nên không thể tìm ra kế hoạch bằng cách đoán mã, và người có quyền chỉnh sửa có thể đổi link khi bị lộ.
- Bảo vệ việc chỉnh sửa bằng passcode 6 chữ số. Ai có passcode cũng chỉnh sửa được kế hoạch, không cần mời qua email. Passcode dùng cho việc chỉnh sửa, không dùng cho việc xem.
- Chủ tài khoản của kế hoạch thuộc sở hữu tài khoản được chỉnh sửa mà không cần passcode. Chỉ chủ tài khoản được xóa kế hoạch thuộc sở hữu tài khoản; kế hoạch không có tài khoản thì ai có passcode cũng xóa được.
- Tại một thời điểm chỉ một người được chỉnh sửa kế hoạch.
- Khóa việc nhập passcode khi nhập sai nhiều lần, và cho phép mở khóa qua email khôi phục của kế hoạch.
- Cho phép kế hoạch không có tài khoản có email khôi phục (tùy chọn). Có thể đổi passcode qua link gửi đến email khôi phục.
- Hỗ trợ lưu trữ trực tuyến và xem/chỉnh sửa từ nhiều thiết bị.
- Tự động xóa các kế hoạch được tạo mà không có tài khoản sau 30 ngày kể từ lần cập nhật cuối cùng.
- Hiển thị các danh sách có ngày giờ theo thời gian tăng dần; lịch trình và chi phí xem được theo "Tất cả" hoặc từng ngày.

**Người tham gia, chi phí và tổng kết** ([02](02-nguoi-tham-gia-va-chi-phi.md))

- Tự động thêm chủ tài khoản thành người tham gia khi tạo kế hoạch thuộc sở hữu tài khoản.
- Hỏi "Bạn là ai?" khi một người chỉnh sửa kế hoạch lần đầu trên một thiết bị, để ứng dụng biết người tham gia nào đang dùng thiết bị đó.
- Quản lý người tham gia, các hoạt động trong lịch trình và các khoản chi phí của chuyến đi.
- Gán một khoản chi phí cho một hoạt động trong lịch trình hoặc ngày giờ tương ứng của hoạt động đó.
- Chia một khoản chi phí cho những người tham gia được chọn theo hệ số tỷ lệ có thể chỉnh sửa.
- Hiển thị bản tổng kết chuyến đi, bao gồm số tiền đã trả/đã chi, tổng chi phí chuyến đi, số tiền mỗi người tham gia cần đóng góp, và các đợt đóng góp tùy chọn (ví dụ: đợt một và đợt hai).
- Cho phép người có quyền chỉnh sửa đánh dấu một người tham gia là đã thanh toán.
- Cho người có quyền chỉnh sửa tải lên một mã QR chuyển khoản ngân hàng của người thu tiền trong mục tổng kết, để mọi người quét và chuyển tiền cho người đó.
- Chia sẻ link mở bản tổng kết chuyến đi, và xuất bản tổng kết thành ảnh.
- Tạm khóa tổng kết (mở lại được) hoặc chốt cuối cùng (không mở lại được); khi đang khóa, người tham gia, hoạt động và khoản chi phí không sửa hay xóa được.

**Lịch trình, nơi ở và danh sách món ăn** ([03](03-lich-trinh-noi-o-mon-an.md))

- Ghi lại nơi nhóm ở, kèm ngày của từng nơi. Một chuyến đi có thể có nhiều nơi ở khi đi qua nhiều địa điểm.
- Lưu danh sách món ăn muốn thử của cả chuyến đi; mỗi món có thể gán ngày và buổi, hiển thị bằng biểu tượng, và lọc được theo ngày và buổi.

**Gợi ý quán ăn từ cộng đồng** ([04](04-goi-y-quan-an.md))

- Gợi ý quán ăn từ cộng đồng, không dùng AI: người dùng đã đăng nhập, chủ yếu là người địa phương, đăng một danh sách gợi ý quán ăn (gọi tắt: danh sách gợi ý) cho một khu vực, gồm các món ăn kèm tên quán và đường đến quán. Gợi ý quán ăn là một mục riêng trong ứng dụng, bên cạnh mục kế hoạch, và có tab riêng trong mỗi kế hoạch.
- Cho mọi người tìm danh sách gợi ý theo điểm đến, không phân biệt dấu và tìm gần đúng; người có quyền chỉnh sửa có thể áp dụng một hoặc nhiều danh sách gợi ý, hoặc từng mục, vào danh sách món ăn của kế hoạch rồi tự chỉnh sửa.
- Cho người đã đăng nhập đánh dấu danh sách gợi ý là hữu ích, và cho mọi người báo cáo danh sách gợi ý. Danh sách gợi ý bị nhiều người báo cáo sẽ bị ẩn cho đến khi admin xem xét.
- Có trang admin để xem xét danh sách gợi ý bị báo cáo và khóa tài khoản spam.

**Ngôn ngữ, theme và ảnh nền** ([05](05-ngon-ngu-va-theme.md))

- Hỗ trợ tiếng Việt và tiếng Anh. Tên ứng dụng là Góp Gạo trong tiếng Việt và GoSplit trong tiếng Anh.
- Cho người dùng chọn theme cho từng kế hoạch khi tạo. Theme có hình minh họa, và mọi người xem kế hoạch đều thấy cùng một theme.
- Cho người có quyền chỉnh sửa thay hình minh họa của theme bằng ảnh riêng.
- Dùng được trên trình duyệt điện thoại và máy tính, và cho phép cài ứng dụng lên màn hình chính của điện thoại.

**Bảo vệ dữ liệu và chống crawl** ([06](06-bao-mat-du-lieu.md))

- Bảo vệ dữ liệu kế hoạch và người dùng khỏi bị crawl: kế hoạch không công khai, kế hoạch và danh sách gợi ý không được công cụ tìm kiếm lập chỉ mục, việc đọc dữ liệu bị giới hạn, và người xem chỉ nhận dữ liệu mà màn hình cần.

### Ngoài phạm vi

- Tích hợp AI hoặc LLM.
- Chọn đơn vị tiền tệ, nhiều loại tiền tệ trong cùng một kế hoạch, hoặc quy đổi tiền tệ.
- Xử lý thanh toán hoặc chuyển tiền. Ứng dụng có thể hiển thị QR chuyển khoản ([R54](02-nguoi-tham-gia-va-chi-phi.md)), nhưng không xử lý hay xác minh giao dịch chuyển tiền.
- Theo dõi chi tiết công nợ/quyết toán giữa những người tham gia. MVP chỉ ghi nhận việc xác nhận có thẩm quyền rằng một người tham gia đã thanh toán; không theo dõi giao dịch thanh toán giữa hai người tham gia.
- Hiển thị bản đồ hoặc chỉ đường trong ứng dụng. Các hoạt động trong lịch trình có thể lưu một đường link bản đồ.
- Chỉnh sửa cộng tác realtime (nhiều người cùng chỉnh sửa một kế hoạch cùng lúc).
- Cài đặt sáng/tối riêng cho từng người dùng. Giao diện của kế hoạch do theme của kế hoạch quyết định.
- Tự động kiểm duyệt ảnh người dùng tải lên.
- Xuất bản tổng kết ra định dạng khác ngoài ảnh (ví dụ: PDF hoặc bảng tính), trừ khi được bổ sung thành yêu cầu sau này.

### Dự kiến sau MVP

- Cho mỗi kế hoạch chọn đơn vị tiền tệ.
- Liên kết món ăn với khoản chi phí.
- Trang hồ sơ tác giả: thông tin tác giả và các danh sách gợi ý đã đăng, nhóm theo khu vực.
- Trang "Quán được nhắc đến nhiều nhất" của mỗi khu vực, gộp từ nhiều danh sách.
- Theo dõi các tác giả địa phương mình thích.
- Ảnh món ăn trong danh sách (cần thêm kiểm duyệt ảnh).
- Bình luận hoặc hỏi tác giả về quán.
- Đánh dấu món "đã ăn" và chấm điểm.

## Các module

| Module | Nội dung | Rule |
|---|---|---|
| [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) | Kế hoạch, link chia sẻ, passcode, email khôi phục, edit lock, xóa và hết hạn, thứ tự hiển thị theo thời gian | R2–R11, R22, R24, R60 |
| [02 Người tham gia, chi phí và tổng kết](02-nguoi-tham-gia-va-chi-phi.md) | Người tham gia, chi phí, làm tròn, tổng kết, tạm khóa và chốt tổng kết, QR chuyển khoản | R1, R12–R21, R23, R25–R27, R54–R57, R59 |
| [03 Lịch trình, nơi ở và danh sách món ăn](03-lich-trinh-noi-o-mon-an.md) | Lịch trình, nơi ở, danh sách món ăn | R31–R33, R58 |
| [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) | Đăng, tìm, áp dụng danh sách gợi ý; báo cáo; admin | R34–R45 |
| [05 Ngôn ngữ, theme và ảnh nền](05-ngon-ngu-va-theme.md) | Song ngữ, theme, ảnh nền riêng, PWA | R28–R30 |
| [06 Bảo vệ dữ liệu và chống crawl](06-bao-mat-du-lieu.md) | Chống crawl, noindex, giới hạn lượt đọc | R46–R53 |

## Quy ước

- Tên các trường trong phần Dữ liệu của mỗi module mang tính khái niệm và có thể được điều chỉnh khi triển khai.
- Mỗi module gồm: Dữ liệu → Quy tắc → Acceptance Criteria → Edge Cases.
- Mã rule không đổi khi chuyển giữa các file. Rule mới lấy số tiếp theo (hiện là R61), ghi vào đúng module và cập nhật bảng trên.
- Mỗi file giữ dưới khoảng 200 dòng; module dài hơn thì tách tiếp.
- Data model (ERD): [data-model](../data-model/README.md).
- Công việc triển khai: [tasks](../tasks/README.md).
