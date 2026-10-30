# Data model — Chiêu mộ bạn đồng hành

Các bảng của module [08](../requirements/08-chieu-mo.md). Plan và Account chỉ hiện khóa chính; đủ cột ở [01-ke-hoach.md](01-ke-hoach.md) và [02-goi-y-quan-an.md](02-goi-y-quan-an.md). Quy tắc xóa và ràng buộc: [README](README.md).

```mermaid
erDiagram
  Plan ||--o| RecruitPost : "có tối đa một tin"
  RecruitPost ||--o{ JoinRequest : "nhận"
  Account ||--o{ JoinRequest : "gửi"
  JoinRequest ||--o{ ContactViewLog : "được xem liên hệ"
  RecruitPost ||--o{ RecruitReport : "bị báo cáo"
  Account ||--o{ AccountReport : "bị báo cáo"
  Account ||--o{ AccountBlock : "chặn"

  Plan {
    String planId PK "chi tiết ở 01-ke-hoach.md"
  }

  Account {
    String id PK "chi tiết ở 02-goi-y-quan-an.md"
    Boolean recruitEmails "nhận email chiêu mộ, mặc định bật (R90)"
  }

  RecruitPost {
    String postId PK
    String planId FK, UK "mỗi kế hoạch tối đa một tin (R86)"
    String title "1 đến 50 ký tự, đếm theo NFC"
    Int seatsWanted "1 đến 20"
    Int seatsTaken "tổng partySize của yêu cầu đã duyệt"
    Decimal costPerPerson "tùy chọn, theo Plan.currency"
    String description "tối đa 1.000 ký tự"
    String wishes "tùy chọn, tối đa 500 ký tự"
    String language
    String destinationSearch "bản không dấu của Plan.location (R34, R87)"
    String status "open, closed, hidden, removed"
    String closedReason "full, owner, started, summary"
    DateTime closedAt "lần đóng gần nhất"
    DateTime createdAt
    DateTime updatedAt
  }

  JoinRequest {
    String requestId PK
    String postId FK
    String requesterId FK "Account"
    Int partySize "tính cả người gửi (R88)"
    String message "1 đến 500 ký tự"
    Bytes contactsEnc "danh sách kênh và giá trị, mã hóa AES-GCM (R91)"
    DateTime contactsPurgedAt "xóa 30 ngày sau khi có kết quả"
    String status "pending, accepted, declined, withdrawn, expired"
    String role "editor hoặc viewer khi duyệt (R89)"
    DateTime decidedAt
    DateTime createdAt
  }

  ContactViewLog {
    String id PK
    String requestId FK
    String accountId FK "chủ kế hoạch"
    DateTime viewedAt
  }

  RecruitReport {
    String reportId PK
    String postId FK
    String reason "fraud, ads, wrong_info, inappropriate"
    String reporterAccountId FK "tùy chọn"
    String reporterIpHash "tùy chọn, xóa sau 30 ngày (R53)"
    DateTime createdAt
  }

  AccountReport {
    String reportId PK
    String reportedAccountId FK
    String reporterAccountId FK
    String reason "fraud, harassment, impersonation, inappropriate"
    String requestId FK "tùy chọn, báo cáo từ yêu cầu xin đi cùng"
    DateTime createdAt
  }

  AccountBlock {
    String blockerId PK, FK
    String blockedId PK, FK
    DateTime createdAt
  }
```

Điểm đến, ngày đi, ngày về, số người trong nhóm và lịch trình của tin đọc trực tiếp từ Plan, Participant và Activity, không lưu lại trong RecruitPost (R86). Người được duyệt có thêm một dòng PlanMember với `joinedVia = request` ([01-ke-hoach.md](01-ke-hoach.md)).
