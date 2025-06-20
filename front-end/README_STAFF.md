# Staff Page - Hướng dẫn sử dụng

## Tổng quan
Staff Page là trang quản lý hành chính dành cho nhân viên y tế (role STAFF) trong hệ thống HIV Care. Trang này cung cấp các chức năng quản lý lịch hẹn, hồ sơ bệnh nhân và nhắc nhở.

## Các chức năng chính

### 1. Quản lý lịch hẹn
- **Xem danh sách lịch hẹn**: Hiển thị tất cả lịch hẹn với thông tin bệnh nhân, bác sĩ, ngày giờ, loại và trạng thái
- **Chỉnh sửa lịch hẹn**: Cập nhật thông tin lịch hẹn như ngày, giờ, loại, ghi chú
- **Xác nhận lịch hẹn**: Chuyển trạng thái từ "Đã lên lịch" sang "Đã xác nhận"
- **Hủy lịch hẹn**: Chuyển trạng thái sang "Đã hủy"
- **Xóa lịch hẹn**: Xóa hoàn toàn lịch hẹn khỏi hệ thống
- **Xem chi tiết**: Xem thông tin đầy đủ của lịch hẹn

### 2. Quản lý hồ sơ bệnh nhân
- **Xem danh sách bệnh nhân**: Hiển thị thông tin cơ bản của tất cả bệnh nhân
- **Thêm bệnh nhân mới**: Tạo hồ sơ bệnh nhân mới với đầy đủ thông tin
- **Chỉnh sửa hồ sơ**: Cập nhật thông tin bệnh nhân
- **Xem chi tiết**: Xem thông tin đầy đủ của bệnh nhân
- **Xóa hồ sơ**: Xóa hồ sơ bệnh nhân khỏi hệ thống
- **Tìm kiếm và lọc**: Tìm kiếm theo tên, email, mã hồ sơ và lọc theo giới tính

### 3. Quản lý nhắc nhở
- **Xem danh sách nhắc nhở**: Hiển thị tất cả nhắc nhở với thông tin bệnh nhân, loại, mức độ ưu tiên
- **Tạo nhắc nhở mới**: Tạo nhắc nhở cho bệnh nhân với các loại: thuốc, tái khám, xét nghiệm, lịch hẹn
- **Gửi nhắc nhở**: Chuyển trạng thái từ "Chờ xử lý" sang "Đã gửi"
- **Hoàn thành nhắc nhở**: Đánh dấu nhắc nhở đã hoàn thành
- **Chỉnh sửa nhắc nhở**: Cập nhật thông tin nhắc nhở
- **Xóa nhắc nhở**: Xóa nhắc nhở khỏi hệ thống
- **Theo dõi trạng thái**: Hiển thị nhắc nhở quá hạn với cảnh báo đặc biệt

## Cách sử dụng

### Đăng nhập
1. Truy cập trang đăng nhập với tài khoản có role STAFF
2. Sau khi đăng nhập thành công, hệ thống sẽ tự động chuyển hướng đến `/staff`

### Quản lý lịch hẹn
1. Chọn tab "Lịch hẹn"
2. Sử dụng thanh tìm kiếm để tìm lịch hẹn theo tên bệnh nhân hoặc bác sĩ
3. Sử dụng bộ lọc để lọc theo trạng thái
4. Click vào các icon để thực hiện thao tác:
   - 👁️ Xem chi tiết
   - ✏️ Chỉnh sửa
   - ✅ Xác nhận (chỉ hiển thị với lịch hẹn "Đã lên lịch")
   - ❌ Hủy (chỉ hiển thị với lịch hẹn "Đã lên lịch")
   - 🗑️ Xóa

### Quản lý hồ sơ bệnh nhân
1. Chọn tab "Hồ sơ bệnh nhân"
2. Click "Thêm bệnh nhân" để tạo hồ sơ mới
3. Sử dụng thanh tìm kiếm để tìm bệnh nhân
4. Sử dụng bộ lọc để lọc theo giới tính
5. Click vào các nút để thực hiện thao tác:
   - "Chi tiết": Xem thông tin đầy đủ
   - ✏️ Chỉnh sửa
   - 🗑️ Xóa

### Quản lý nhắc nhở
1. Chọn tab "Nhắc nhở"
2. Click "Tạo nhắc nhở" để tạo nhắc nhở mới
3. Chọn loại nhắc nhở: Thuốc, Tái khám, Xét nghiệm, Lịch hẹn
4. Điền thông tin: tin nhắn, ngày hạn, giờ hạn, mức độ ưu tiên, ghi chú
5. Click vào các nút để thực hiện thao tác:
   - "Gửi": Gửi nhắc nhở (chỉ hiển thị với trạng thái "Chờ xử lý")
   - "Hoàn thành": Đánh dấu hoàn thành (chỉ hiển thị với trạng thái "Đã gửi")
   - ✏️ Chỉnh sửa
   - 🗑️ Xóa

## Tính năng đặc biệt

### Nhắc nhở quá hạn
- Nhắc nhở quá hạn sẽ được hiển thị với viền đỏ và nền đỏ nhạt
- Icon cảnh báo sẽ xuất hiện bên cạnh tên bệnh nhân
- Giúp staff dễ dàng nhận biết và xử lý kịp thời

### Thống kê nhanh
- Hiển thị số lượng lịch hẹn hôm nay
- Hiển thị tổng số bệnh nhân
- Hiển thị số nhắc nhở đang chờ xử lý

### Responsive Design
- Giao diện tương thích với các thiết bị khác nhau
- Layout tự động điều chỉnh theo kích thước màn hình

## API Endpoints

### Appointments
- `GET /api/appointments` - Lấy danh sách lịch hẹn
- `GET /api/appointments/{id}` - Lấy chi tiết lịch hẹn
- `PUT /api/appointments/{id}` - Cập nhật lịch hẹn
- `DELETE /api/appointments/{id}` - Xóa lịch hẹn
- `PUT /api/appointments/{id}/confirm` - Xác nhận lịch hẹn
- `PUT /api/appointments/{id}/cancel` - Hủy lịch hẹn

### Patients
- `GET /api/patients` - Lấy danh sách bệnh nhân
- `GET /api/patients/{id}` - Lấy chi tiết bệnh nhân
- `PUT /api/patients/{id}` - Cập nhật hồ sơ bệnh nhân
- `GET /api/patients/{id}/medical-history` - Lấy lịch sử y tế

### Reminders
- `GET /api/treatment-reminders` - Lấy danh sách nhắc nhở
- `POST /api/treatment-reminders` - Tạo nhắc nhở mới
- `PUT /api/treatment-reminders/{id}` - Cập nhật nhắc nhở
- `DELETE /api/treatment-reminders/{id}` - Xóa nhắc nhở
- `PUT /api/treatment-reminders/{id}/send` - Gửi nhắc nhở
- `PUT /api/treatment-reminders/{id}/complete` - Hoàn thành nhắc nhở

## Bảo mật
- Chỉ người dùng có role STAFF mới có thể truy cập
- Tất cả API calls đều yêu cầu JWT token
- Token tự động được gửi trong header Authorization
- Session timeout sau 30 phút không hoạt động

## Lưu ý
- Đảm bảo backend API đang chạy trước khi sử dụng
- Kiểm tra kết nối internet để đảm bảo API calls thành công
- Backup dữ liệu trước khi thực hiện các thao tác xóa
- Liên hệ admin nếu gặp lỗi hoặc cần hỗ trợ 