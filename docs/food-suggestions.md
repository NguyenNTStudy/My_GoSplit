# Ý tưởng tính năng: Danh sách món ăn và Gợi ý quán ăn

Trạng thái: đang lên ý tưởng. Giao diện sẽ thiết kế lại sau.

Tính năng không dùng AI và làm theo 2 giai đoạn:

1. **MVP — danh sách món của nhóm:** mỗi plan có danh sách món ăn cho từng ngày, theo bữa sáng, trưa, chiều, tối. Nhóm tự nhập.
2. **Gợi ý quán ăn từ cộng đồng:** người địa phương đăng danh sách món ăn kèm quán và link quán. Người đi du lịch tìm theo điểm đến rồi áp dụng danh sách đó vào plan của mình.

Requirements liên quan: rule 31–33 và mục "Dự kiến sau MVP" trong [requirements.vi.md](requirements.vi.md).

## Giai đoạn 1 — MVP: danh sách món của nhóm

**Phạm vi** (rule 31–33):

- Plan có một hoặc nhiều nơi ở; mỗi nơi ở có khu vực, mã quốc gia và ngày nhận/trả phòng.
- Mỗi ngày có danh sách món chia 4 bữa. Mỗi món gồm tên món (bắt buộc), quán ăn, link bản đồ và ghi chú (tùy chọn).
- Người có quyền chỉnh sửa thêm, sửa, sắp xếp, xóa món; ai có link đều xem được.
- Đầu mỗi ngày hiện nơi ở đêm đó.

**Chuẩn bị sẵn cho giai đoạn 2:**

- **Chuẩn hóa khu vực (đề xuất làm ngay từ MVP).**
  - Lý do: tìm kiếm theo điểm đến chỉ chạy đúng khi cùng một nơi luôn có cùng một mã. Nếu khu vực là chữ gõ tự do, "Đà Lạt", "Da Lat" và "Dalat" sẽ thành ba nơi khác nhau.
  - Cách làm: khi nhập nơi ở, người dùng chọn thành phố từ một danh sách có sẵn (ví dụ bộ dữ liệu miễn phí GeoNames); app lưu `areaId` kèm tên hiển thị. Không tìm thấy thì vẫn cho gõ tự do.
- Màn "Ăn gì" chừa chỗ cho lối vào Gợi ý quán ăn (ẩn trong MVP).

## Giai đoạn 2 — Gợi ý quán ăn từ cộng đồng

### Ý tưởng chính

**Ai đăng:** người dùng đã đăng nhập, chủ yếu là người địa phương. Khi đăng, tác giả có thể đánh dấu "Tôi sống ở đây"; danh sách khi đó có huy hiệu **Người địa phương** (do tác giả tự khai báo).

**Một danh sách gồm:**

- Tiêu đề, ví dụ "Ăn gì ở Đà Lạt — người Đà Lạt chỉ".
- Khu vực, chọn từ danh sách thành phố.
- Mô tả ngắn và ngôn ngữ viết.
- Các mục. Mỗi mục có:

| Thông tin | Bắt buộc | Ví dụ |
|---|---|---|
| Tên món | Có | Bánh căn |
| Tên quán | Có | Bánh căn Nhà Chung |
| Link quán | Có | Link Google Maps của quán |
| Bữa phù hợp | Không | Sáng |
| Ghi chú | Không | Khoảng 30.000đ/phần, mở 6h–10h |

**Cách tạo:** tác giả tạo trực tiếp trong mục Gợi ý quán ăn, hoặc tạo nhanh từ danh sách món của một plan. Khi tạo từ plan, app chỉ lấy món, quán, link và ghi chú; không lấy tên người tham gia, chi phí hay thông tin khác của plan.

**Danh sách độc lập với plan:** sửa plan không làm đổi danh sách đã đăng. Tác giả sửa hoặc gỡ danh sách được bất cứ lúc nào.

### Tìm kiếm và áp dụng vào plan

1. **Tìm:**
   - Vào mục Gợi ý quán ăn và gõ điểm đến; app gợi ý tên thành phố khi gõ.
   - Nếu đang mở một plan, app hiện sẵn các khu vực nơi ở của plan để chọn nhanh.
2. **Xem kết quả:**
   - Sắp theo lượt "Hữu ích", lượt được áp dụng và độ mới.
   - Lọc được theo bữa và ngôn ngữ.
   - Danh sách của người địa phương có huy hiệu riêng.
3. **Xem một danh sách:** thấy món và quán, mở link quán để xem trên bản đồ.
4. **Áp dụng vào plan** (người có quyền chỉnh sửa plan):
   - Đang ở ngoài plan thì chọn plan trước.
   - Chọn cả danh sách hoặc từng mục.
   - Các mục được đưa vào nhóm **Chưa xếp ngày** trong danh sách món của plan, giữ nguyên tên món, quán, link và bữa. Sau đó nhóm kéo từng món vào ngày cụ thể. Khi thêm từng mục lẻ, cũng có thể chọn thẳng ngày và bữa.
   - Mục đã áp dụng là bản sao: tác giả sửa danh sách gốc sau đó không làm đổi plan.

