# Data model — Chia sẻ hành trình

Các bảng của module [07](../requirements/07-chia-se-hanh-trinh.md). Account và Plan chỉ hiện khóa chính; đủ cột ở [02-goi-y-quan-an.md](02-goi-y-quan-an.md) và [01-ke-hoach.md](01-ke-hoach.md). Hành trình là bản sao độc lập của kế hoạch, nên các mục của nó không liên kết tới Activity, Stay hay FoodItem; kế hoạch sao chép từ hành trình cũng không liên kết ngược lại (R66, R68). Quy tắc xóa và ràng buộc: [README](README.md).

```mermaid
erDiagram
  Account ||--o{ Itinerary : "đăng"
  Plan |o--o| Itinerary : "được chia sẻ thành"
  Itinerary ||--|{ ItineraryActivity : "gồm"
  Itinerary ||--o{ ItineraryStay : "gồm"
  Itinerary ||--o{ ItineraryFood : "gồm"
  Itinerary ||--o{ ItineraryVote : "được bấm hữu ích"
  Account ||--o{ ItineraryVote : "bấm hữu ích"
  Itinerary ||--o{ ItineraryReport : "bị báo cáo"
  Account |o--o{ ItineraryReport : "báo cáo"

  Itinerary {
    String itineraryId PK
    String authorId FK "Account, chủ kế hoạch gốc (R63)"
    String sourcePlanId FK "Plan, tùy chọn, duy nhất; không gửi cho người xem (R63, R66)"
    String title "1 đến 50 ký tự (R73)"
    String destination
    String destinationSearch "bản không dấu (R34)"
    String description "tùy chọn"
    String language "ngôn ngữ viết"
    String theme "theme của plan gốc"
    Int dayCount
    Int groupSize "số người có trong tổng kết"
    Decimal estimatedCostPerPerson "tùy chọn (R65)"
    String currency "mã ISO 4217, theo plan gốc (R1)"
    String status "published, hidden (do báo cáo), removed (admin gỡ)"
    Int helpfulCount "R69"
    Int copyCount "lượt sao chép (R68)"
    DateTime createdAt
    DateTime updatedAt "Cập nhật lần cuối (R66)"
  }

  ItineraryActivity {
    String itemId PK
    String itineraryId FK
    Int day "1 đến dayCount (R64)"
    String time "giờ dự kiến"
    String name
    String location
    String mapLink "tùy chọn"
    String notes "tùy chọn"
    Int order
  }

  ItineraryStay {
    String itemId PK
    String itineraryId FK
    String name
    String area
    String areaSearch "bản không dấu (R34)"
    String country "ISO 3166-1"
    String address "tùy chọn"
    String mapLink "tùy chọn"
    Int checkInDay "ngày của đêm đầu tiên"
    Int checkOutDay "ngày rời đi"
  }

  ItineraryFood {
    String itemId PK
    String itineraryId FK
    String dishName
    String placeName "tùy chọn"
    String directions "tùy chọn"
    String[] mealSlots "tùy chọn, chọn được nhiều"
    String notes "tùy chọn"
    Int order
  }

  ItineraryVote {
    String itineraryId PK, FK
    String accountId PK, FK
    DateTime createdAt
  }

  ItineraryReport {
    String reportId PK
    String itineraryId FK
    String reason "ads, wrong_info, personal_info, inappropriate"
    String reporterAccountId FK "Account, tùy chọn"
    String reporterIpHash "khi chưa đăng nhập; xóa sau 30 ngày (R53)"
    DateTime createdAt
  }

  Account {
    String id PK
  }

  Plan {
    String planId PK
  }
```
