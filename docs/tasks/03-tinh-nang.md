# Tính năng

Tech stack và thứ tự làm: [README](README.md).

## 12. Kế hoạch (plan)

- [ ] Tạo plan: tên (1–50 ký tự, hiện số ký tự còn lại khi gần hết, R73), địa điểm, ngày bắt đầu/kết thúc, tiền tệ, ghi chú, theme, passcode (cần đăng nhập, R61); tiền tệ được chọn sẵn, hiện ký hiệu, mã và tên, đổi qua bộ chọn (R1, R70)
- [ ] Bộ chọn tiền tệ: ô tìm theo mã, tên tiền tệ, tên nước, ký hiệu; khi chưa gõ thì hiện tiền tệ đã dùng gần đây, nhóm phổ biến, rồi toàn bộ theo chữ cái; tìm không ra thì giữ tiền tệ đang chọn (R71)
- [ ] Đổi tiền tệ trong cài đặt plan khi chưa có khoản chi, tiền đóng và tổng kết đang mở; ngoài trường hợp đó thì khóa ô kèm lời giải thích (R72)
- [ ] Không cho lưu khi ngày kết thúc trước ngày bắt đầu (R2)
- [ ] Danh sách plan của account chia hai mục: Sắp diễn ra (tổng kết `open` hoặc `locked`) ở trên, Đã tổng kết (`final`) ở dưới; Sắp diễn ra theo ngày bắt đầu tăng dần, Đã tổng kết theo ngày bắt đầu giảm dần; plan đã qua ngày kết thúc mà chưa chốt có nhãn "Chưa chốt tổng kết"; mục trống có thông báo ngắn; tên dài cắt ở 2 dòng (R60, R62, R73)
- [ ] Trang xem plan qua link chia sẻ (cần đúng `planId` và khóa), không cần đăng nhập (R3)
- [ ] Đổi link chia sẻ (có xác nhận): link cũ hết dùng được; thiết bị đang có quyền chỉnh sửa và chủ account được chuyển sang link mới (R3)
- [ ] Sửa thông tin plan
- [ ] Xóa plan có hộp thoại xác nhận (R22)
- [ ] Thẻ preview (Open Graph) khi gửi link qua Zalo/Messenger
- [ ] Tải lại dữ liệu khi người dùng quay lại tab, để đồng bộ giữa các thiết bị

## 13. Người tham gia

- [ ] Mở màn người tham gia từ nút số người ở đầu plan (không có tab riêng)
- [ ] Thêm người tham gia, sửa tên hiển thị
- [ ] Plan có account: tự động thêm chủ account thành người tham gia khi tạo plan, tên là tên hiển thị của account (R26, R78)
- [ ] Hỏi "Bạn là ai?" lần đầu edit trên thiết bị; lưu lựa chọn trên thiết bị, cho đổi lại hoặc bỏ qua; hỏi lại khi người đã chọn rời plan (R27)
- [ ] Xóa người tham gia: có liên quan đến chi phí, có tiền đóng hoặc là người thu tiền thì chuyển sang ngừng hoạt động và hiện cảnh báo ở khoản chi, QR; không liên quan thì xóa hẳn ngay, không hỏi xác nhận; không có nút xóa cho người đại diện chủ account (R13, R26)

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
- [ ] Cảnh báo khi đổi ngày plan làm nơi ở nằm ngoài khoảng ngày mới; không xóa âm thầm

## 16. Danh sách món ăn

- [ ] Tab "Ăn gì": danh sách món chung, không gắn với ngày; mỗi món có một hoặc nhiều biểu tượng buổi (R33)
- [ ] Thêm, sửa, xóa, kéo để sắp xếp món: tên món, quán, đường đến quán, ghi chú; chỉ tên món là bắt buộc (R33)
- [ ] Chọn một hoặc nhiều buổi cho món (tùy chọn) (R33)
- [ ] Kéo để đổi thứ tự món (R33)
- [ ] Bộ lọc theo buổi (R33)
- [ ] Trạng thái trống khi chưa có món hoặc bộ lọc không có kết quả, có nút thêm cho người có quyền chỉnh sửa
- [ ] Người xem qua link xem được danh sách, không sửa được

## 17. Chi phí