### Vị trí trong app (thiết kế UI sau)

- **Mục riêng "Gợi ý quán ăn"** bên cạnh mục "Kế hoạch" ở màn hình chính. Nhờ vậy người dùng tìm được quán ăn cả khi chưa tạo plan.
- **Trong plan:** có lối vào Gợi ý quán ăn cho các khu vực nơi ở của plan. Để thanh tab trên điện thoại không quá chật, có thể gộp với "Ăn gì" thành một mục "Ăn uống" gồm hai phần: "Của nhóm" và "Gợi ý quán". Chốt khi thiết kế UI.

### Ai được làm gì

| Thao tác | Ai được làm |
|---|---|
| Tìm và xem danh sách | Mọi người, kể cả chưa đăng nhập |
| Áp dụng vào plan | Người có quyền chỉnh sửa plan đó |
| Đăng danh sách, bấm "Hữu ích" | Người đã đăng nhập |
| Báo cáo | Mọi người, có rate limit theo IP |

Lý do bắt buộc đăng nhập mới được đăng: để biết ai đăng khi cần xử lý spam hay quảng cáo, và để tác giả sửa hoặc gỡ danh sách về sau.

### Chống spam và quảng cáo

Danh sách có tên quán và link nên dễ bị dùng để quảng cáo. Các biện pháp:

- **Link quán:** chỉ nhận link bản đồ (Google Maps, Apple Maps, OpenStreetMap). Không nhận link trang bán hàng hay khuyến mãi.
- **Báo cáo có lý do:** quảng cáo, sai thông tin, quán đã đóng cửa, nội dung không phù hợp.
- **Tự ẩn:** danh sách bị 3 người khác nhau báo cáo sẽ tự ẩn, chờ admin xem.
- **Trang admin:** xem danh sách bị báo cáo, khôi phục hoặc gỡ, khóa tài khoản spam.
- **Giới hạn đăng:** mỗi tài khoản tối đa 5 danh sách mỗi ngày; lọc từ ngữ thô tục cơ bản.
- **Ngày cập nhật:** danh sách hiện "Cập nhật lần cuối" để người xem biết thông tin còn mới hay đã cũ.

### Thay đổi dữ liệu

- **`FoodGuide`** (danh sách): tác giả, tiêu đề, mô tả, `areaId`, mã quốc gia, ngôn ngữ, có phải người địa phương không, trạng thái (`published`, `hidden`, `removed`), lượt hữu ích, lượt áp dụng, thời điểm tạo và cập nhật.
- **`FoodGuideEntry`** (mục): thuộc danh sách nào, tên món, tên quán, link quán, bữa phù hợp, ghi chú, thứ tự.
- **`GuideVote`:** ai đã bấm "Hữu ích".
- **`GuideReport`:** lý do, người báo cáo hoặc IP, thời điểm.
- **FoodItem** (món trong plan):
  - `date` được phép trống, để làm nhóm "Chưa xếp ngày".
  - Thêm `source` (`manual` hoặc `guide`) và mã danh sách gốc, dùng để đếm lượt áp dụng.

### Khởi động khi chưa có dữ liệu

- Trước khi mở tính năng, team và người quen ở các thành phố đăng sẵn danh sách cho khoảng 20–30 điểm đến phổ biến.
- Nơi chưa có danh sách: hiện trạng thái trống và mời người địa phương đăng danh sách đầu tiên.

### Pháp lý

- Điều khoản sử dụng cho nội dung người dùng đăng: quyền hiển thị, quyền gỡ nội dung vi phạm.
- Ghi rõ thông tin quán do người dùng cung cấp, app không bảo đảm tính chính xác.
- Người dùng đồng ý điều khoản khi đăng lần đầu.

### Chỉ số đánh giá

- Số danh sách đã đăng và số khu vực có ít nhất một danh sách.
- Số lượt tìm kiếm và lượt áp dụng vào plan.
- Tỷ lệ danh sách bị báo cáo.

### Cần chốt

- **Chuẩn hóa khu vực ngay từ MVP.** Đề xuất: có, vì tìm kiếm theo điểm đến phụ thuộc vào nó.
- **Loại link quán:** chỉ link bản đồ, hay cho thêm trang Facebook hoặc website của quán.
- **Vị trí trong plan:** tab riêng, hay gộp với "Ăn gì" thành mục "Ăn uống".
- **Hiển thị tác giả:** tên tài khoản hay biệt danh; có trang hồ sơ tác giả không.
- **Chủ quán tự đăng:** cho phép nhưng phải ghi rõ, hay không cho phép.

## Ý tưởng sau đó

- Trang "Quán được nhắc đến nhiều nhất" của mỗi khu vực, gộp từ nhiều danh sách.
- Theo dõi các tác giả địa phương mình thích.
- Ảnh món ăn trong danh sách (cần thêm kiểm duyệt ảnh).
- Bình luận hoặc hỏi tác giả về quán.
- Đánh dấu món "đã ăn" và chấm điểm.
- Liên kết món ăn với khoản chi phí.
