# Hệ thống Quản lý Quyền Truy cập ADMIN

## Tổng quan

Hệ thống HIV Care đã được cấu hình để đảm bảo rằng tài khoản với role `ROLE_ADMIN` chỉ có thể truy cập trang quản trị và không thể vào các trang khác của hệ thống.

## Cách hoạt động

### 1. Role-Based Routing

- **Admin Routes**: Chỉ ADMIN users mới có thể truy cập các route bắt đầu bằng `/admin`
- **Public Routes**: ADMIN users sẽ được tự động chuyển hướng đến `/admin` khi cố gắng truy cập các trang công khai
- **Protected Routes**: Các route được bảo vệ sẽ chuyển hướng ADMIN users về trang admin

### 2. Components chính

#### AdminLayout (`/src/components/AdminLayout.tsx`)
- Bọc tất cả admin pages
- Kiểm tra quyền truy cập
- Cung cấp giao diện admin riêng biệt
- Tự động chuyển hướng non-admin users

#### AdminOnlyRoute (`/src/App.tsx`)
- Component bảo vệ cho admin routes
- Sử dụng AdminLayout cho admin users
- Chuyển hướng non-admin users đến trang phù hợp

#### PublicRoute (`/src/App.tsx`)
- Component cho public routes
- Tự động chuyển hướng ADMIN users đến `/admin`

### 3. Header Component

Header component đã được cập nhật để:
- Ẩn navigation links cho ADMIN users
- Hiển thị badge "ADMIN" 
- Chỉ hiển thị link "Quản lý Hệ thống" cho admin
- Thay đổi màu sắc avatar thành đỏ cho admin

### 4. Login Flow

Sau khi đăng nhập thành công:
- **ADMIN**: Chuyển hướng đến `/admin`
- **DOCTOR**: Chuyển hướng đến `/doctor-profile`
- **PATIENT**: Chuyển hướng đến `/profile`
- **STAFF**: Chuyển hướng đến `/`

## Cấu trúc Files

```
front-end/
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx          # Layout riêng cho admin
│   │   └── Header.tsx               # Header với logic admin
│   ├── pages/
│   │   ├── AdminPage.tsx            # Trang quản lý chính
│   │   └── Login.tsx                # Login với redirect logic
│   └── App.tsx                      # Routing với role-based access
```

## Tính năng Admin Page

### 1. Dashboard
- Thống kê tổng quan về người dùng
- Phân loại theo role (Bệnh nhân, Bác sĩ, Nhân viên)

### 2. Quản lý Người dùng
- Thêm, sửa, xóa người dùng
- Tìm kiếm và lọc theo role
- Sắp xếp theo nhiều tiêu chí

### 3. Giao diện
- Thiết kế riêng biệt cho admin
- Màu sắc đỏ để phân biệt
- Icons và badges cho từng role

## Bảo mật

### 1. Route Protection
- Tất cả admin routes được bảo vệ
- Kiểm tra role trước khi render
- Redirect tự động cho unauthorized access

### 2. Session Management
- Sử dụng sessionStorage để lưu token
- Tự động logout khi token hết hạn
- Clear data khi logout

### 3. API Security
- JWT token được gửi trong headers
- Backend kiểm tra role cho admin endpoints
- Error handling cho unauthorized requests

## Cách sử dụng

### 1. Đăng nhập Admin
```bash
# Sử dụng tài khoản admin có sẵn
Username: admin
Password: password
```

### 2. Truy cập Admin Panel
- Sau khi đăng nhập, tự động chuyển đến `/admin`
- Không thể truy cập các trang khác
- Chỉ có thể sử dụng admin features

### 3. Quản lý Người dùng
- Xem danh sách tất cả users
- Thêm user mới với role phù hợp
- Chỉnh sửa thông tin user
- Xóa user (có confirm)

## Troubleshooting

### 1. Không thể truy cập admin page
- Kiểm tra role trong database
- Đảm bảo token còn hiệu lực
- Clear browser cache và thử lại

### 2. Bị redirect liên tục
- Kiểm tra localStorage/sessionStorage
- Clear all storage và login lại
- Kiểm tra network requests

### 3. Admin page không load
- Kiểm tra API endpoints
- Kiểm tra CORS settings
- Xem console errors

## Development Notes

### 1. Thêm Admin Features
- Tạo component mới trong `/src/components/`
- Thêm route trong `App.tsx`
- Sử dụng `AdminOnlyRoute` wrapper

### 2. Customize Admin Layout
- Chỉnh sửa `AdminLayout.tsx`
- Thêm navigation items
- Thay đổi styling

### 3. Add New Roles
- Cập nhật role checking logic
- Thêm role mapping
- Update redirect rules

## API Endpoints

### Admin Endpoints
```
GET    /api/users              # Lấy danh sách users
POST   /api/users              # Tạo user mới
PUT    /api/users/{id}         # Cập nhật user
DELETE /api/users/{id}         # Xóa user
```

### Authentication
```
POST   /api/users/login        # Đăng nhập
POST   /api/users/register     # Đăng ký (nếu cần)
```

## Security Best Practices

1. **Always validate roles on both frontend and backend**
2. **Use HTTPS in production**
3. **Implement rate limiting for admin endpoints**
4. **Log all admin actions for audit**
5. **Regular security updates**
6. **Backup admin data regularly** 