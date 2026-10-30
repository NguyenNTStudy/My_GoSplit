# 02 — Người tham gia, chi phí và tổng kết

Tiền tệ của kế hoạch, người tham gia, câu hỏi "Bạn là ai?", chi phí và cách chia, làm tròn, tiền đóng, tổng kết, người thu tiền và QR chuyển khoản.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [03 Lịch trình, nơi ở và danh sách món ăn](03-lich-trinh-noi-o-mon-an.md) · [Tổng quan](README.md)

## Dữ liệu

### Tiền tệ

Danh sách tiền tệ nằm sẵn trong ứng dụng (R71); kế hoạch và hành trình chỉ lưu mã tiền tệ. Mỗi tiền tệ có:

- `code`: mã ISO 4217 gồm 3 chữ cái, ví dụ `VND`, `USD`, `JPY`.
- `name`: tên tiếng Việt và tiếng Anh, ví dụ "Đồng Việt Nam" và "Vietnamese Dong".
- `symbol`: ký hiệu ngắn, ví dụ `₫`, `$`, `¥`.
- `fractionDigits`: số chữ số lẻ; `0` với tiền tệ không có phần lẻ như `VND`, `JPY` (R18).
- `roundingStep`: bước làm tròn số tiền cuối cùng (R19).
- `countries`: các nước dùng tiền tệ này, để tìm theo tên nước (R71).
- `isPopular`: có nằm trong nhóm tiền tệ phổ biến hay không (R71).

### Người tham gia

- `participantId`: mã định danh duy nhất của người tham gia.
- `displayName`: tên người tham gia.
- `status`: đang hoạt động, hoặc ngừng hoạt động (đã rời kế hoạch) (R13).

### Tiền đóng

Tiền một người tham gia đưa cho người thu tiền (R54), ví dụ khi cả nhóm đóng trước một phần để chuẩn bị chuyến đi, và tiền người thu tiền trả lại phần dư (R75).

- `contributionId`: mã định danh duy nhất.
- `participantId`: người đóng tiền, hoặc người được trả lại.
- `kind`: đóng tiền, hoặc trả lại.
- `amount`: số tiền dương, theo R18.
- `dateTime`: ngày giờ đóng hoặc trả lại.
- `note`: ghi chú (tùy chọn), ví dụ `Đợt 1`.
- `batchId`: chung cho các khoản được ghi cùng một lần, để hiển thị thành một nhóm.
- `createdAt`: thời điểm ghi; dùng khi hai khoản trùng ngày giờ.

### QR chuyển khoản

Mỗi kế hoạch có tối đa một QR chuyển khoản, là QR của người thu tiền (R54).

- `image`: ảnh QR đã tải lên; chỉ được tải qua link của kế hoạch (R57).
- `label`: nhãn (tùy chọn), ví dụ tên ngân hàng.
- `updatedAt`: thời điểm QR được tải lên hoặc thay gần nhất; hiển thị trong mục tổng kết.

### Chi phí

- `expenseId`: mã định danh duy nhất của khoản chi phí.
- `description`: tiêu đề hoặc mô tả khoản chi phí.
- `amount`: số tiền dương, theo tiền tệ của kế hoạch; số chữ số thập phân theo R18.
- `paidByParticipantId`: người tham gia đã trả tiền; mặc định là người tạo khoản chi phí và có thể thay đổi bằng bộ chọn.
- `dateTime`: ngày giờ phát sinh chi phí.
- `notes`: ghi chú chi phí (tùy chọn).
- `activityId`: hoạt động trong lịch trình được liên kết (tùy chọn).
- `shares`: những người tham gia được chọn và hệ số tỷ lệ của họ.
- `createdAt`: thời điểm tạo; dùng khi hai khoản chi phí trùng ngày giờ ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- `hasLeftParticipantWarning`: cảnh báo được suy ra khi có người tham gia trong khoản chi phí đã rời kế hoạch.

## Quy tắc

