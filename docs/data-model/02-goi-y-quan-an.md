# Data model — Tài khoản và Gợi ý quán ăn

Các bảng của module [04](../requirements/04-goi-y-quan-an.md), cùng các cột app thêm vào tài khoản. Plan chỉ hiện khóa chính; đủ cột ở [01-ke-hoach.md](01-ke-hoach.md). Món áp dụng vào kế hoạch là bản sao độc lập nên FoodItem không liên kết tới FoodGuide (R41). Quy tắc xóa và ràng buộc: [README](README.md).

```mermaid
erDiagram
  Account ||--o{ FoodGuide : "đăng"
  FoodGuide ||--|{ FoodGuideEntry : "gồm"
  FoodGuide ||--o{ GuideVote : "được bấm hữu ích"
  Account ||--o{ GuideVote : "bấm hữu ích"
  FoodGuide ||--o{ GuideReport : "bị báo cáo"
  Account |o--o{ GuideReport : "báo cáo"
  FoodGuide ||--o{ GuideApplication : "được áp dụng"
  Plan ||--o{ GuideApplication : "đã áp dụng"

  Account {
    String id PK "do Better Auth quản lý, kèm email"
    String language "vi hoặc en (R28)"
    String username "không cần duy nhất (R35)"
    String userTag "do app cấp; username + tag duy nhất (R37)"
    Boolean isAdmin "R44"
    Boolean isBlocked "R44"
  }

  FoodGuide {
    String guideId PK
    String authorId FK "Account"
    String title
    String area "nhập tự do"
    String areaSearch "bản không dấu (R34)"
    String country "ISO 3166-1"
    String description
    String language "ngôn ngữ viết"
    Boolean isLocal "Tôi sống ở đây (R37)"
    String status "published, hidden (do báo cáo), removed (admin gỡ)"
    Int helpfulCount "R42"
    Int applyCount "lượt sử dụng (R41)"
    DateTime createdAt
    DateTime updatedAt "Cập nhật lần cuối (R39)"
  }

  FoodGuideEntry {
    String entryId PK
    String guideId FK
    String dishName
    String placeName "ít nhất 3 quán khác nhau mỗi danh sách (R35)"
    String directions "nhập tự do (R36)"
    String mealSlot "tùy chọn"
    String notes "tùy chọn"
    Int order
  }

  GuideVote {
    String guideId PK, FK
    String accountId PK, FK
    DateTime createdAt
  }

  GuideReport {
    String reportId PK
    String guideId FK
    String reason "ads, wrong_info, closed, inappropriate"
    String reporterAccountId FK "Account, tùy chọn"
    String reporterIpHash "khi chưa đăng nhập; xóa sau 30 ngày (R53)"
    DateTime createdAt
  }

  GuideApplication {
    String guideId PK, FK
    String planId PK, FK
    DateTime appliedAt "lần đầu áp dụng vào kế hoạch"
  }

  Plan {
    String planId PK
  }
```
