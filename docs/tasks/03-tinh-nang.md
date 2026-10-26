# Tính năng

Tech stack và thứ tự làm: [README](README.md).

## 12. Kế hoạch (plan)

- [ ] Tạo plan: tên, địa điểm, ngày bắt đầu/kết thúc, ghi chú, theme, passcode, email khôi phục; `currencyUnit` tự đặt là `$`, không hiện ô chọn (R1)
- [ ] Không cho lưu khi ngày kết thúc trước ngày bắt đầu (R2)
- [ ] Danh sách plan của account, sắp theo ngày bắt đầu tăng dần (R60)
- [ ] Trang xem plan qua link chia sẻ (cần đúng `planId` và khóa), không cần đăng nhập (R3)
- [ ] Đổi link chia sẻ (có xác nhận): link cũ hết dùng được; thiết bị đang có quyền chỉnh sửa và chủ account được chuyển sang link mới (R3)
- [ ] Sửa thông tin plan
- [ ] Xóa plan có hộp thoại xác nhận (R22)
- [ ] Thẻ preview (Open Graph) khi gửi link qua Zalo/Messenger
- [ ] Tải lại dữ liệu khi người dùng quay lại tab, để đồng bộ giữa các thiết bị

## 13. Người tham gia

- [ ] Thêm người tham gia, sửa tên hiển thị
- [ ] Plan có account: tự động thêm chủ account thành người tham gia khi tạo plan (R26)
- [ ] Hỏi "Bạn là ai?" lần đầu edit trên thiết bị; lưu lựa chọn trên thiết bị, cho đổi lại hoặc bỏ qua; hỏi lại khi người đã chọn rời plan (R27)
- [ ] Xóa người tham gia: có liên quan đến chi phí hoặc là người thu tiền thì chuyển sang ngừng hoạt động và hiện cảnh báo ở khoản chi, QR; không liên quan thì xóa hẳn ngay, không hỏi xác nhận; không có nút xóa cho người đại diện chủ account (R13, R26)
- [ ] Đánh dấu đã thanh toán, tránh xác nhận trùng (R23)
- [ ] Quản lý đợt đóng góp

## 14. Lịch trình

- [ ] Thêm, sửa (cả tên lẫn thông tin), xóa hoạt động; khóa khi tổng kết đang tạm khóa hoặc đã chốt (R58)
- [ ] Xóa hoạt động có khoản chi phí gắn vào: liệt kê các khoản chi phí sẽ bị xóa theo, hỏi xác nhận, rồi tính lại tổng kết (R58)
- [ ] Hiển thị hoạt động theo ngày giờ dự kiến tăng dần (bộ chọn ngày giờ khi nhập); kéo đổi thứ tự chỉ áp dụng cho các hoạt động cùng giờ (R60)
- [ ] Bộ chọn xem lịch trình theo "Tất cả" hoặc từng ngày, mặc định "Tất cả" (R60)
- [ ] Lưu link bản đồ
- [ ] Hiển thị chi phí gắn với hoạt động hoặc ngày giờ tương ứng (R25)
- [ ] Đầu mỗi ngày hiện nơi ở đêm đó; ngày di chuyển hiện cả hai nơi (R32)

## 15. Nơi ở

- [ ] Thêm, sửa, xóa nơi ở: tên, khu vực, quốc gia, địa chỉ, link bản đồ, ngày nhận/trả phòng (R31); hiển thị theo ngày nhận phòng tăng dần (R60)
- [ ] Kiểm tra ngày nơi ở nằm trong ngày của plan và không chồng nhau; cho phép đêm không có nơi ở (R31)
- [ ] Cho thêm nơi ở ngay khi tạo plan (có thể bỏ qua) hoặc thêm sau trong plan
- [ ] Chọn quốc gia từ danh sách (tên hiển thị theo ngôn ngữ người dùng, lưu mã ISO)
- [ ] Khu vực nhập tự do; khi gõ thì gợi ý khu vực của các danh sách gợi ý đã đăng, cho bỏ qua gợi ý (R34)
- [ ] Cảnh báo khi đổi ngày plan làm nơi ở hoặc món ăn nằm ngoài khoảng ngày mới; không xóa âm thầm