- **R1.** Mỗi kế hoạch dùng một tiền tệ, chọn khi tạo kế hoạch (R70, R71). Mọi số tiền của kế hoạch, kể cả tổng kết và ảnh xuất tổng kết, đều theo tiền tệ này. Ứng dụng không quy đổi tiền tệ, và không kết hợp được nhiều tiền tệ trong một kế hoạch. Số tiền hiển thị kèm ký hiệu của tiền tệ (ví dụ `₫`, `$`, `¥`), chỉ có phần lẻ khi tiền tệ có phần lẻ, và được định dạng số theo ngôn ngữ đang chọn ([R28](05-ngon-ngu-va-theme.md)). Mã tiền tệ (ví dụ `USD`) hiện ở bước tạo kế hoạch và trong cài đặt kế hoạch, để không nhầm giữa các tiền tệ cùng ký hiệu.
- **R12.** Chỉ có thể chọn một người tham gia cho các khoản chi phí mới khi người đó còn đang tham gia kế hoạch.
- **R13.** Khi người có quyền chỉnh sửa xóa một người tham gia: nếu người đó có liên quan đến khoản chi phí (là người trả tiền hoặc người chia), có tiền đóng (R75) hoặc đang là người thu tiền (R54), người đó không bị xóa mà chuyển sang trạng thái ngừng hoạt động (đã rời kế hoạch). Các bản ghi chi phí được giữ nguyên, các khoản chi phí liên quan hiển thị cảnh báo (R21), và nếu người đó là người thu tiền thì tổng kết hiển thị cảnh báo cho đến khi đổi người thu tiền. Nếu người đó không liên quan đến khoản chi phí nào, chưa có tiền đóng và không phải người thu tiền, người đó bị xóa hẳn ngay, không cần xác nhận. Người tham gia đại diện chủ kế hoạch (R26) không xóa được.
- **R14.** Một khoản chi phí phải thuộc về một kế hoạch, có số tiền dương, có một người trả tiền và có ít nhất một người tham gia chia phần.
- **R15.** Người trả tiền mặc định là người tạo khoản chi phí (xem R26 và R27). Có thể thay đổi người trả tiền, và người trả tiền không bắt buộc phải nằm trong số những người chia khoản chi phí đó.
- **R16.** Phần chia chi phí được phân bổ theo tỷ lệ. Tỷ lệ mặc định cho mỗi người tham gia được chọn là `1`; người dùng có thể thay đổi. Tỷ lệ phải lớn hơn không.
- **R17.** Phần chia chưa làm tròn của một người tham gia được tính bằng `số tiền chi phí × tỷ lệ của người tham gia / tổng tỷ lệ của những người tham gia được chọn`.
- **R18.** Số tiền nhập vào theo tiền tệ của kế hoạch: tiền tệ không có phần lẻ (ví dụ `VND`, `JPY`, `KRW`) chỉ nhận số nguyên, và khi đó dấu `.` hay `,` đều được hiểu là dấu phân cách hàng nghìn (`50.000` và `50,000` đều là năm mươi nghìn); các tiền tệ khác nhận tối đa ba chữ số sau dấu thập phân. Các phép tính giữ nguyên độ chính xác và chỉ làm tròn khi đưa ra kết quả cuối cùng.
- **R19.** Số tiền cuối cùng được làm tròn đến bội số của bước làm tròn của tiền tệ: số tiền chi tiêu và số tiền còn thiếu của mỗi người (R76) được làm tròn lên, số tiền dư được làm tròn xuống. Tiền tệ có phần lẻ dùng bước `0,5` (ví dụ với `USD`: `3,11` thành `3,5`, `3,6` thành `4`, `3,5` giữ nguyên). `VND` dùng bước `1.000` (ví dụ: `79.200` thành `80.000`). Các tiền tệ không có phần lẻ khác dùng bước ghi trong danh sách tiền tệ của ứng dụng, mặc định là `1` (ví dụ: `JPY` là `10`, `KRW` là `100`). Vì vậy số tiền thu về có thể nhiều hơn số cần một chút. Ứng dụng không theo dõi phần chênh lệch này: phần đó thuộc về người thu tiền.
- **R20.** Hệ thống tính lại phần chia chi phí và số tiền của từng người trong tổng kết (R76) khi một khoản chi phí hoặc tiền đóng được tạo, chỉnh sửa hoặc xóa.
- **R21.** Nếu một khoản chi phí có người tham gia sau đó rời kế hoạch, khoản chi phí đó được giữ nguyên và hiển thị cảnh báo cho người có quyền chỉnh sửa. Việc chỉnh sửa khoản chi phí như vậy cần một thao tác riêng có xác nhận và sẽ tính lại các phần chia bị ảnh hưởng.
- **R23.** Không có thao tác đánh dấu đã thanh toán riêng: một người đã đóng đủ khi số đã đóng không nhỏ hơn số chi tiêu (R76). Trong tổng kết, người có quyền chỉnh sửa bấm vào một người còn thiếu để ghi "Đã đóng đủ", tức một khoản đóng bằng đúng số còn thiếu; hoặc bấm vào một người dư để ghi "Đã trả lại", tức một khoản trả lại bằng đúng số dư. Tiền đóng tách biệt với khoản chi phí và không được tính vào chi tiêu của chuyến đi.
- **R25.** Một khoản chi phí có thể được liên kết với một hoạt động trong lịch trình. Ngày giờ của khoản chi phí có thể được hiển thị cùng với mục tương ứng trong lịch trình. Xóa hoạt động thì xóa luôn các khoản chi phí gắn với nó ([R58](03-lich-trinh-noi-o-mon-an.md)).
- **R26.** Khi tạo kế hoạch, chủ kế hoạch được tự động thêm thành người tham gia, với tên là tên hiển thị của tài khoản ([R78](01-ke-hoach-va-quyen-truy-cap.md)). Trên các thiết bị chủ kế hoạch đã đăng nhập, ứng dụng dùng người tham gia này mà không cần hỏi. Người tham gia này không xóa được (R13).
- **R27.** Lần đầu một người chỉnh sửa kế hoạch trên một thiết bị, ứng dụng hỏi "Bạn là ai?" và người dùng chọn tên mình trong danh sách người tham gia đang hoạt động. Lựa chọn được lưu trên thiết bị đó và có thể đổi sau. Lựa chọn này được dùng làm người trả tiền mặc định cho các khoản chi phí mới. Người dùng có thể bỏ qua câu hỏi (ví dụ: người tổ chức nhưng không đi cùng); nếu không chọn, phải chọn người trả tiền cho từng khoản chi phí.
- **R54.** Mỗi kế hoạch có một người thu tiền: người tham gia giữ tiền đóng (R75), nhận số còn thiếu và trả lại số dư cho mọi người (R76). Mặc định là người tham gia đại diện chủ kế hoạch (R26); người có quyền chỉnh sửa đổi được trong mục tổng kết. Trong mục tổng kết, người có quyền chỉnh sửa có thể tải lên một mã QR chuyển khoản ngân hàng của người thu tiền để mọi người quét và chuyển tiền, kèm nhãn tùy chọn, ví dụ tên ngân hàng. Mỗi kế hoạch có tối đa một QR; tải QR mới sẽ thay QR hiện tại sau khi xác nhận. Đổi người thu tiền thì QR hiện tại bị gỡ sau khi xác nhận, vì QR thuộc tài khoản ngân hàng của người cũ. Tải lên, thay và gỡ QR cần quyền chỉnh sửa như các thao tác chỉnh sửa khác. Ứng dụng chỉ hiển thị QR: không xử lý thanh toán, và tiền đóng vẫn do người có quyền chỉnh sửa tự ghi (R23, R75).
- **R55.** Ảnh QR có thể là JPG, PNG, WebP hoặc HEIC, tối đa 5 MB. Ứng dụng kiểm tra ảnh có đúng một mã QR đọc được, và xóa metadata trước khi lưu. Ứng dụng nhắc người tải rằng ai xem được kế hoạch cũng thấy QR.
- **R56.** Ai xem được kế hoạch đều thấy QR trong mục tổng kết, kèm tên người thu tiền và thời điểm QR được thay gần nhất. Bấm vào QR thì ảnh QR hiện lớn để dễ quét; bấm nút đóng hoặc bấm ra ngoài để quay lại. Ứng dụng nhắc người chuyển kiểm tra tên người nhận trong app ngân hàng trước khi chuyển. QR không chứa số tiền: người chuyển tự nhập số tiền, dựa theo số còn thiếu hiển thị trong tổng kết.
- **R57.** Ảnh QR và ảnh riêng của kế hoạch ([R30](05-ngon-ngu-va-theme.md)) chỉ được gửi cho người mở được kế hoạch, và địa chỉ ảnh hết hiệu lực khi khóa chia sẻ bị đổi ([R3](01-ke-hoach-va-quyen-truy-cap.md)). QR không bao giờ xuất hiện trong thẻ preview link ([R51](06-bao-mat-du-lieu.md)). Ảnh xuất tổng kết mặc định có kèm QR, và người dùng có thể bỏ ra. Ảnh QR bị xóa cùng với kế hoạch.
- **R59.** Tổng kết có ba trạng thái:
  - **Đang mở** (mặc định): tổng kết hiển thị "Tạm tính" và được tính lại mỗi khi dữ liệu thay đổi (R20). Người có quyền chỉnh sửa thêm, sửa và xóa người tham gia, hoạt động và khoản chi phí như bình thường, kể cả tên lẫn thông tin.
  - **Tạm khóa**: không thể thêm, sửa hay xóa người tham gia, hoạt động ([R58](03-lich-trinh-noi-o-mon-an.md)), khoản chi phí hay phần chia; tổng kết hiển thị "Tạm khóa" kèm thời điểm khóa. Người có quyền chỉnh sửa có thể mở khóa để quay về Đang mở. Nếu đã có tiền đóng, ứng dụng cảnh báo trước khi mở khóa vì số tiền của từng người có thể thay đổi; tiền đóng đã ghi vẫn giữ nguyên.
  - **Đã chốt**: khóa như Tạm khóa nhưng không mở lại được. Chốt được từ Đang mở hoặc Tạm khóa, sau một bước xác nhận nói rõ là không hoàn tác được. Tổng kết hiển thị "Đã chốt" kèm thời điểm chốt.

  Khi Tạm khóa hoặc Đã chốt, ghi tiền đóng và trả lại (R23, R75), đổi người thu tiền và QR chuyển khoản (R54) vẫn dùng được. Tạm khóa, mở khóa và chốt cần quyền chỉnh sửa như các thao tác chỉnh sửa khác.

