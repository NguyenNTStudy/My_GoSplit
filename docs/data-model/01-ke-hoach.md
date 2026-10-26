# Data model — Kế hoạch, chi phí, lịch trình

Các bảng của module [01](../requirements/01-ke-hoach-va-quyen-truy-cap.md), [02](../requirements/02-nguoi-tham-gia-va-chi-phi.md) và [03](../requirements/03-lich-trinh-noi-o-mon-an.md). Quy tắc xóa và ràng buộc: [README](README.md).

```mermaid
erDiagram
  Account |o--o{ Plan : "sở hữu"
  Plan ||--o{ Participant : "có"
  Participant |o--o| Plan : "là chủ tài khoản của"
  Plan ||--o{ Activity : "có"
  Plan ||--o{ Stay : "có"
  Plan ||--o{ FoodItem : "có"
  Plan ||--o{ Expense : "có"
  Plan ||--o| PaymentQr : "có tối đa một"
  Plan ||--o{ EmailToken : "có"
  Participant ||--o{ PaymentInstallment : "đóng theo đợt"
  Participant ||--o{ Expense : "trả tiền"
  Expense ||--|{ ExpenseShare : "chia cho"
  Participant ||--o{ ExpenseShare : "chịu phần"
  Activity |o--o{ Expense : "gắn với"
  Participant ||--o| PaymentQr : "thu tiền"

  Account {
    String id PK "chi tiết ở 02-goi-y-quan-an.md"
  }

  Plan {
    String planId PK "10 chữ số ngẫu nhiên (R4)"
    String shareKey UK "khóa trong link chia sẻ (R3)"
    String name
    String location
    DateTime startDate "chỉ ngày"
    DateTime endDate "chỉ ngày, không trước startDate (R2)"
    String notes "tùy chọn"
    String currencyUnit "hiện luôn là $ (R1)"
    String theme "mã theme, mặc định Gạo ấm (R29)"
    String coverImagePath "tùy chọn, storage riêng tư (R30)"
    Json coverImageCrop "vùng ảnh hiển thị"
    String ownerType "account hoặc guest"
    String ownerId FK "Account, tùy chọn"
    String ownerParticipantId FK "Participant, tùy chọn (R26)"
    String passcodeHash "argon2 (R5)"
    Int passcodeVersion "tăng khi đổi passcode (R11)"
    String recoveryEmail "tùy chọn (R10)"
    DateTime recoveryEmailVerifiedAt
    Int failedPasscodeAttempts "R9"
    DateTime passcodeLockedUntil
    DateTime unlockEmailSentAt "tối đa một email mỗi lần khóa"
    String editLockSessionId "R8"
    DateTime editLockExpiresAt
    DateTime createdAt
    DateTime updatedAt "tính hạn 30 ngày (R24)"
    String summaryStatus "open, locked, final (R59)"
    DateTime summaryStatusChangedAt "lần tạm khóa hoặc chốt gần nhất"
  }

  EmailToken {
    String id PK
    String planId FK
    String purpose "verify_email, unlock, reset_passcode"
    String tokenHash "lưu dạng hash"
    DateTime expiresAt "đổi passcode: 1 giờ (R11)"
    DateTime usedAt "dùng một lần"
    DateTime createdAt
  }

  Participant {
    String participantId PK
    String planId FK
    String displayName
    String status "active hoặc inactive (R13)"
    Boolean hasPaid "R23"
    DateTime createdAt "thứ tự hiển thị"
  }

  PaymentInstallment {
    String id PK
    String participantId FK
    Int number "đợt 1, đợt 2"
    Decimal amount "NUMERIC(14,3)"
    Boolean isPaid
  }

  PaymentQr {
    String planId PK, FK "mỗi kế hoạch tối đa một QR (R54)"
    String collectorParticipantId FK "người thu tiền"
    String imagePath "storage riêng tư (R57)"
    String label "tùy chọn, ví dụ tên ngân hàng"
    DateTime updatedAt "hiển thị trong tổng kết (R56)"
  }

  Expense {
    String expenseId PK
    String planId FK
    String description
    Decimal amount "NUMERIC(14,3), lớn hơn 0 (R14, R18)"
    String paidByParticipantId FK "R15"
    DateTime dateTime
    String notes "tùy chọn"
    String activityId FK "tùy chọn (R25)"
    DateTime createdAt "dùng khi trùng ngày giờ (R60)"
  }

  ExpenseShare {
    String expenseId PK, FK
    String participantId PK, FK
    Decimal ratio "lớn hơn 0, mặc định 1 (R16)"
  }

  Activity {
    String activityId PK
    String planId FK
    String name
    DateTime dateTime "ngày giờ dự kiến (R60)"
    String location
    String mapLink "tùy chọn"
    String notes "tùy chọn"
    Int order "thứ tự giữa các hoạt động cùng giờ (R60)"
  }

  Stay {
    String stayId PK
    String planId FK
    String name
    String area "nhập tự do"
    String areaSearch "bản không dấu (R34)"
    String country "ISO 3166-1"
    String address "tùy chọn"
    String mapLink "tùy chọn"
    DateTime checkInDate "chỉ ngày (R31)"
    DateTime checkOutDate "chỉ ngày, sau checkInDate"
  }

  FoodItem {
    String foodItemId PK
    String planId FK
    DateTime date "tùy chọn, trống nếu chưa xếp ngày (R33)"
    String mealSlot "morning, afternoon, evening; có thể trống"
    String dishName
    String placeName "tùy chọn"
    String directions "tùy chọn, nhập tự do"
    String notes "tùy chọn"
    Int order "thứ tự giữa các món cùng ngày, cùng buổi"
  }
```
