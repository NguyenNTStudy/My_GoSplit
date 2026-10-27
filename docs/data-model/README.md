# Data model (ERD)

Vẽ từ phần Dữ liệu của các module [requirements](../requirements/README.md). Tên bảng và cột viết theo kiểu Prisma để dùng thẳng khi viết schema; tên mang tính khái niệm và có thể đổi khi triển khai.

Sơ đồ chi tiết (đủ cột):

- [01-ke-hoach.md](01-ke-hoach.md): kế hoạch, người tham gia, chi phí, QR, lịch trình, nơi ở, món ăn, email token
- [02-goi-y-quan-an.md](02-goi-y-quan-an.md): tài khoản, danh sách gợi ý, hữu ích, báo cáo, lượt áp dụng
- [03-hanh-trinh.md](03-hanh-trinh.md): hành trình chia sẻ, các mục của hành trình, hữu ích, báo cáo

Sơ đồ dùng Mermaid: GitHub hiển thị sẵn; trong VS Code cần extension hỗ trợ Mermaid cho Markdown preview.

## Tổng quan quan hệ

```mermaid
erDiagram
  Account ||--o{ Plan : "sở hữu"
  Plan ||--o{ Participant : "có"
  Participant ||--o| Plan : "là chủ kế hoạch của"
  Plan ||--o{ Activity : "có"
  Plan ||--o{ Stay : "có"
  Plan ||--o{ FoodItem : "có"
  Plan ||--o{ Expense : "có"
  Plan ||--o| PaymentQr : "có tối đa một"
  Plan ||--o{ EmailToken : "có"
  Plan ||--o{ Contribution : "có"
  Participant ||--o{ Contribution : "đóng tiền"
  Participant ||--o| Plan : "là người thu tiền của"
  Participant ||--o{ Expense : "trả tiền"
  Expense ||--|{ ExpenseShare : "chia cho"
  Participant ||--o{ ExpenseShare : "chịu phần"
  Activity |o--o{ Expense : "gắn với"
  Account ||--o{ FoodGuide : "đăng"
  FoodGuide ||--|{ FoodGuideEntry : "gồm"
  FoodGuide ||--o{ GuideVote : "được bấm hữu ích"
  Account ||--o{ GuideVote : "bấm hữu ích"
  FoodGuide ||--o{ GuideReport : "bị báo cáo"
  Account |o--o{ GuideReport : "báo cáo"
  FoodGuide ||--o{ GuideApplication : "được áp dụng"
  Plan ||--o{ GuideApplication : "đã áp dụng"
  Account ||--o{ Itinerary : "đăng"
  Plan |o--o| Itinerary : "được chia sẻ thành"
  Itinerary ||--|{ ItineraryActivity : "gồm"
  Itinerary ||--o{ ItineraryStay : "gồm"
  Itinerary ||--o{ ItineraryFood : "gồm"
  Itinerary ||--o{ ItineraryVote : "được bấm hữu ích"
  Itinerary ||--o{ ItineraryReport : "bị báo cáo"
```

## Các bảng