- **R70.** Khi tạo kế hoạch, ứng dụng chọn sẵn tiền tệ theo thứ tự: tiền tệ của kế hoạch gần nhất mà chủ kế hoạch đã tạo; nếu chưa có kế hoạch nào, tiền tệ của vùng trong cài đặt ngôn ngữ của trình duyệt (ví dụ `vi-VN` là `VND`, `en-SG` là `SGD`); nếu trình duyệt không có vùng hoặc vùng không có trong danh sách, theo ngôn ngữ đang dùng: tiếng Việt là `VND`, tiếng Anh là `USD`. Khi sao chép hành trình, tiền tệ được điền sẵn theo hành trình ([R68](07-chia-se-hanh-trinh.md)). Người dùng đổi được tiền tệ trước khi tạo kế hoạch.
- **R71.** Danh sách tiền tệ nằm sẵn trong ứng dụng, gồm các tiền tệ đang lưu hành theo ISO 4217. Bộ chọn tiền tệ có ô tìm kiếm: tìm theo mã (`JPY`), tên tiền tệ bằng tiếng Việt hoặc tiếng Anh (`yên`, `yen`), tên nước (`Nhật`, `Japan`) hoặc ký hiệu (`¥`), không phân biệt dấu và hoa thường. Khi chưa gõ gì, bộ chọn hiện các tiền tệ đã dùng trong những kế hoạch gần đây của tài khoản (nếu có), rồi nhóm tiền tệ phổ biến (`VND`, `USD`, `EUR`, `THB`, `JPY`, `KRW`, `SGD`, `CNY`), rồi toàn bộ danh sách theo chữ cái. Mỗi dòng hiện ký hiệu, mã, tên tiền tệ và nước dùng tiền tệ đó.
- **R72.** Người có quyền chỉnh sửa đổi được tiền tệ trong cài đặt kế hoạch khi kế hoạch chưa có khoản chi phí hay tiền đóng nào và tổng kết đang mở. Ngoài trường hợp đó, tiền tệ bị khóa kèm lời giải thích, vì ứng dụng không quy đổi số tiền đã nhập. Tiền tệ bị bỏ khỏi danh sách sau này (ví dụ khi một nước đổi tiền) vẫn được giữ và hiển thị đúng ở các kế hoạch đã dùng, nhưng không chọn được nữa.
- **R75.** Người có quyền chỉnh sửa ghi lại tiền đóng của từng người, ví dụ khi cả nhóm đóng trước một phần để chuẩn bị chuyến đi. Màn hình Chi phí có hai danh sách: Khoản chi và Tiền đóng, mỗi danh sách hiện tổng số tiền; tiền đóng xếp theo ngày giờ tăng dần ([R60](01-ke-hoach-va-quyen-truy-cap.md)), các khoản ghi cùng một lần hiện thành một nhóm. Nút "Ghi tiền đóng" mở form nhanh: chọn ngày giờ, ghi chú tùy chọn (ví dụ `Đợt 1`), tích những người đóng (mặc định là mọi người tham gia đang hoạt động; người đã rời kế hoạch vẫn chọn được, ví dụ để ghi số còn thiếu của họ), và chọn một trong hai cách: **Cùng số tiền** (nhập một số tiền, mỗi người được tích đóng số tiền đó) hoặc **Mỗi người một số** (nhập số tiền riêng cho từng người được tích). Form hiện tổng số tiền trước khi lưu. Mỗi người được tích thành một khoản tiền đóng riêng, sửa hoặc xóa được từng khoản. Tiền đóng là tiền đưa cho người thu tiền (R54), kể cả khi người thu tiền tự ghi tiền đóng của chính mình.
- **R76.** Tổng kết hiển thị cho từng người tham gia: **chi tiêu** là tổng phần chia của người đó (R17); **đã đóng** là tiền đóng của người đó trừ tiền đã được trả lại, cộng các khoản chi phí người đó tự trả (R15); và hiệu của hai số: **còn thiếu** khi chi tiêu lớn hơn đã đóng, **dư** khi đã đóng lớn hơn chi tiêu, hoặc **đủ**. Mỗi người hiện thành hai hàng: hàng trên là biểu tượng đã đóng đủ hay chưa, tên, và số chi tiêu; hàng dưới là số đã đóng, và số còn thiếu (màu đỏ) hoặc số dư (màu xanh lá), chỉ có số tiền, không kèm chữ; đủ thì để trống ([R77](05-ngon-ngu-va-theme.md)). Đầu tổng kết hiện tổng chi phí, số người đã đóng đủ (xanh lá) và số người còn thiếu (đỏ), và số tiền đóng người thu tiền đang giữ. Người thu tiền thu số còn thiếu và trả lại số dư cho từng người.