- [ ] Form chi phí: mô tả, số tiền, người trả, ngày giờ (bộ chọn ngày giờ), ghi chú, hoạt động liên kết, người chia và tỷ lệ; người không được tích thì nút tỷ lệ bị disable; ô số tiền hiện ký hiệu tiền tệ của plan, tiền tệ không có phần lẻ thì mở bàn phím số nguyên (R1, R18)
- [ ] Danh sách chi phí theo ngày giờ tăng dần, cùng giờ thì khoản tạo trước lên trước; bộ chọn "Tất cả" hoặc từng ngày; khoản ngoài ngày chuyến đi chỉ hiện ở "Tất cả" (R60)
- [ ] Người trả mặc định là người tham gia đã chọn trên thiết bị, có thể đổi (R15, R27)
- [ ] Chỉ chọn được người đang tham gia (R12)
- [ ] Cảnh báo chi phí có người đã rời; sửa chi phí đó cần thao tác xác nhận riêng (R21)
- [ ] Tính lại kết quả khi thêm, sửa, xóa chi phí hoặc tiền đóng (R20)
- [ ] Màn Chi phí có hai danh sách Khoản chi và Tiền đóng, mỗi bên hiện tổng; tiền đóng theo ngày giờ tăng dần, khoản ghi cùng lúc hiện thành nhóm; sửa, xóa từng khoản (R60, R75)
- [ ] Form "Ghi tiền đóng": ngày giờ, ghi chú, tích người (mặc định mọi người đang hoạt động), hai chế độ Cùng số tiền / Mỗi người một số, hiện tổng trước khi lưu (R75)

## 18. Tổng kết và chia sẻ

- [ ] Màn hình tổng kết: tổng chi phí, số người đã đủ, số tiền người thu tiền đang giữ; mỗi người hai hàng: biểu tượng đủ/chưa đủ, tên, chi tiêu; đã đóng, còn thiếu (đỏ) hoặc dư (xanh lá), không kèm chữ, đủ thì để trống (R76, R77)
- [ ] Bấm vào một người: "Đã đóng đủ" hoặc "Đã trả lại" ghi một khoản bằng đúng số còn thiếu hoặc dư (R23)
- [ ] Đổi người thu tiền trong tổng kết (mặc định chủ plan); có QR thì hỏi xác nhận rồi gỡ; nhắc người cũ chuyển số tiền đang giữ (R54)
- [ ] Nút "Tạm khóa" / "Mở khóa" và "Chốt cuối cùng" (xác nhận nói rõ không hoàn tác được); hiện trạng thái "Tạm tính", "Tạm khóa" hoặc "Đã chốt" kèm thời điểm (R59)
- [ ] Mở khóa khi đã có tiền đóng: cảnh báo số tiền có thể thay đổi (R59)
- [ ] Khi tạm khóa hoặc đã chốt: ẩn hoặc khóa các nút thêm, sửa, xóa người tham gia, hoạt động, chi phí; vẫn cho ghi tiền đóng, trả lại, đổi người thu tiền, QR (R59)
- [ ] Share link mở thẳng màn hình tổng kết (Web Share API và nút copy link)
- [ ] Export tổng kết thành ảnh; mặc định kèm QR chuyển khoản, cho bỏ ra (R57)
- [ ] Tải QR chuyển khoản của người thu tiền: JPG, PNG, WebP, HEIC tối đa 5 MB; kiểm tra ảnh có đúng một mã QR đọc được; xóa metadata; nhãn tùy chọn (R54, R55)
- [ ] Mỗi plan chỉ một QR: tải QR mới thì thay QR cũ sau khi xác nhận; gỡ QR; quyền giống các thao tác chỉnh sửa khác (R54)
- [ ] Nhắc người tải rằng ai xem được plan cũng thấy QR (R55)
- [ ] Hiển thị QR trong tổng kết kèm tên người thu tiền và thời điểm thay gần nhất; phóng to, lưu ảnh; nhắc kiểm tra tên người nhận trong app ngân hàng; QR không chứa số tiền, người chuyển tự nhập theo số còn thiếu (R56)

## 19. Gợi ý quán ăn từ cộng đồng

Requirements: [04 Gợi ý quán ăn từ cộng đồng](../requirements/04-goi-y-quan-an.md)