## 16. Danh sách món ăn

- [ ] Mục "Ăn gì": một danh sách món chung, không chia theo ngày; mỗi món có biểu tượng buổi và nhãn ngày, món chưa có ngày có nhãn "Chưa xếp ngày" (R33)
- [ ] Thêm, sửa, xóa, kéo để sắp xếp món: tên món, quán, đường đến quán, ghi chú; chỉ tên món là bắt buộc (R33)
- [ ] Gán hoặc đổi ngày, buổi của món (tùy chọn) (R33)
- [ ] Sắp theo ngày tăng dần (món chưa có ngày ở cuối), rồi theo buổi từ sáng đến tối; cùng ngày, cùng buổi thì kéo đổi thứ tự (R33)
- [ ] Bộ lọc theo ngày (Tất cả, từng ngày, Chưa xếp ngày) và theo buổi (R33)
- [ ] Khi lọc theo một ngày, hiện nơi ở của ngày đó để biết ăn quanh đâu (R32)
- [ ] Trạng thái trống khi chưa có món hoặc bộ lọc không có kết quả, có nút thêm cho người có quyền chỉnh sửa
- [ ] Người xem qua link xem được danh sách, không sửa được

## 17. Chi phí

- [ ] Form chi phí: mô tả, số tiền, người trả, ngày giờ (bộ chọn ngày giờ), ghi chú, hoạt động liên kết, người chia và tỷ lệ
- [ ] Danh sách chi phí theo ngày giờ tăng dần, cùng giờ thì khoản tạo trước lên trước; bộ chọn "Tất cả" hoặc từng ngày; khoản ngoài ngày chuyến đi chỉ hiện ở "Tất cả" (R60)
- [ ] Người trả mặc định là người tham gia đã chọn trên thiết bị, có thể đổi (R15, R27)
- [ ] Chỉ chọn được người đang tham gia (R12)
- [ ] Cảnh báo chi phí có người đã rời; sửa chi phí đó cần thao tác xác nhận riêng (R21)
- [ ] Tính lại kết quả khi thêm, sửa, xóa chi phí (R20)

## 18. Tổng kết và chia sẻ

- [ ] Màn hình tổng kết: đã trả/đã chi, tổng chi phí, số cần đóng góp, đợt đóng góp, trạng thái đã thanh toán
- [ ] Nút "Tạm khóa" / "Mở khóa" và "Chốt cuối cùng" (xác nhận nói rõ không hoàn tác được); hiện trạng thái "Tạm tính", "Tạm khóa" hoặc "Đã chốt" kèm thời điểm (R59)
- [ ] Mở khóa khi đã có người được đánh dấu đã thanh toán: cảnh báo số tiền có thể thay đổi (R59)
- [ ] Khi tạm khóa hoặc đã chốt: ẩn hoặc khóa các nút thêm, sửa, xóa người tham gia, hoạt động, chi phí; vẫn cho đánh dấu đã thanh toán, đợt đóng góp, QR (R59)
- [ ] Share link mở thẳng màn hình tổng kết (Web Share API và nút copy link)
- [ ] Export tổng kết thành ảnh; mặc định kèm QR chuyển khoản, cho bỏ ra (R57)
- [ ] Tải QR chuyển khoản của người thu tiền: chọn người thu tiền (mặc định là người đã chọn trên thiết bị hoặc chủ account); JPG, PNG, WebP, HEIC tối đa 5 MB; kiểm tra ảnh có đúng một mã QR đọc được; xóa metadata; nhãn tùy chọn (R54, R55)
- [ ] Mỗi plan chỉ một QR: tải QR mới thì thay QR cũ sau khi xác nhận; gỡ QR; quyền giống các thao tác chỉnh sửa khác (R54)
- [ ] Nhắc người tải rằng ai xem được plan cũng thấy QR (R55)
- [ ] Hiển thị QR trong tổng kết kèm tên người thu tiền và thời điểm thay gần nhất; phóng to, lưu ảnh; nhắc kiểm tra tên người nhận trong app ngân hàng; QR không chứa số tiền, người chuyển tự nhập theo số cần đóng góp (R56)