## Acceptance Criteria

### Tiền tệ

- Người dùng chọn một tiền tệ khi tạo kế hoạch; tiền tệ được chọn sẵn theo kế hoạch gần nhất, vùng của trình duyệt, rồi ngôn ngữ.
- Tìm `nhat`, `yen` hay `JPY` đều ra Yên Nhật; tìm `viet nam` ra Đồng Việt Nam.
- Mọi số tiền của kế hoạch hiển thị theo tiền tệ đã chọn, kèm ký hiệu, và chỉ có phần lẻ khi tiền tệ có phần lẻ.
- Người có quyền chỉnh sửa đổi được tiền tệ khi kế hoạch chưa có khoản chi phí hay tiền đóng nào và tổng kết đang mở; ngoài trường hợp đó thì không đổi được, kèm lời giải thích.

### Người tham gia và phân quyền

- Người có quyền chỉnh sửa có thể thêm người tham gia và cập nhật tên hiển thị của họ.
- Khi tạo kế hoạch, chủ kế hoạch xuất hiện trong danh sách người tham gia.
- Lần đầu chỉnh sửa kế hoạch trên một thiết bị, ứng dụng hỏi người dùng là ai trong danh sách người tham gia đang hoạt động; lựa chọn được ghi nhớ trên thiết bị đó, có thể đổi hoặc bỏ qua.
- Khoản chi phí mới dùng người tham gia đã chọn trên thiết bị làm người trả tiền mặc định.
- Xóa người tham gia có liên quan đến khoản chi phí, có tiền đóng hoặc đang là người thu tiền thì người đó chuyển sang ngừng hoạt động; các bản ghi giữ nguyên, khoản chi phí liên quan hiển thị cảnh báo.
- Xóa người tham gia không liên quan đến khoản chi phí hay tiền đóng nào thì người đó bị xóa hẳn ngay, không cần xác nhận.
- Không xóa được người tham gia đại diện chủ kế hoạch.
- Người tham gia đã rời kế hoạch không thể được chọn để chia các khoản chi phí mới.
- Các khoản chi phí có người tham gia đã rời kế hoạch sẽ hiển thị cảnh báo cho người có quyền chỉnh sửa.
- Chỉ người có quyền chỉnh sửa mới ghi, sửa và xóa được tiền đóng.
- Tiền đóng không làm tăng chi tiêu chuyến đi hay tổng chi phí.