- [ ] Mục "Khám phá" ở màn hình chính, bên cạnh mục "Kế hoạch", gồm hai lựa chọn "Hành trình" và "Quán ăn"
- [ ] Lựa chọn "Gợi ý quán" trong tab Ăn gì, hiện sẵn các khu vực nơi ở của plan (R40)
- [ ] App cấp tag cho account; hiển thị tên hiển thị kèm huy hiệu tag trên danh sách gợi ý, không bao giờ hiện username (R37, R78)
- [ ] Đăng danh sách gợi ý (cần đăng nhập): tiêu đề, khu vực, quốc gia, mô tả, ngôn ngữ, các mục gồm tên món, tên quán, đường đến quán, buổi, ghi chú; ít nhất 3 quán khác nhau; xem trước khi đăng (R35)
- [ ] Đường đến quán nhập tự do; link trong đó bấm được và gắn `rel="nofollow ugc noreferrer"` (R36)
- [ ] Huy hiệu "Người địa phương" khi tác giả đánh dấu "Tôi sống ở đây" (R37)
- [ ] Tạo nhanh danh sách gợi ý từ danh sách món của một plan; không lấy tên người, chi phí; món thiếu quán hoặc đường đến quán phải bổ sung hoặc bỏ ra (R38)
- [ ] Tác giả sửa danh sách gợi ý, không cho lưu nếu còn ít hơn 3 quán; tác giả gỡ là xóa hẳn, admin gỡ thì giữ ở trạng thái đã gỡ; hiện "Cập nhật lần cuối" (R35, R39, R44)
- [ ] Tìm theo điểm đến, không dấu và gần đúng; gợi ý khu vực khi gõ (R34, R40)
- [ ] Sắp kết quả theo lượt hữu ích, lượt sử dụng, độ mới; lọc theo buổi và ngôn ngữ (R40)
- [ ] Áp dụng một hoặc nhiều danh sách gợi ý, cả danh sách hoặc từng mục, vào plan: thêm vào danh sách món kèm các buổi, hoặc chọn lại buổi; đánh dấu mục đã có trong plan (R41)
- [ ] Món đã áp dụng là món bình thường của plan: sửa, chuyển, xóa được (R41)
- [ ] Tăng lượt sử dụng khi áp dụng vào một plan; áp dụng lại vào cùng plan không tăng (R41)
- [ ] Nút "Hữu ích" (cần đăng nhập, bấm lại để bỏ) (R42)
- [ ] Trạng thái trống khi khu vực chưa có danh sách gợi ý, mời người địa phương đăng
- [ ] Điều khoản sử dụng cho nội dung người dùng đăng; xin đồng ý khi đăng lần đầu (R35)

## 20. Chia sẻ hành trình

Requirements: [07 Chia sẻ hành trình](../requirements/07-chia-se-hanh-trinh.md)

- [ ] Lựa chọn "Hành trình" trong mục Khám phá: tìm theo điểm đến và khu vực nơi ở, không dấu và gần đúng (R34, R67)
- [ ] Sắp kết quả theo lượt hữu ích, lượt sao chép, độ mới; lọc theo số ngày và ngôn ngữ (R67)
- [ ] Trang xem hành trình: hoạt động theo Ngày 1…N, nơi ở, món ăn, số người, chi phí ước tính mỗi người; tên hiển thị kèm huy hiệu tag; "Cập nhật lần cuối"; dùng theme của hành trình (R37, R64, R66)
- [ ] Nút "Chia sẻ hành trình" trong tab Tổng kết, chỉ cho chủ plan và chỉ khi tổng kết đã chốt; plan đã có hành trình thì mở hành trình đó để sửa (R63)
- [ ] Màn xem trước khi đăng: sửa tiêu đề, điểm đến, mô tả, từng mục; bỏ bớt mục; bật hoặc tắt chi phí ước tính; nhắc kiểm tra thông tin cá nhân; cần ít nhất một hoạt động (R65, R66)
- [ ] Đồng ý điều khoản khi đăng lần đầu, dùng chung với danh sách gợi ý (R35, R63)
- [ ] Tác giả sửa, gỡ hành trình; tác giả gỡ là xóa hẳn (R66)
- [ ] Sao chép thành plan mới (cần đăng nhập): đi qua 3 bước tạo plan được điền sẵn (cả tiền tệ của hành trình), chọn ngày bắt đầu, đặt passcode; tăng lượt sao chép (R61, R68)
- [ ] Nút "Hữu ích" cho hành trình (R69)
- [ ] Trạng thái trống khi điểm đến chưa có hành trình, mời chia sẻ hành trình đầu tiên

## 21. Kiểm duyệt và admin

- [ ] Nút "Báo cáo" có lý do; rate limit theo IP; mỗi người chỉ tính một lần cho mỗi danh sách gợi ý hoặc hành trình; hành trình có thêm lý do "lộ thông tin cá nhân" (R43, R69)
- [ ] Tự ẩn danh sách gợi ý hoặc hành trình khi bị 3 người khác nhau báo cáo (R43, R69)
- [ ] Lọc từ ngữ thô tục cơ bản trong nội dung danh sách gợi ý, hành trình, tên hiển thị và username (R45, R69)
- [ ] Trang admin: xem danh sách gợi ý và hành trình bị báo cáo, khôi phục hoặc gỡ (admin gỡ thì giữ ở trạng thái đã gỡ), khóa tài khoản spam (R44, R69)

## 22. Job định kỳ

- [ ] Dọn token và lock đã hết hạn
- [ ] Xóa ảnh nền và ảnh QR trên storage khi plan bị xóa (R30, R57)
- [ ] Xóa IP đã hash quá 30 ngày (R53)
