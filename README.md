# CodeceptJS CICD Testing Project

Dự án này minh họa kiểm thử tự động với CodeceptJS + Playwright và tích hợp CI/CD với GitHub Actions.

## 1. Khởi động web server đơn giản

```bash
npm run start:web
```
- Truy cập http://localhost:3000 để xem trang demo.
- Trang có tiêu đề, nút "Say Hello" và form đăng nhập (user: admin, pass: 123).

## 2. Chạy test CodeceptJS

- Test trang demo:
  ```bash
  npx codeceptjs run --steps simple_web_test.ts
  ```
- Test trang ví dụ (example.com):
  ```bash
  npx codeceptjs run --steps example_test.ts
  ```

## 3. Hướng dẫn git & đẩy code lên GitHub

1. Khởi tạo git (nếu chưa có):
   ```bash
   git init
   ```
2. Thêm remote:
   ```bash
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   ```
3. Tạo nhánh mới (nếu muốn):
   ```bash
   git checkout -b feature/simple-web
   ```
4. Thêm và commit code:
   ```bash
   git add .
   git commit -m "Thêm simple-web và test CodeceptJS"
   ```
5. Đẩy code lên GitHub:
   ```bash
   git push -u origin feature/simple-web
   ```

## 4. CI/CD với GitHub Actions
- Đã cấu hình sẵn workflow tại `.github/workflows/test.yml`.
- Khi push code lên GitHub, workflow sẽ tự động cài đặt, chạy test và lưu kết quả.

## 5. Cấu trúc dự án
- `simple-web/` : Web server Express đơn giản để test
- `simple_web_test.ts` : Test CodeceptJS cho simple-web
- `example_test.ts` : Test CodeceptJS cho example.com
- `.github/workflows/test.yml` : Cấu hình CI/CD
- `README.md` : Hướng dẫn sử dụng

---
Nếu có thắc mắc hoặc muốn mở rộng test, hãy liên hệ hoặc tạo issue trên GitHub repo của bạn! 