### Chi phí và tổng kết

- Người dùng có thể thêm, chỉnh sửa và xóa một khoản chi phí với mô tả, số tiền dương, người trả tiền, ngày/giờ và ít nhất một người tham gia được chọn.
- Người trả tiền mặc định là người tạo khoản chi phí và có thể đổi sang người tham gia khác; người trả tiền không bắt buộc phải chia khoản chi phí đó.
- Mỗi người tham gia được chọn bắt đầu với tỷ lệ `1`; người dùng có thể nhập một tỷ lệ dương khác.
- Hệ thống phân bổ khoản chi phí theo tỷ lệ đã chọn và giữ nguyên độ chính xác tính toán cho đến kết quả cuối cùng.
- Số tiền nhập vào không dương, có phần lẻ khi tiền tệ không có phần lẻ, hoặc có hơn ba chữ số thập phân sẽ bị từ chối kèm thông báo kiểm tra hợp lệ rõ ràng.
- Số chi tiêu và số còn thiếu được làm tròn lên, số dư được làm tròn xuống, theo bước làm tròn của tiền tệ (ví dụ: với `USD`, `3,11` thành `3,5`; với `VND`, `79.200` thành `80.000`); phần chênh lệch so với tổng chi phí không được ghi nhận riêng.
- Chỉnh sửa hoặc xóa một khoản chi phí sẽ cập nhật các tổng số và kết quả liên quan.
- Danh sách khoản chi phí hiển thị theo ngày giờ tăng dần, xem được theo "Tất cả" hoặc từng ngày ([R60](01-ke-hoach-va-quyen-truy-cap.md)).
- Người có quyền chỉnh sửa ghi được tiền đóng cho nhiều người cùng lúc, theo cùng một số tiền hoặc mỗi người một số; các khoản ghi cùng lúc hiện thành một nhóm trong danh sách Tiền đóng, sửa và xóa được từng khoản.
- Bản tổng kết hiển thị tổng chi phí, số người đã đóng đủ, số tiền người thu tiền đang giữ, và cho từng người: chi tiêu, đã đóng, và số còn thiếu hoặc dư.
- Ghi "Đã đóng đủ" hoặc "Đã trả lại" ở một người thì tạo một khoản bằng đúng số còn thiếu hoặc số dư, và người đó chuyển sang đủ.
- Người dùng có thể chia sẻ link mở bản tổng kết chuyến đi.
- Người dùng có thể xuất bản tổng kết chuyến đi thành ảnh.
- Người thu tiền mặc định là chủ kế hoạch và đổi được trong mục tổng kết; đổi người thu tiền thì QR hiện tại bị gỡ sau khi xác nhận.
- Người có quyền chỉnh sửa có thể tải lên, thay và gỡ QR chuyển khoản của người thu tiền trong mục tổng kết; mỗi kế hoạch có tối đa một QR.
- Ảnh không có đúng một mã QR đọc được bị từ chối kèm thông báo rõ ràng.
- Ai xem được kế hoạch đều thấy QR trong mục tổng kết, kèm tên người thu tiền và thời điểm thay gần nhất; bấm vào QR thì ảnh hiện lớn.
- Không mở được ảnh QR và ảnh riêng của kế hoạch nếu không có quyền xem kế hoạch, và ảnh hết hiệu lực sau khi đổi link chia sẻ.
- Thẻ preview link không bao giờ hiển thị QR; ảnh xuất tổng kết mặc định có kèm QR, và người dùng có thể bỏ ra.
- Ảnh QR tải lên không còn metadata.
- Người có quyền chỉnh sửa có thể tạm khóa tổng kết và mở khóa lại; khi tạm khóa, không thêm, sửa hay xóa được người tham gia, hoạt động, khoản chi phí và phần chia.
- Người có quyền chỉnh sửa có thể chốt tổng kết cuối cùng sau bước xác nhận; đã chốt thì không mở lại được và không sửa được nữa.
- Tổng kết hiển thị đúng trạng thái: "Tạm tính", "Tạm khóa" hoặc "Đã chốt", kèm thời điểm khóa hoặc chốt.
- Khi tạm khóa hoặc đã chốt, vẫn ghi tiền đóng, trả lại tiền dư, đổi người thu tiền và quản lý QR chuyển khoản được.

