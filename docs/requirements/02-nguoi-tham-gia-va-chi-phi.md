# 02 — Người tham gia, chi phí và tổng kết

Người tham gia, câu hỏi "Bạn là ai?", chi phí và cách chia, làm tròn, tổng kết, đợt đóng góp, đánh dấu đã thanh toán và QR chuyển khoản.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [03 Lịch trình, nơi ở và danh sách món ăn](03-lich-trinh-noi-o-mon-an.md) · [Tổng quan](README.md)

## Dữ liệu

### Người tham gia

- `participantId`: mã định danh duy nhất của người tham gia.
- `displayName`: tên người tham gia.
- `status`: đang hoạt động, hoặc ngừng hoạt động (đã rời kế hoạch) (R13).
- `hasPaid`: người có quyền chỉnh sửa đã xác nhận người tham gia này đã thanh toán hay chưa.
- `paymentInstallments`: các bản ghi đợt đóng góp (tùy chọn), chẳng hạn số thứ tự đợt, số tiền và trạng thái đã thanh toán.

### QR chuyển khoản

Mỗi kế hoạch có tối đa một QR chuyển khoản.

- `collectorParticipantId`: người tham gia thu tiền; mọi người chuyển tiền cho người này.
- `image`: ảnh QR đã tải lên; chỉ được tải qua link của kế hoạch (R57).
- `label`: nhãn (tùy chọn), ví dụ tên ngân hàng.
- `updatedAt`: thời điểm QR được tải lên hoặc thay gần nhất; hiển thị trong mục tổng kết.

### Chi phí

- `expenseId`: mã định danh duy nhất của khoản chi phí.
- `description`: tiêu đề hoặc mô tả khoản chi phí.
- `amount`: số tiền dương, nhập tối đa ba chữ số thập phân.
- `paidByParticipantId`: người tham gia đã trả tiền; mặc định là người tạo khoản chi phí và có thể thay đổi bằng bộ chọn.
- `dateTime`: ngày giờ phát sinh chi phí.
- `notes`: ghi chú chi phí (tùy chọn).
- `activityId`: hoạt động trong lịch trình được liên kết (tùy chọn).
- `shares`: những người tham gia được chọn và hệ số tỷ lệ của họ.
- `createdAt`: thời điểm tạo; dùng khi hai khoản chi phí trùng ngày giờ ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- `hasLeftParticipantWarning`: cảnh báo được suy ra khi có người tham gia trong khoản chi phí đã rời kế hoạch.

## Quy tắc

