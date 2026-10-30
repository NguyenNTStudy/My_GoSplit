# Data model — Tài khoản và Gợi ý quán ăn

Các bảng của module [04](../requirements/04-goi-y-quan-an.md), cùng các cột app thêm vào tài khoản. Plan chỉ hiện khóa chính; đủ cột ở [01-ke-hoach.md](01-ke-hoach.md). Món áp dụng vào kế hoạch là bản sao độc lập nên FoodItem không liên kết tới FoodGuide (R41). Quy tắc xóa và ràng buộc: [README](README.md).

```mermaid
erDiagram
  Account ||--o{ FoodGuide : "đăng"
  FoodGuide ||--|{ FoodGuideEntry : "gồm"
  FoodGuide ||--o{ GuideHeart : "được thả tim"
  Account ||--o{ GuideHeart : "thả tim"
  FoodGuide ||--o{ GuideReport : "bị báo cáo"
  Account |o--o{ GuideReport : "báo cáo"
  FoodGuide ||--o{ GuideApplication : "được áp dụng"
  Plan ||--o{ GuideApplication : "đã áp dụng"

  Account {
    String id PK "do Better Auth quản lý, kèm email"
    String language "vi hoặc en (R28)"
    String displayName "tên tác giả, không cần duy nhất (R78)"
    String username "duy nhất, chữ thường, chỉ để đăng nhập (R78)"
    String userTag "do app cấp, duy nhất (R37)"
    String publicId "ngẫu nhiên, duy nhất; địa chỉ trang người dùng (R83)"
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
    Int heartCount "R42"
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
    String[] mealSlots "tùy chọn, chọn được nhiều"
    String notes "tùy chọn"
    Int order
  }

  GuideHeart {
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