## Edge Cases

- Kế hoạch không có người tham gia nào, hoặc khoản chi phí không có người tham gia nào được chọn.
- Khoản chi phí có số tiền bằng không, âm, có hơn ba chữ số thập phân, hoặc có phần lẻ khi tiền tệ không có phần lẻ.
- Tỷ lệ bằng không, âm, bị thiếu, hoặc tổng tất cả tỷ lệ được chọn bằng không.
- Người trả tiền không nằm trong danh sách chia khoản chi phí.
- Người trả tiền hoặc một người tham gia được chọn rời kế hoạch sau khi khoản chi phí đã được tạo.
- Kế hoạch chưa có người tham gia nào khi ứng dụng hỏi "Bạn là ai?"; người dùng có thể tự thêm mình trước hoặc bỏ qua câu hỏi.
- Người tham gia đã chọn trên thiết bị sau đó ngừng hoạt động hoặc bị xóa, hoặc dữ liệu trình duyệt bị xóa; ứng dụng hỏi lại "Bạn là ai?".
- Người dùng xóa một người tham gia có xuất hiện trong các khoản chi phí trong lịch sử; người đó chuyển sang ngừng hoạt động thay vì bị xóa hẳn.
- Người dùng xóa nhầm một người tham gia chưa có khoản chi phí nào; người đó bị xóa hẳn ngay, người dùng thêm lại nếu cần.
- Người dùng muốn xóa người tham gia đại diện chủ kế hoạch; ứng dụng không có thao tác xóa cho người này.
- Người dùng chỉnh sửa một khoản chi phí có người tham gia đã rời kế hoạch.
- Phần chia, số còn thiếu hoặc số dư được tính ra không phải bội số của bước làm tròn của tiền tệ và phải tuân theo quy tắc làm tròn cuối cùng (R19).
- Tổng số chi tiêu đã làm tròn lớn hơn tổng chi phí chuyến đi một chút; đây là điều bình thường, không báo lỗi.
- Người dùng bấm "Đã đóng đủ" hai lần cho cùng một người; chỉ một khoản được ghi, vì sau lần đầu người đó đã đủ và không còn thao tác này.
- Cả nhóm đã đóng trước nhưng chưa có khoản chi phí nào; mỗi người hiện dư đúng bằng số đã đóng, vì tổng kết còn tạm tính.
- Cả nhóm đóng trước nhiều hơn tổng chi; mọi người dư, và tổng số dư bằng số người thu tiền đang giữ (trừ chênh lệch do làm tròn).
- Một người tự trả một khoản chi phí lớn, ví dụ tiền phòng, và không đóng tiền; số đã đóng của người đó gồm khoản chi phí này, nên người đó có thể dư.
- Người thu tiền tự ghi tiền đóng của chính mình; được phép, và được tính vào số đã đóng của người đó như mọi người.
- Ghi tiền đóng theo cách Mỗi người một số nhưng để trống số tiền của một người đã tích; form báo cần nhập số tiền cho người đó hoặc bỏ tích, không ghi khoản bằng không.
- Đổi người thu tiền khi đã có tiền đóng; tiền đóng giữ nguyên, ứng dụng nhắc người thu tiền cũ chuyển số tiền đang giữ cho người mới.
- Ảnh QR tải lên không có mã QR đọc được, bị mờ, hoặc có nhiều mã QR; ảnh bị từ chối kèm thông báo rõ ràng, và QR hiện tại được giữ nguyên.
- Người có quyền chỉnh sửa thay QR bằng tài khoản ngân hàng khác; mục tổng kết hiển thị thời điểm QR được thay gần nhất, và người chuyển kiểm tra tên người nhận trong app ngân hàng trước khi chuyển.
- Người thu tiền bị xóa; người đó chuyển sang ngừng hoạt động, tổng kết và QR hiển thị cảnh báo cho đến khi người có quyền chỉnh sửa đổi người thu tiền.
- Người dùng tải QR khi kế hoạch đã có QR; ứng dụng hỏi xác nhận trước khi thay QR hiện tại.
- Địa chỉ ảnh QR được mở sau khi khóa chia sẻ bị đổi; ảnh không mở được.
- Kế hoạch có QR bị xóa; ảnh QR cũng bị xóa theo.
- Chốt tổng kết khi còn người còn thiếu hoặc dư; được phép, việc ghi tiền đóng và trả lại tiếp tục sau khi chốt.
- Người dùng muốn thêm khoản chi phí bị quên khi tổng kết đang tạm khóa; cần mở khóa trước rồi mới thêm được. Nếu tổng kết đã chốt thì không thêm được nữa.
- Mở khóa khi đã có tiền đóng; ứng dụng cảnh báo số tiền có thể thay đổi, tiền đóng đã ghi vẫn giữ nguyên, và một người đang đủ có thể chuyển lại thành còn thiếu nếu chi phí tăng.
- Hai người cùng muốn khóa, mở khóa hoặc chốt tổng kết; edit lock ([R8](01-ke-hoach-va-quyen-truy-cap.md)) bảo đảm chỉ một người làm được, người còn lại thấy trạng thái mới.
- Kế hoạch dùng `VND`, người dùng gõ `50.000` hoặc `50,000`; cả hai là năm mươi nghìn đồng. Gõ `50,5` thì bị từ chối kèm thông báo, không bao giờ bị hiểu thành một số tiền khác.
- Chia `100.000 ₫` cho 3 người; mỗi phần chưa làm tròn là `33.333,33…`, được làm tròn lên `34.000 ₫`, tổng `102.000 ₫` lớn hơn tổng chi một chút, không báo lỗi.
- Người dùng muốn đổi tiền tệ sau khi đã nhập khoản chi phí; ô tiền tệ bị khóa, kèm lời giải thích rằng số tiền đã nhập không được quy đổi.
- Trình duyệt không có vùng, hoặc vùng không có trong danh sách; tiền tệ được chọn sẵn theo ngôn ngữ đang dùng.
- Tìm một nước dùng chung tiền tệ với nhiều nước (ví dụ `Pháp` ra `EUR`), hoặc một ký hiệu dùng chung (`$` ra `USD`, `SGD`, `AUD`…); kết quả hiện đủ các tiền tệ khớp, mỗi dòng có mã để phân biệt.
- Tìm không ra tiền tệ nào; bộ chọn hiện thông báo ngắn và giữ tiền tệ đang chọn.