- **R1.** Hiện tại mọi kế hoạch dùng một đơn vị tiền tệ cố định, ký hiệu là `$`. Người dùng không chọn được đơn vị khác, và không kết hợp được nhiều đơn vị tiền tệ trong một kế hoạch.
- **R12.** Chỉ có thể chọn một người tham gia cho các khoản chi phí mới khi người đó còn đang tham gia kế hoạch.
- **R13.** Khi người có quyền chỉnh sửa xóa một người tham gia: nếu người đó có liên quan đến khoản chi phí (là người trả tiền hoặc người chia) hoặc đang là người thu tiền (R54), người đó không bị xóa mà chuyển sang trạng thái ngừng hoạt động (đã rời kế hoạch). Các bản ghi chi phí được giữ nguyên, các khoản chi phí liên quan hiển thị cảnh báo (R21), và nếu người đó là người thu tiền thì QR hiển thị cảnh báo cho đến khi được thay hoặc gỡ. Nếu người đó không liên quan đến khoản chi phí nào và không phải người thu tiền, người đó bị xóa hẳn ngay, không cần xác nhận. Người tham gia đại diện chủ tài khoản (R26) không xóa được.
- **R14.** Một khoản chi phí phải thuộc về một kế hoạch, có số tiền dương, có một người trả tiền và có ít nhất một người tham gia chia phần.
- **R15.** Người trả tiền mặc định là người tạo khoản chi phí (xem R26 và R27). Có thể thay đổi người trả tiền, và người trả tiền không bắt buộc phải nằm trong số những người chia khoản chi phí đó.
- **R16.** Phần chia chi phí được phân bổ theo tỷ lệ. Tỷ lệ mặc định cho mỗi người tham gia được chọn là `1`; người dùng có thể thay đổi. Tỷ lệ phải lớn hơn không.
- **R17.** Phần chia chưa làm tròn của một người tham gia được tính bằng `số tiền chi phí × tỷ lệ của người tham gia / tổng tỷ lệ của những người tham gia được chọn`.
- **R18.** Số tiền chi phí nhập vào hỗ trợ tối đa ba chữ số sau dấu thập phân. Các phép tính giữ nguyên độ chính xác và chỉ làm tròn khi đưa ra kết quả cuối cùng.
- **R19.** Số tiền cuối cùng được làm tròn lên đến bội số 0,5 gần nhất của đơn vị tiền tệ (ví dụ: `3,11` thành `3,5`, `3,6` thành `4`, `3,5` giữ nguyên). Vì mọi số tiền đều được làm tròn lên, tổng các số đã làm tròn có thể lớn hơn tổng chi phí chuyến đi một chút. Ứng dụng không theo dõi phần chênh lệch này: phần đó thuộc về người thu tiền, thường là người đã ứng nhiều tiền nhất.
- **R20.** Hệ thống tính lại phần chia chi phí, tổng số đã trả/đã chi và kết quả đóng góp khi một khoản chi phí được tạo, chỉnh sửa hoặc xóa.
- **R21.** Nếu một khoản chi phí có người tham gia sau đó rời kế hoạch, khoản chi phí đó được giữ nguyên và hiển thị cảnh báo cho người có quyền chỉnh sửa. Việc chỉnh sửa khoản chi phí như vậy cần một thao tác riêng có xác nhận và sẽ tính lại các phần chia bị ảnh hưởng.
- **R23.** Người có quyền chỉnh sửa có thể đánh dấu một người tham gia là đã thanh toán. Việc xác nhận này tách biệt với khoản chi phí và không được tính vào chi tiêu của chuyến đi.
- **R25.** Một khoản chi phí có thể được liên kết với một hoạt động trong lịch trình. Ngày giờ của khoản chi phí có thể được hiển thị cùng với mục tương ứng trong lịch trình. Xóa hoạt động thì xóa luôn các khoản chi phí gắn với nó ([R58](03-lich-trinh-noi-o-mon-an.md)).
- **R26.** Khi tạo kế hoạch thuộc sở hữu tài khoản, chủ tài khoản được tự động thêm thành người tham gia. Trên các thiết bị chủ tài khoản đã đăng nhập, ứng dụng dùng người tham gia này mà không cần hỏi. Người tham gia này không xóa được (R13).
- **R27.** Lần đầu một người chỉnh sửa kế hoạch trên một thiết bị, ứng dụng hỏi "Bạn là ai?" và người dùng chọn tên mình trong danh sách người tham gia đang hoạt động. Lựa chọn được lưu trên thiết bị đó và có thể đổi sau. Lựa chọn này được dùng làm người trả tiền mặc định cho các khoản chi phí mới. Người dùng có thể bỏ qua câu hỏi (ví dụ: người tổ chức nhưng không đi cùng); nếu không chọn, phải chọn người trả tiền cho từng khoản chi phí.
- **R54.** Trong mục tổng kết, người có quyền chỉnh sửa có thể tải lên một mã QR chuyển khoản ngân hàng cho kế hoạch: QR của người tham gia thu tiền, thường là chủ kế hoạch. Mọi người chuyển tiền cho người đó. Mỗi kế hoạch có tối đa một QR; tải QR mới sẽ thay QR hiện tại sau khi xác nhận. Tải lên, thay và gỡ QR cần quyền chỉnh sửa như các thao tác chỉnh sửa khác. Người tải chọn người thu tiền trong danh sách người tham gia (mặc định là người tham gia đã chọn trên thiết bị, hoặc chủ tài khoản) và có thể thêm nhãn tùy chọn, ví dụ tên ngân hàng. Ứng dụng chỉ hiển thị QR: không xử lý thanh toán, và việc đánh dấu đã thanh toán vẫn là xác nhận thủ công (R23).
- **R55.** Ảnh QR có thể là JPG, PNG, WebP hoặc HEIC, tối đa 5 MB. Ứng dụng kiểm tra ảnh có đúng một mã QR đọc được, và xóa metadata trước khi lưu. Ứng dụng nhắc người tải rằng ai xem được kế hoạch cũng thấy QR.
- **R56.** Ai xem được kế hoạch đều thấy QR trong mục tổng kết, kèm tên người thu tiền và thời điểm QR được thay gần nhất, và có thể phóng to hoặc lưu QR. Ứng dụng nhắc người chuyển kiểm tra tên người nhận trong app ngân hàng trước khi chuyển. QR không chứa số tiền: người chuyển tự nhập số tiền, dựa theo số cần đóng góp hiển thị trong tổng kết.
- **R57.** Ảnh QR và ảnh riêng của kế hoạch ([R30](05-ngon-ngu-va-theme.md)) chỉ được gửi cho người mở được kế hoạch, và địa chỉ ảnh hết hiệu lực khi khóa chia sẻ bị đổi ([R3](01-ke-hoach-va-quyen-truy-cap.md)). QR không bao giờ xuất hiện trong thẻ preview link ([R51](06-bao-mat-du-lieu.md)). Ảnh xuất tổng kết mặc định có kèm QR, và người dùng có thể bỏ ra. Ảnh QR bị xóa cùng với kế hoạch.
- **R59.** Tổng kết có ba trạng thái:
  - **Đang mở** (mặc định): tổng kết hiển thị "Tạm tính" và được tính lại mỗi khi dữ liệu thay đổi (R20). Người có quyền chỉnh sửa thêm, sửa và xóa người tham gia, hoạt động và khoản chi phí như bình thường, kể cả tên lẫn thông tin.
  - **Tạm khóa**: không thể thêm, sửa hay xóa người tham gia, hoạt động ([R58](03-lich-trinh-noi-o-mon-an.md)), khoản chi phí hay phần chia; tổng kết hiển thị "Tạm khóa" kèm thời điểm khóa. Người có quyền chỉnh sửa có thể mở khóa để quay về Đang mở. Nếu đã có người được đánh dấu đã thanh toán, ứng dụng cảnh báo trước khi mở khóa vì số tiền có thể thay đổi; trạng thái đã thanh toán vẫn giữ nguyên.
  - **Đã chốt**: khóa như Tạm khóa nhưng không mở lại được. Chốt được từ Đang mở hoặc Tạm khóa, sau một bước xác nhận nói rõ là không hoàn tác được. Tổng kết hiển thị "Đã chốt" kèm thời điểm chốt.

  Khi Tạm khóa hoặc Đã chốt, đánh dấu đã thanh toán (R23), đợt đóng góp và QR chuyển khoản (R54) vẫn dùng được. Tạm khóa, mở khóa và chốt cần quyền chỉnh sửa như các thao tác chỉnh sửa khác.

