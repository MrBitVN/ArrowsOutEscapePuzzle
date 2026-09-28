# 🏹 Arrow Escape - Escape Puzzle Game

Game giải đố vượt ngục mũi tên đa nền tảng (**Android**, **iOS** và **Web Mobile**), được thiết kế đồ hoạ 3D mượt mà và logic giải đố chuẩn xác theo đúng các màn hình mẫu:

1. **Language Selection Screen** (Màn chọn ngôn ngữ: Tiếng Việt, English, French, Spanish, German, Korean, Italian, Indonesian, Hindi, Japanese).
2. **Main Menu Screen** (Trang chủ menu: Logo 3D ARROW ESCAPE, Nút VIP Crown, Cài đặt Gear, 3 thẻ chức năng 3D: **Game**, **Challenge**, **Daily**).
3. **Map Screen** (Bản đồ 100 màn chơi đường cong uốn lượn trên nền gạch đá & bờ cát, bong bóng bóng loáng, nút xanh lá "Play (Level X)").
4. **Challenge Screen** (Chế độ thử thách với các tab: **Easy**, **Medium**, **Hard**, thẻ màn chơi có biểu tượng `?` và huy hiệu cánh sao khi hoàn thành).
5. **Game Arena Screen** (Màn chơi câu đố: Hiển thị Level, 3 Trái tim ❤️❤️❤️, Hộp tường đen & các mũi tên thẳng, mũi tên uốn góc/bent arrows. Cơ chế va chạm & thoát ra. 4 công cụ bổ trợ ở dưới đáy: Gợi ý 💡, Cục tẩy 🧼, Đũa thần 🪄, Thước kẻ laser 📏).

---

## 📱 Cài Đặt & Chạy Ứng Dụng

### 1. Chạy trên trình duyệt (Web / Mobile Simulator)
```bash
npm install
npm run dev
```
Truy cập: `http://localhost:5173/`

### 2. Xuất và chạy trên Android (Android Studio / APK)
```bash
npm run build
npx cap sync
npx cap open android
```
*Lệnh trên sẽ mở thư mục `android/` trong Android Studio. Bạn chỉ cần nhấn **Run** (để chạy trên máy ảo hoặc điện thoại Android thật) hoặc chọn **Build > Build Bundle(s) / APK(s) > Build APK** để xuất file cài đặt `.apk`.*

### 3. Xuất và chạy trên iOS (iPhone / iPad qua Xcode trên macOS)
```bash
npm run build
npx cap sync
npx cap open ios
```
*Lệnh trên sẽ mở Xcode với workspace `ios/App/App.xcworkspace`. Bạn có thể chạy trên iPhone Simulator hoặc build ra file `.ipa` để phân phối lên App Store / TestFlight.*

---

## 🎮 Chi Tiết 4 Công Cụ Bổ Trợ (Boosters)
- 💡 **Gợi ý (Hint)**: Tự động phân tích toàn bộ màn chơi và nhấp nháy phát sáng mũi tên an toàn có thể thoát ngay lập tức.
- 🧼 **Cục tẩy (Eraser)**: Kích hoạt chế độ tẩy xóa. Người chơi chạm vào bất kỳ mũi tên chắn đường nào để xoá nó khỏi bàn cờ.
- 🪄 **Đũa thần (Magic Wand)**: Tự động đưa một mũi tên bay xuyên vật cản thoát ngay ra ngoài màn hình một cách kỳ diệu.
- 📏 **Thước kẻ (Laser Ruler)**: Kích hoạt tia laser định hướng quỹ đạo cho toàn bộ mũi tên (Tia màu xanh = đường thoát an toàn, Tia màu đỏ = bị tường hoặc mũi tên khác chặn).

---

## 🧠 Công Nghệ & Thuật Toán Solvability
- **Engine Vật Lý & Va Chạm**: Hệ thống raycasting và kiểm tra giao điểm đoạn thẳng (`linesIntersect`), sweep collision cho cả mũi tên thẳng và mũi tên gấp khúc (bent / hooked arrows).
- **100 Màn Chơi Chính (Map)**: 100% các màn đều được kiểm định bằng bộ test giải thuật tự động, đảm bảo có nước đi ban đầu và hoàn toàn giải được.
- **30 Màn Chơi Thử Thách (Challenge)**: Chia thành 3 cấp độ Easy, Medium, Hard với mật độ mũi tên và độ phức tạp cao hơn.
- **Màn Hàng Ngày (Daily Puzzle)**: Sinh câu đố ngẫu nhiên theo từng ngày dương lịch.
- **Bộ Tổng Hợp Âm Thanh (Web Audio API Synthesizer)**: Tạo âm thanh click, tiếng gió vút khi mũi tên thoát, âm trầm khi va chạm, fanfare chiến thắng mà không cần phụ thuộc vào file MP3 bên ngoài.