| Bảng | Module | Ghi chú |
|---|---|---|
| Plan | [01](../requirements/01-ke-hoach-va-quyen-truy-cap.md) | Gồm cả passcode lock, edit lock, ảnh nền, theme |
| Account | [01](../requirements/01-ke-hoach-va-quyen-truy-cap.md) | Đăng nhập bằng Google, hoặc email hay username kèm mật khẩu, do Better Auth quản lý (plugin username; kể cả xác nhận email, đặt lại mật khẩu); app thêm các cột riêng (R61, R78) |
| EmailToken | [01](../requirements/01-ke-hoach-va-quyen-truy-cap.md) | Token của link mở khóa nhập passcode, gửi đến email của chủ kế hoạch (R9) |
| Participant, Contribution | [02](../requirements/02-nguoi-tham-gia-va-chi-phi.md) | Contribution ghi tiền đóng và tiền trả lại của từng người (R75) |
| Expense, ExpenseShare | [02](../requirements/02-nguoi-tham-gia-va-chi-phi.md) | Mỗi dòng ExpenseShare là một người chia và tỷ lệ |
| PaymentQr | [02](../requirements/02-nguoi-tham-gia-va-chi-phi.md) | Khóa chính là `planId`, nên mỗi kế hoạch tối đa một QR |
| Activity, Stay, FoodItem | [03](../requirements/03-lich-trinh-noi-o-mon-an.md) | |
| FoodGuide, FoodGuideEntry, GuideVote, GuideReport, GuideApplication | [04](../requirements/04-goi-y-quan-an.md) | GuideApplication ghi kế hoạch nào đã áp dụng danh sách nào |
| Itinerary, ItineraryActivity, ItineraryStay, ItineraryFood, ItineraryVote, ItineraryReport | [07](../requirements/07-chia-se-hanh-trinh.md) | Bản sao độc lập của kế hoạch đã chốt; ngày thật đổi thành số thứ tự ngày |

## Khác với phần Dữ liệu trong requirements

- `editPasscode` → `passcodeHash` (argon2) và `passcodeVersion`; đổi passcode thì tăng version để vô hiệu phiên edit cũ (R11).
- `passcodeLock` → `failedPasscodeAttempts`, `passcodeLockedUntil`, `unlockEmailSentAt` (R9).
- `editLock` → `editLockSessionId`, `editLockExpiresAt` (R8).
- `coverImage` → `coverImagePath` và `coverImageCrop` (R30).
- `shares` → bảng ExpenseShare.
- `hasLeftParticipantWarning` không lưu, tính từ trạng thái của người chia (R21).
- Thêm `areaSearch` (bản không dấu của khu vực) cho Stay, FoodGuide và ItineraryStay, và `destinationSearch` cho Itinerary (R34).
- Thêm bảng EmailToken và GuideApplication; thêm `createdAt` cho Participant để giữ thứ tự hiển thị.

## Quy tắc xóa

- Xóa Plan thì xóa toàn bộ dữ liệu con: Participant, Contribution, Expense, ExpenseShare, Activity, Stay, FoodItem, PaymentQr, EmailToken, GuideApplication. Ảnh nền và ảnh QR trong storage cũng bị xóa (R22, R24, R30, R57).
- Xóa Participant: nếu có trong Expense, ExpenseShare, Contribution hoặc là `Plan.collectorParticipantId` thì chỉ đổi `status = inactive`; nếu không thì xóa hẳn, không hỏi xác nhận. Participant là `Plan.ownerParticipantId` không xóa được (R13, R26).
- Xóa Expense thì xóa các ExpenseShare của nó.
- Xóa Activity thì xóa các Expense gắn với nó, kèm ExpenseShare của chúng (R58).
- Khi `Plan.summaryStatus` là `locked` hoặc `final`, server từ chối mọi thao tác thêm, sửa, xóa Participant, Activity, Expense, ExpenseShare. Contribution vẫn thêm, sửa, xóa được (R23). `locked` đổi về `open` được; `final` không đổi được nữa (R59).
- FoodItem áp dụng từ danh sách gợi ý là bản sao độc lập, không có khóa ngoại tới FoodGuide (R41).
- Tác giả gỡ FoodGuide thì xóa hẳn cùng FoodGuideEntry, GuideVote, GuideReport, GuideApplication; admin gỡ thì chỉ đổi `status = removed` (R39, R44).
- Xóa Plan hoặc FoodItem không làm giảm `FoodGuide.applyCount` (R41).
- Xóa Plan không xóa Itinerary được chia sẻ từ nó, chỉ đặt `Itinerary.sourcePlanId` trống (R66).
- Tác giả gỡ Itinerary thì xóa hẳn cùng ItineraryActivity, ItineraryStay, ItineraryFood, ItineraryVote, ItineraryReport; admin gỡ thì chỉ đổi `status = removed` (R66, R69).
- Xóa Plan sao chép từ hành trình không làm giảm `Itinerary.copyCount` (R68).
- `GuideReport.reporterIpHash` và `ItineraryReport.reporterIpHash` bị xóa (đặt trống) sau 30 ngày (R53).