## Acceptance Criteria

### Người tham gia và phân quyền

- Người có quyền chỉnh sửa có thể thêm người tham gia và cập nhật tên hiển thị của họ.
- Khi tạo kế hoạch thuộc sở hữu tài khoản, chủ tài khoản xuất hiện trong danh sách người tham gia.
- Lần đầu chỉnh sửa kế hoạch trên một thiết bị, ứng dụng hỏi người dùng là ai trong danh sách người tham gia đang hoạt động; lựa chọn được ghi nhớ trên thiết bị đó, có thể đổi hoặc bỏ qua.
- Khoản chi phí mới dùng người tham gia đã chọn trên thiết bị làm người trả tiền mặc định.
- Xóa người tham gia có liên quan đến khoản chi phí hoặc đang là người thu tiền thì người đó chuyển sang ngừng hoạt động; các bản ghi giữ nguyên, khoản chi phí liên quan hiển thị cảnh báo.
- Xóa người tham gia không liên quan đến khoản chi phí nào thì người đó bị xóa hẳn ngay, không cần xác nhận.
- Không xóa được người tham gia đại diện chủ tài khoản.
- Người tham gia đã rời kế hoạch không thể được chọn để chia các khoản chi phí mới.
- Các khoản chi phí có người tham gia đã rời kế hoạch sẽ hiển thị cảnh báo cho người có quyền chỉnh sửa.
- Chỉ người có quyền chỉnh sửa mới có thể xác nhận một người tham gia đã thanh toán.
- Việc xác nhận thanh toán không làm tăng chi tiêu chuyến đi hay tổng chi phí.

