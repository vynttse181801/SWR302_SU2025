# DateTime Checker API Testing

Dự án này thực hiện API testing cho ứng dụng DateTime Checker.

## Cấu trúc dự án
```
DateTimeChecker/
├── backend/                 # Backend Spring Boot
│   ├── src/                # Mã nguồn backend
│   └── pom.xml             # Cấu hình Maven
├── tests/                  # Thư mục chứa test cases
│   ├── date_validation_test.js  # File test chính
│   ├── codecept.conf.js    # Cấu hình test cụ thể
│   └── outputs/            # Kết quả test
├── codecept.conf.js        # Cấu hình CodeceptJS chính
├── package.json           # Dependencies cho testing
└── README.md              # Tài liệu dự án
```

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

## Cấu hình Test
Dự án sử dụng 2 file cấu hình CodeceptJS:

1. `codecept.conf.js` (thư mục gốc):
   - File cấu hình chính cho CodeceptJS
   - Cấu hình cơ bản: endpoint, headers, timeout
   - Đường dẫn test: `./tests/*_test.js`
   - Output: `./tests/outputs`

2. `tests/codecept.conf.js`:
   - Cấu hình cụ thể cho các test case
   - Bổ sung plugins và cấu hình chi tiết
   - Đường dẫn test: `./*_test.js`
   - Output: `./outputs`

## Test Cases
Dự án bao gồm các test case:
- Valid date test
- Invalid day/month/year test
- Leap year test
- Non-leap year test
- Edge cases (January 1, December 31)
- Null values test
- Non-numeric values test
- Out of range values test
- Missing fields test

## Công nghệ sử dụng
- Backend: Spring Boot
- Testing: CodeceptJS
- Language: TypeScript
- Build Tool: Maven (backend), npm (testing)