## Ràng buộc và index

- Plan: `shareKey` duy nhất; `ownerId` bắt buộc; index `(ownerId, startDate)` cho danh sách kế hoạch; chia mục theo `summaryStatus` (R60–R62).
- Expense và Activity: index `(planId, dateTime)` để hiển thị theo thời gian và lọc theo ngày (R60).
- FoodItem: index `(planId, order)` để hiển thị theo thứ tự; lọc theo buổi trên mảng `mealSlots` (R33).
- Account: `username` duy nhất, lưu chữ thường (R78); `userTag` duy nhất (R37).
- ExpenseShare: khóa chính `(expenseId, participantId)`; `ratio > 0` (R16).
- Expense: `amount > 0`, kiểu `NUMERIC(14,3)`; với tiền tệ không có phần lẻ, `amount` của Expense và Contribution là số nguyên, kiểm tra ở `src/domain` (R14, R18).
- Plan và Itinerary: `currency` là mã có trong danh sách tiền tệ của ứng dụng, kiểm tra ở server; `Plan.currency` chỉ đổi được khi kế hoạch chưa có Expense, Contribution và `summaryStatus = open` (R1, R72).
- Stay: `checkOutDate > checkInDate` (R31); việc không chồng ngày kiểm tra ở `src/domain`.
- GuideVote: khóa chính `(guideId, accountId)` (R42).
- GuideReport: duy nhất theo `(guideId, reporterAccountId)` và `(guideId, reporterIpHash)` (R43).
- GuideApplication: khóa chính `(guideId, planId)`, nên mỗi kế hoạch chỉ tính một lượt sử dụng (R41).
- Stay và FoodGuide: index trigram trên `areaSearch` (R34); FoodGuide thêm index `(status, areaSearch)`.
- Itinerary: `sourcePlanId` duy nhất khi có giá trị, nên mỗi kế hoạch tối đa một hành trình (R63); index `(status, destinationSearch)` và index trigram trên `destinationSearch`; ItineraryStay có index trigram trên `areaSearch` (R34, R67).
- ItineraryActivity: `day` từ 1 đến `Itinerary.dayCount`; ItineraryStay: `checkOutDay > checkInDay` (R64).
- ItineraryVote: khóa chính `(itineraryId, accountId)`; ItineraryReport: duy nhất theo `(itineraryId, reporterAccountId)` và `(itineraryId, reporterIpHash)` (R69).
- Contribution: `amount > 0`; index `(planId, dateTime)` để hiển thị theo thời gian (R60, R75).
- Plan: `collectorParticipantId` là người tham gia của chính kế hoạch đó; đổi người thu tiền thì xóa PaymentQr (R54).
- Mọi khóa chính trừ `planId` là UUID hoặc cuid, không tự tăng (R49).

## Không lưu trong database

- Lựa chọn "Bạn là ai?" và ngôn ngữ khi chưa đăng nhập: lưu trên thiết bị (R27, R28).
- Phiên edit: cookie httpOnly có ký, gắn với `planId` và `passcodeVersion`.
- Bộ đếm rate limit: Upstash Redis (R47).
- Danh sách theme và hình minh họa: nằm trong code; Plan chỉ lưu mã theme (R29).
- Danh sách tiền tệ (mã, tên tiếng Việt và tiếng Anh, ký hiệu, số chữ số lẻ, bước làm tròn, các nước dùng, nhóm phổ biến): nằm trong code, sinh từ dữ liệu ISO 4217 và CLDR; Plan và Itinerary chỉ lưu mã (R1, R19, R71).