### Chi phí và tổng kết

- Người dùng có thể thêm, chỉnh sửa và xóa một khoản chi phí với mô tả, số tiền dương, người trả tiền, ngày/giờ và ít nhất một người tham gia được chọn.
- Người trả tiền mặc định là người tạo khoản chi phí và có thể đổi sang người tham gia khác; người trả tiền không bắt buộc phải chia khoản chi phí đó.
- Mỗi người tham gia được chọn bắt đầu với tỷ lệ `1`; người dùng có thể nhập một tỷ lệ dương khác.
- Hệ thống phân bổ khoản chi phí theo tỷ lệ đã chọn và giữ nguyên độ chính xác tính toán cho đến kết quả cuối cùng.
- Số tiền nhập vào có hơn ba chữ số thập phân hoặc không dương sẽ bị từ chối kèm thông báo kiểm tra hợp lệ rõ ràng.
- Kết quả đóng góp cuối cùng được làm tròn lên đến bội số 0,5 gần nhất (ví dụ: `3,11` thành `3,5`); phần chênh lệch so với tổng chi phí không được ghi nhận riêng.
- Chỉnh sửa hoặc xóa một khoản chi phí sẽ cập nhật các tổng số và kết quả liên quan.
- Danh sách khoản chi phí hiển thị theo ngày giờ tăng dần, xem được theo "Tất cả" hoặc từng ngày ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- Bản tổng kết chuyến đi hiển thị số tiền đã trả/đã chi, tổng chi phí chuyến đi và số tiền những người tham gia cần đóng góp.
- Bản tổng kết có thể hiển thị các đợt đóng góp, chẳng hạn đợt một và đợt hai.
- Người có quyền chỉnh sửa có thể đánh dấu một người tham gia là đã thanh toán, và bản tổng kết phản ánh trạng thái đó.
- Người dùng có thể chia sẻ link mở bản tổng kết chuyến đi.
- Người dùng có thể xuất bản tổng kết chuyến đi thành ảnh.
- Người có quyền chỉnh sửa có thể tải lên, thay và gỡ QR chuyển khoản của kế hoạch trong mục tổng kết; mỗi kế hoạch có tối đa một QR, của người tham gia thu tiền.
- Ảnh không có đúng một mã QR đọc được bị từ chối kèm thông báo rõ ràng.
- Ai xem được kế hoạch đều thấy QR trong mục tổng kết, kèm tên người thu tiền và thời điểm thay gần nhất, và có thể phóng to, lưu QR.
- Không mở được ảnh QR và ảnh riêng của kế hoạch nếu không có quyền xem kế hoạch, và ảnh hết hiệu lực sau khi đổi link chia sẻ.
- Thẻ preview link không bao giờ hiển thị QR; ảnh xuất tổng kết mặc định có kèm QR, và người dùng có thể bỏ ra.
- Ảnh QR tải lên không còn metadata.
- Người có quyền chỉnh sửa có thể tạm khóa tổng kết và mở khóa lại; khi tạm khóa, không thêm, sửa hay xóa được người tham gia, hoạt động, khoản chi phí và phần chia.
- Người có quyền chỉnh sửa có thể chốt tổng kết cuối cùng sau bước xác nhận; đã chốt thì không mở lại được và không sửa được nữa.
- Tổng kết hiển thị đúng trạng thái: "Tạm tính", "Tạm khóa" hoặc "Đã chốt", kèm thời điểm khóa hoặc chốt.
- Khi tạm khóa hoặc đã chốt, vẫn đánh dấu đã thanh toán, quản lý đợt đóng góp và QR chuyển khoản được.

## Edge Cases

