# 06 — Bảo vệ dữ liệu và chống crawl

Chống crawl và bảo vệ dữ liệu kế hoạch, người dùng: không lập chỉ mục, giới hạn lượt đọc, chỉ gửi dữ liệu cần thiết cho người xem.

Liên quan: [01 Kế hoạch và quyền truy cập](01-ke-hoach-va-quyen-truy-cap.md) · [04 Gợi ý quán ăn từ cộng đồng](04-goi-y-quan-an.md) · [Tổng quan](README.md)

## Dữ liệu

Không có bảng riêng. Module này dùng `shareKey` của kế hoạch ([R3](01-ke-hoach-va-quyen-truy-cap.md)) và địa chỉ IP đã hash trong báo cáo danh sách gợi ý ([R43](04-goi-y-quan-an.md)).

## Quy tắc

- **R46.** Kế hoạch không bao giờ được liệt kê công khai. Trang kế hoạch và trang danh sách gợi ý không được đưa vào sitemap và báo cho công cụ tìm kiếm không lập chỉ mục; chỉ tìm được kế hoạch qua link của nó, và chỉ tìm được danh sách gợi ý qua chức năng tìm kiếm trong ứng dụng.
- **R47.** Ứng dụng giới hạn số trang kế hoạch và lượng dữ liệu kế hoạch mà một người truy cập (nhận biết theo địa chỉ IP và thiết bị) đọc được trong một khoảng thời gian, và giới hạn chặt hơn với các lần tra sai (mã kế hoạch không tồn tại hoặc sai khóa chia sẻ). Người vượt giới hạn phải qua bước kiểm tra chống bot (ví dụ CAPTCHA) hoặc bị chặn một thời gian. Giới hạn không được ảnh hưởng đến việc dùng bình thường, như cả nhóm cùng mở một link chia sẻ. Lưu lượng từ các bot đã biết được lọc trước khi vào ứng dụng.
- **R48.** Ứng dụng chỉ gửi cho người xem dữ liệu mà màn hình hiển thị. Passcode, email khôi phục, email tài khoản và mã định danh tài khoản không bao giờ được gửi cho người xem; danh sách gợi ý chỉ nhận diện tác giả bằng username và tag.
- **R49.** Các mã định danh, trừ `planId`, được sinh ngẫu nhiên, không tuần tự, để không thể dò bản ghi bằng cách đếm.
- **R50.** Trang kế hoạch không để lộ địa chỉ của nó cho website khác: link dẫn ra ngoài ứng dụng, như link bản đồ và đường đến quán, được mở mà không gửi kèm link kế hoạch.
- **R51.** Thẻ preview link của kế hoạch chỉ hiển thị tên kế hoạch, ngày và hình minh họa của theme hoặc ảnh riêng, không bao giờ hiển thị tên người tham gia, số tiền hay QR chuyển khoản.
- **R52.** Tìm kiếm danh sách gợi ý trả kết quả theo trang có giới hạn số lượng, không có chức năng xuất hàng loạt, và bị giới hạn theo người truy cập giống trang kế hoạch (R47).
- **R53.** Địa chỉ IP lưu cho việc giới hạn và báo cáo được lưu dạng hash và xóa sau 30 ngày.

## Acceptance Criteria

- Trang kế hoạch không được liệt kê ở bất kỳ đâu công khai; trang kế hoạch và trang danh sách gợi ý không được công cụ tìm kiếm lập chỉ mục.
- Người truy cập yêu cầu nhiều kế hoạch, hoặc tra sai nhiều lần, trong thời gian ngắn phải qua bước kiểm tra chống bot hoặc bị chặn một thời gian; cả nhóm cùng mở một link chia sẻ thì không bị ảnh hưởng.
- Dữ liệu gửi cho người xem không bao giờ chứa passcode, email khôi phục, email tài khoản hay mã định danh tài khoản.
- Mở link ra ngoài từ một kế hoạch không làm lộ link kế hoạch cho website kia.
- Thẻ preview link của kế hoạch không chứa tên người tham gia, số tiền hay QR chuyển khoản.
- Tìm kiếm danh sách gợi ý không trả về toàn bộ danh sách gợi ý trong một lần.

## Edge Cases

- Crawler thử lần lượt các mã kế hoạch hoặc khóa chia sẻ; sau vài lần tra sai, crawler phải qua bước kiểm tra chống bot, rồi bị chặn.
- Nhiều người dùng chung một địa chỉ IP, ví dụ cả nhóm dùng Wi-Fi khách sạn, và cùng mở một kế hoạch; việc dùng bình thường vẫn nằm trong giới hạn.
- Link kế hoạch bị đăng công khai do nhầm lẫn; công cụ tìm kiếm vẫn không lập chỉ mục kế hoạch đó.
- Link danh sách gợi ý được chia sẻ lên mạng xã hội; công cụ tìm kiếm vẫn không lập chỉ mục danh sách đó.
