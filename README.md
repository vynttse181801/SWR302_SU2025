# DateTime Checker API Testing

Dự án này thực hiện API testing cho ứng dụng DateTime Checker.

## Cấu trúc dự án
- `backend/`: Chứa mã nguồn API cần test
- `tests/`: Chứa các test case và cấu hình test

## Cài đặt
1. Cài đặt dependencies cho testing:
```bash
npm install
```

2. Cài đặt dependencies cho backend:
```bash
cd backend
mvn install
```

## Chạy test
1. Khởi động backend:
```bash
cd backend
mvn spring-boot:run
```

2. Chạy test:
```bash
npm test
```

## Công nghệ sử dụng
- Backend: Spring Boot
- Testing: CodeceptJS
- Language: TypeScript