- Kế hoạch không có người tham gia nào, hoặc khoản chi phí không có người tham gia nào được chọn.
- Khoản chi phí có số tiền bằng không, âm hoặc có hơn ba chữ số thập phân.
- Tỷ lệ bằng không, âm, bị thiếu, hoặc tổng tất cả tỷ lệ được chọn bằng không.
- Người trả tiền không nằm trong danh sách chia khoản chi phí.
- Người trả tiền hoặc một người tham gia được chọn rời kế hoạch sau khi khoản chi phí đã được tạo.
- Kế hoạch chưa có người tham gia nào khi ứng dụng hỏi "Bạn là ai?"; người dùng có thể tự thêm mình trước hoặc bỏ qua câu hỏi.
- Người tham gia đã chọn trên thiết bị sau đó ngừng hoạt động hoặc bị xóa, hoặc dữ liệu trình duyệt bị xóa; ứng dụng hỏi lại "Bạn là ai?".
- Người dùng xóa một người tham gia có xuất hiện trong các khoản chi phí trong lịch sử; người đó chuyển sang ngừng hoạt động thay vì bị xóa hẳn.
- Người dùng xóa nhầm một người tham gia chưa có khoản chi phí nào; người đó bị xóa hẳn ngay, người dùng thêm lại nếu cần.
- Người dùng muốn xóa người tham gia đại diện chủ tài khoản; ứng dụng không có thao tác xóa cho người này.
- Người dùng chỉnh sửa một khoản chi phí có người tham gia đã rời kế hoạch.
- Phần chia hoặc khoản đóng góp cuối cùng được tính ra có phần lẻ của đơn vị tiền tệ và phải tuân theo quy tắc làm tròn cuối cùng.
- Tổng các khoản đóng góp đã làm tròn lớn hơn tổng chi phí chuyến đi một chút; đây là điều bình thường, không báo lỗi.
- Người dùng xác nhận thanh toán của một người tham gia nhiều lần; hệ thống phải tránh xác nhận trùng lặp hoặc hiển thị rõ trạng thái xác nhận hiện có.
- Chuyến đi có chi phí nhưng không có đợt đóng góp nào, hoặc tổng các đợt không khớp với số tiền phải đóng. Ứng dụng phải phân biệt các bản ghi đóng góp này với chi phí chuyến đi.
- Ảnh QR tải lên không có mã QR đọc được, bị mờ, hoặc có nhiều mã QR; ảnh bị từ chối kèm thông báo rõ ràng, và QR hiện tại được giữ nguyên.
- Người có quyền chỉnh sửa thay QR bằng tài khoản ngân hàng khác; mục tổng kết hiển thị thời điểm QR được thay gần nhất, và người chuyển kiểm tra tên người nhận trong app ngân hàng trước khi chuyển.
- Người thu tiền bị xóa; người đó chuyển sang ngừng hoạt động, QR vẫn giữ kèm cảnh báo cho đến khi người có quyền chỉnh sửa thay hoặc gỡ.
- Người dùng tải QR khi kế hoạch đã có QR; ứng dụng hỏi xác nhận trước khi thay QR hiện tại.
- Địa chỉ ảnh QR được mở sau khi khóa chia sẻ bị đổi; ảnh không mở được.
- Kế hoạch có QR bị xóa hoặc hết hạn; ảnh QR cũng bị xóa theo.
- Chốt tổng kết khi còn người chưa thanh toán; được phép, việc đánh dấu đã thanh toán tiếp tục sau khi chốt.
- Người dùng muốn thêm khoản chi phí bị quên khi tổng kết đang tạm khóa; cần mở khóa trước rồi mới thêm được. Nếu tổng kết đã chốt thì không thêm được nữa.
- Mở khóa khi đã có người được đánh dấu đã thanh toán; ứng dụng cảnh báo số tiền có thể thay đổi, trạng thái đã thanh toán vẫn giữ nguyên.
- Hai người cùng muốn khóa, mở khóa hoặc chốt tổng kết; edit lock ([R8](01-ke-hoach-va-quyen-truy-cap.md)) bảo đảm chỉ một người làm được, người còn lại thấy trạng thái mới.
