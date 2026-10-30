# Thiết kế — Thành viên có tài khoản và chiêu mộ bạn đồng hành

**Trạng thái:** cả hai phần đều nằm trong MVP. Quy tắc chi tiết ở requirements; file này giải thích vì sao thiết kế như vậy, để giữ đúng hướng khi mở rộng sau này.

| Phần | Quy tắc | Data model | Wireframe |
|---|---|---|---|
| Thành viên có tài khoản | [R84, R85](../requirements/01-ke-hoach-va-quyen-truy-cap.md) | PlanMember, PlanInvite ([01](../data-model/01-ke-hoach.md)) | G01, G05, G05b, A05, GD1, GD22, GD28, GD29 |
| Chiêu mộ bạn đồng hành | [R86–R92](../requirements/08-chieu-mo.md) | RecruitPost, JoinRequest, … ([04](../data-model/04-chieu-mo.md)) | K06, K07, K07b, G05c–G05g, GD18, GD30–GD34, GD50 |

## Nguyên tắc

1. **Kế hoạch vẫn riêng tư.**
   - Thứ được công khai là **tin chiêu mộ**, một bản ghi riêng, giống cách hành trình là bản sao công khai của kế hoạch (R64).
   - Tin đọc điểm đến, ngày và lịch trình từ kế hoạch, nhưng không bao giờ chứa link, khóa chia sẻ, tên người tham gia hay chi phí.
   - Nhờ vậy R46 ("kế hoạch không bao giờ được liệt kê công khai") vẫn đúng.
2. **Quyền theo tài khoản độc lập với passcode.** Có ba nguồn quyền:
   - Link chia sẻ: xem.
   - Passcode trên thiết bị: sửa, chỉ trên thiết bị đó.
   - Vai trò thành viên của tài khoản.

   Quyền thực tế là mức cao nhất trong ba nguồn. Nhập passcode không đổi vai trò của tài khoản (R84). Người không có tài khoản vẫn dùng link và passcode như trước.
3. **Người tham gia khác thành viên.** Người tham gia là một cái tên trong việc chia tiền, không cần tài khoản. Thành viên là một tài khoản gắn với đúng một người tham gia. Rời hoặc bị gỡ chỉ bỏ tư cách thành viên; tên trong chi phí và tổng kết giữ nguyên.
4. **Ứng dụng không làm trung gian liên lạc.**
   - Không có chat.
   - Người xin đi cùng để lại thông tin liên hệ; chủ kế hoạch tự chọn cách liên hệ; mọi trao đổi sau đó diễn ra ngoài ứng dụng.
   - Vì không có chat nên không cần kiểm duyệt tin nhắn, không cần thông báo theo thời gian thực, và dữ liệu cá nhân lưu ít hơn.
5. **Thông tin liên hệ là dữ liệu nhạy cảm nhất.**
   - Chỉ chủ kế hoạch đọc được, admin cũng không.
   - Mã hóa ở tầng ứng dụng, mỗi lần xem đều ghi log.
   - Tự xóa 30 ngày sau khi yêu cầu có kết quả (R91).

## Vai trò và quyền

| Thao tác | Có link | Có passcode (trên thiết bị) | Thành viên Xem | Thành viên Sửa | Chủ kế hoạch |
|---|---|---|---|---|---|
| Xem kế hoạch | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sửa (theo edit lock R8, trạng thái tổng kết R59) | | ✓ | | ✓ | ✓ |
| Kế hoạch hiện trong danh sách của mình | | | ✓ | ✓ | ✓ |
| Vẫn mở được sau khi đổi khóa chia sẻ hoặc passcode | | | ✓ | ✓ | ✓ |
| Rời kế hoạch | | | ✓ | ✓ | |
| Mời, đổi vai trò, gỡ thành viên | | | | | ✓ |
| Đăng, sửa, ngừng và chiêu mộ lại; duyệt yêu cầu; chặn người gửi | | | | | ✓ |
| Đổi passcode, xóa kế hoạch, chia sẻ hành trình | | | | | ✓ |

Server dùng **một hàm phân quyền duy nhất** trong `src/domain`. Hàm đọc vai trò thành viên của tài khoản, phiên passcode của thiết bị và khóa chia sẻ, rồi trả về quyền thực tế. Mọi API và server action đều gọi hàm này, và hàm có test theo đúng bảng trên.

## Hai cách trở thành thành viên

| | Link mời (R85) | Duyệt yêu cầu xin đi cùng (R89) |
|---|---|---|
| Ai khởi động | Chủ kế hoạch | Người muốn đi cùng |
| Người tham gia | Đã có sẵn trong kế hoạch | Được tạo mới theo tên hiển thị |
| Quyền | Chủ kế hoạch chọn khi tạo link | Chủ kế hoạch chọn khi duyệt (mặc định Xem) |
| `PlanMember.joinedVia` | `invite` | `request` |

Cả hai cách đều tạo cùng một dòng PlanMember, nên sau khi vào nhóm, thành viên được đối xử giống nhau.

## Thông báo

MVP chưa có trung tâm thông báo trong ứng dụng.
- **Email:** gửi qua Resend (R90). Chủ kế hoạch nhận email gộp tối đa một lần mỗi giờ; người gửi nhận email khi có kết quả.
- **Trong ứng dụng:** trạng thái hiện ngay nơi cần — số yêu cầu đang chờ trên thẻ kế hoạch, và trạng thái yêu cầu ở bộ lọc Đã gửi của tab Chiêu mộ.
- **Nếu sau này thêm biểu tượng chuông:** chỉ cần thêm bảng Notification, ghi cùng lúc với email.

## Đã chốt (29/10/2026)

1. Chỉ chủ kế hoạch (người tạo) duyệt yêu cầu và quản lý thành viên.
2. Người có passcode vẫn sửa được trên thiết bị, nhưng không vì thế mà thành thành viên hay đổi vai trò của tài khoản.
3. Không có chat. Người xin đi cùng để lại thông tin liên hệ; chủ kế hoạch tự liên hệ; ứng dụng không chuyển hay hiển thị liên hệ của chủ kế hoạch.
4. Chỉ xác minh bằng email đăng ký (R61).
5. Tin chiêu mộ hiện lịch trình (giờ, tên, địa điểm), không hiện ghi chú.
6. Cả thành viên có tài khoản và chiêu mộ đều làm trong MVP; tab tên là "Chiêu mộ".

## Sau MVP

- Đánh giá bạn đồng hành sau chuyến đi.
- Gợi ý ghép nhóm theo điểm đến và ngày trùng nhau.
- Trung tâm thông báo trong ứng dụng.