## 19. Gợi ý quán ăn từ cộng đồng

Requirements: [04 Gợi ý quán ăn từ cộng đồng](../requirements/04-goi-y-quan-an.md)

- [ ] Mục "Gợi ý quán ăn" ở màn hình chính, bên cạnh mục "Kế hoạch"
- [ ] Tab "Gợi ý quán" riêng trong plan, hiện sẵn các khu vực nơi ở của plan (R40)
- [ ] Chọn username trước khi đăng lần đầu; app cấp tag cho account; hiển thị username kèm huy hiệu tag trên danh sách gợi ý (R35, R37)
- [ ] Đăng danh sách gợi ý (cần đăng nhập): tiêu đề, khu vực, quốc gia, mô tả, ngôn ngữ, các mục gồm tên món, tên quán, đường đến quán, buổi, ghi chú; ít nhất 3 quán khác nhau; xem trước khi đăng (R35)
- [ ] Đường đến quán nhập tự do; link trong đó bấm được và gắn `rel="nofollow ugc noreferrer"` (R36)
- [ ] Huy hiệu "Người địa phương" khi tác giả đánh dấu "Tôi sống ở đây" (R37)
- [ ] Tạo nhanh danh sách gợi ý từ danh sách món của một plan; không lấy tên người, chi phí; món thiếu quán hoặc đường đến quán phải bổ sung hoặc bỏ ra (R38)
- [ ] Tác giả sửa danh sách gợi ý, không cho lưu nếu còn ít hơn 3 quán; tác giả gỡ là xóa hẳn, admin gỡ thì giữ ở trạng thái đã gỡ; hiện "Cập nhật lần cuối" (R35, R39, R44)
- [ ] Tìm theo điểm đến, không dấu và gần đúng; gợi ý khu vực khi gõ (R34, R40)
- [ ] Sắp kết quả theo lượt hữu ích, lượt sử dụng, độ mới; lọc theo buổi và ngôn ngữ (R40)
- [ ] Áp dụng một hoặc nhiều danh sách gợi ý, cả danh sách hoặc từng mục, vào plan: thêm vào danh sách món chưa có ngày, hoặc chọn thẳng ngày và buổi; đánh dấu mục đã có trong plan (R41)
- [ ] Món đã áp dụng là món bình thường của plan: sửa, chuyển, xóa được (R41)
- [ ] Tăng lượt sử dụng khi áp dụng vào một plan; áp dụng lại vào cùng plan không tăng (R41)
- [ ] Nút "Hữu ích" (cần đăng nhập, bấm lại để bỏ) (R42)
- [ ] Trạng thái trống khi khu vực chưa có danh sách gợi ý, mời người địa phương đăng
- [ ] Điều khoản sử dụng cho nội dung người dùng đăng; xin đồng ý khi đăng lần đầu (R35)

## 20. Kiểm duyệt và admin

- [ ] Nút "Báo cáo" có lý do; rate limit theo IP; mỗi người chỉ tính một lần cho mỗi danh sách gợi ý (R43)
- [ ] Tự ẩn danh sách gợi ý khi bị 3 người khác nhau báo cáo (R43)
- [ ] Lọc từ ngữ thô tục cơ bản trong nội dung danh sách gợi ý và username (R45)
- [ ] Trang admin: xem danh sách gợi ý bị báo cáo, khôi phục hoặc gỡ, khóa tài khoản spam (R44)

## 21. Job định kỳ

- [ ] Cron xóa plan không có account sau 30 ngày kể từ lần cập nhật cuối, xóa theo batch (R24)
- [ ] Dọn token và lock đã hết hạn
- [ ] Xóa ảnh nền và ảnh QR trên storage khi plan bị xóa hoặc hết hạn (R30, R57)
- [ ] Xóa IP đã hash quá 30 ngày (R53)
