-- Insert roles
INSERT INTO roles (role_name, description) VALUES
('ROLE_ADMIN', 'Administrator role'),
('ROLE_DOCTOR', 'Doctor role'),
('ROLE_PATIENT', 'Patient role');

-- Insert users
INSERT INTO users (username, password, email, full_name, phone_number, role_id, created_at, updated_at) VALUES
('admin', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'admin@example.com', 'Admin User', '0123456789', (SELECT id FROM roles WHERE role_name = 'ROLE_ADMIN'), GETDATE(), GETDATE()),
('doctor1', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'doctor1@example.com', 'Doctor One', '0123456781', (SELECT id FROM roles WHERE role_name = 'ROLE_DOCTOR'), GETDATE(), GETDATE()),
('doctor2', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'doctor2@example.com', 'Doctor Two', '0123456782', (SELECT id FROM roles WHERE role_name = 'ROLE_DOCTOR'), GETDATE(), GETDATE()),
('patient1', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'patient1@example.com', 'Patient One', '0123456783', (SELECT id FROM roles WHERE role_name = 'ROLE_PATIENT'), GETDATE(), GETDATE()),
('patient2', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'patient2@example.com', 'Patient Two', '0123456784', (SELECT id FROM roles WHERE role_name = 'ROLE_PATIENT'), GETDATE(), GETDATE());

-- Insert doctors
INSERT INTO doctors (user_id, doctor_code, full_name, specialization, qualification, license_number, experience, rating, avatar_url, created_at, updated_at) VALUES
((SELECT id FROM users WHERE username = 'doctor1'), 'DOC001', 'Doctor One', 'HIV Specialist', 'MD', 'LIC001', 10, 4.5, 'https://example.com/doctor1.jpg', GETDATE(), GETDATE()),
((SELECT id FROM users WHERE username = 'doctor2'), 'DOC002', 'Doctor Two', 'General Practitioner', 'MD', 'LIC002', 8, 4.8, 'https://example.com/doctor2.jpg', GETDATE(), GETDATE());

-- Insert patients
INSERT INTO patients (user_id, patient_code, full_name, date_of_birth, gender, address, phone_number, email, created_at, updated_at) VALUES
((SELECT id FROM users WHERE username = 'patient1'), 'PAT001', 'Patient One', '1990-01-01', 'Male', '123 Main St', '0123456783', 'patient1@example.com', GETDATE(), GETDATE()),
((SELECT id FROM users WHERE username = 'patient2'), 'PAT002', 'Patient Two', '1992-02-02', 'Female', '456 Oak St', '0123456784', 'patient2@example.com', GETDATE(), GETDATE());

-- Insert medical services
INSERT INTO medical_services (name, description, default_duration, price, created_at, updated_at) VALUES
('Khám tổng quát', 'Khám sức khỏe tổng quát và tư vấn', 30, 200000, GETDATE(), GETDATE()),
('Tư vấn HIV', 'Tư vấn về HIV và các bệnh lây truyền qua đường tình dục', 45, 150000, GETDATE(), GETDATE()),
('Xét nghiệm máu', 'Xét nghiệm máu cơ bản', 15, 300000, GETDATE(), GETDATE()),
('Tư vấn dinh dưỡng', 'Tư vấn về chế độ dinh dưỡng cho người nhiễm HIV', 30, 100000, GETDATE(), GETDATE());

-- Insert consultation types
INSERT INTO consultation_types (name, description, created_at, updated_at) VALUES
('Online', 'Tư vấn trực tuyến qua video call', GETDATE(), GETDATE()),
('Offline', 'Tư vấn trực tiếp tại phòng khám', GETDATE(), GETDATE());

-- Insert consultation time slots for today
INSERT INTO consultation_time_slots (doctor_id, start_time, end_time, is_booked, created_at, updated_at) VALUES
((SELECT id FROM doctors WHERE doctor_code = 'DOC001'), DATEADD(hour, 9, GETDATE()), DATEADD(hour, 10, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC001'), DATEADD(hour, 10, GETDATE()), DATEADD(hour, 11, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC001'), DATEADD(hour, 14, GETDATE()), DATEADD(hour, 15, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC001'), DATEADD(hour, 15, GETDATE()), DATEADD(hour, 16, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC002'), DATEADD(hour, 9, GETDATE()), DATEADD(hour, 10, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC002'), DATEADD(hour, 10, GETDATE()), DATEADD(hour, 11, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC002'), DATEADD(hour, 14, GETDATE()), DATEADD(hour, 15, GETDATE()), 0, GETDATE(), GETDATE()),
((SELECT id FROM doctors WHERE doctor_code = 'DOC002'), DATEADD(hour, 15, GETDATE()), DATEADD(hour, 16, GETDATE()), 0, GETDATE(), GETDATE());

-- Insert lab test types
INSERT INTO lab_test_types (name, description, price, duration_minutes, created_at, updated_at) VALUES
('HIV Antibody Test', 'Xét nghiệm kháng thể HIV để phát hiện nhiễm HIV', 150000.0, 30, GETDATE(), GETDATE()),
('CD4 Count', 'Đếm số lượng tế bào CD4 để đánh giá hệ miễn dịch', 300000.0, 45, GETDATE(), GETDATE()),
('Viral Load Test', 'Đo lượng virus HIV trong máu', 500000.0, 60, GETDATE(), GETDATE()),
('Complete Blood Count (CBC)', 'Xét nghiệm tổng phân tích tế bào máu', 200000.0, 30, GETDATE(), GETDATE());

-- Insert lab bookings
INSERT INTO lab_bookings (patient_id, test_type_id, date, time_slot_id, notes, status, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM lab_test_types WHERE name = 'HIV Antibody Test'), GETDATE(), NULL, 'Chuẩn bị trước 30 phút', 'Scheduled', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM lab_test_types WHERE name = 'CD4 Count'), DATEADD(day, 1, GETDATE()), NULL, 'Không ăn sáng', 'Scheduled', GETDATE(), GETDATE());