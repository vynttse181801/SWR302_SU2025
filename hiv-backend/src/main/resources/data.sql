-- Insert roles
INSERT INTO roles (role_name, description) VALUES
('ROLE_ADMIN', 'Administrator role'),
('ROLE_DOCTOR', 'Doctor role'),
('ROLE_PATIENT', 'Patient role'),
('ROLE_STAFF', 'Staff role');

-- Insert users
INSERT INTO users (username, password, email, full_name, phone_number, role_id, created_at, updated_at, status) VALUES
('admin', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'admin@example.com', 'Admin User', '0123456789', (SELECT id FROM roles WHERE role_name = 'ROLE_ADMIN'), GETDATE(), GETDATE(), 'ACTIVE'),
('doctor1', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'doctor1@example.com', 'Doctor One', '0123456781', (SELECT id FROM roles WHERE role_name = 'ROLE_DOCTOR'), GETDATE(), GETDATE(), 'ACTIVE'),
('doctor2', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'doctor2@example.com', 'Doctor Two', '0123456782', (SELECT id FROM roles WHERE role_name = 'ROLE_DOCTOR'), GETDATE(), GETDATE(), 'ACTIVE'),
('patient1', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'patient1@example.com', 'Patient One', '0123456783', (SELECT id FROM roles WHERE role_name = 'ROLE_PATIENT'), GETDATE(), GETDATE(), 'ACTIVE'),
('patient2', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'patient2@example.com', 'Patient Two', '0123456784', (SELECT id FROM roles WHERE role_name = 'ROLE_PATIENT'), GETDATE(), GETDATE(), 'ACTIVE'),
('staff1', '$2a$10$UmUnFkg627d.S4HccQpgcuFohcJy0Aqr4LHweLpc/mEbiUMvGFIJm', 'staff1@example.com', 'Staff One', '0123456799', (SELECT id FROM roles WHERE role_name = 'ROLE_STAFF'), GETDATE(), GETDATE(), 'ACTIVE');

-- Insert doctors
INSERT INTO doctors (user_id, doctor_code, full_name, specialization, qualification, license_number, experience, rating, avatar_url, created_at, updated_at) VALUES
((SELECT id FROM users WHERE username = 'doctor1'), 'DOC001', 'Doctor One', 'HIV Specialist', 'MD', 'LIC001', 10, 4.5, 'https://png.pngtree.com/png-clipart/20241005/original/pngtree-vector-cute-cartoon-doctor-with-uniform-png-image_16205650.png', GETDATE(), GETDATE()),
((SELECT id FROM users WHERE username = 'doctor2'), 'DOC002', 'Doctor Two', 'General Practitioner', 'MD', 'LIC002', 8, 4.8, 'https://img.lovepik.com/photo/60165/5208.jpg_wh860.jpg', GETDATE(), GETDATE());

-- Insert patients
INSERT INTO patients (user_id, patient_code, full_name, date_of_birth, gender, address, phone_number, email, created_at, updated_at) VALUES
((SELECT id FROM users WHERE username = 'patient1'), 'PAT001', 'Patient One', '1990-01-01', 'Male', N'123 Main St', '0123456783', 'patient1@example.com', GETDATE(), GETDATE()),
((SELECT id FROM users WHERE username = 'patient2'), 'PAT002', 'Patient Two', '1992-02-02', 'Female', N'456 Oak St', '0123456784', 'patient2@example.com', GETDATE(), GETDATE());

-- Insert medical services
INSERT INTO medical_services (name, description, default_duration, price, created_at, updated_at) VALUES
(N'Khám tổng quát', N'Khám sức khỏe tổng quát và tư vấn', 30, 200000, GETDATE(), GETDATE()),
(N'Tư vấn HIV', N'Tư vấn về HIV và các bệnh lây truyền qua đường tình dục', 45, 150000, GETDATE(), GETDATE()),
(N'Xét nghiệm máu', N'Xét nghiệm máu cơ bản', 15, 300000, GETDATE(), GETDATE()),
(N'Tư vấn dinh dưỡng', N'Tư vấn về chế độ dinh dưỡng cho người nhiễm HIV', 30, 100000, GETDATE(), GETDATE());

-- Insert consultation types
INSERT INTO consultation_types (name, description, created_at, updated_at) VALUES
(N'Online', N'Tư vấn trực tuyến qua video call', GETDATE(), GETDATE()),
(N'Offline', N'Tư vấn trực tiếp tại phòng khám', GETDATE(), GETDATE());

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
(N'HIV Antibody Test', N'Xét nghiệm kháng thể HIV để phát hiện nhiễm HIV', 150000.0, 30, GETDATE(), GETDATE()),
(N'CD4 Count', N'Đếm số lượng tế bào CD4 để đánh giá hệ miễn dịch', 300000.0, 45, GETDATE(), GETDATE()),
(N'Viral Load Test', N'Đo lượng virus HIV trong máu', 500000.0, 60, GETDATE(), GETDATE()),
(N'Complete Blood Count (CBC)', N'Xét nghiệm tổng phân tích tế bào máu', 200000.0, 30, GETDATE(), GETDATE());

-- Insert ARV Protocols (phác đồ ARV)
INSERT INTO arv_protocols (name, description, is_for_pregnant, is_for_children, created_at, updated_at) VALUES
(N'Phác đồ bậc 1 (TDF + 3TC + EFV)', N'Phác đồ điều trị ARV bậc 1 dành cho người lớn, bao gồm Tenofovir (TDF), Lamivudine (3TC) và Efavirenz (EFV). Áp dụng cho bệnh nhân chưa từng điều trị ARV.', 0, 0, GETDATE(), GETDATE()),
(N'Phác đồ bậc 1 cho phụ nữ mang thai (TDF + 3TC + DTG)', N'Phác đồ điều trị ARV bậc 1 dành cho phụ nữ mang thai, bao gồm Tenofovir (TDF), Lamivudine (3TC) và Dolutegravir (DTG).', 1, 0, GETDATE(), GETDATE()),
(N'Phác đồ bậc 1 cho trẻ em (ABC + 3TC + LPV/r)', N'Phác đồ điều trị ARV bậc 1 dành cho trẻ em, bao gồm Abacavir (ABC), Lamivudine (3TC) và Lopinavir/ritonavir (LPV/r).', 0, 1, GETDATE(), GETDATE()),
(N'Phác đồ bậc 2 (AZT + 3TC + LPV/r)', N'Phác đồ điều trị ARV bậc 2 dành cho bệnh nhân thất bại với phác đồ bậc 1, bao gồm Zidovudine (AZT), Lamivudine (3TC) và Lopinavir/ritonavir (LPV/r).', 0, 0, GETDATE(), GETDATE());

-- Insert lab bookings
INSERT INTO lab_bookings (patient_id, test_type_id, date, time_slot_id, notes, status, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM lab_test_types WHERE name = 'HIV Antibody Test'), GETDATE(), NULL, 'Chuẩn bị trước 30 phút', 'Scheduled', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM lab_test_types WHERE name = 'CD4 Count'), DATEADD(day, 1, GETDATE()), NULL, 'Không ăn sáng', 'Scheduled', GETDATE(), GETDATE());

-- Insert appointments (lịch khám bệnh) - Original appointments
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 1), GETDATE(), '09:00:00', N'Scheduled', N'Bệnh nhân yêu cầu khám tổng quát', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 2), GETDATE(), '10:30:00', N'Scheduled', N'Bệnh nhân cần tư vấn về chế độ ăn', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 4), DATEADD(day, 1, GETDATE()), '14:00:00', N'Pending', N'Bệnh nhân có triệu chứng ho và khó thở', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, 2, GETDATE()), '15:30:00', N'Pending', N'Khám định kỳ', GETDATE(), GETDATE());

-- Thêm các lịch khám bệnh với nhiều trạng thái khác nhau cho Doctor 1 (DOC001)
-- Pending
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, 1, GETDATE()), '08:00:00', N'Pending', N'Bệnh nhân có triệu chứng sốt nhẹ', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, 1, GETDATE()), '11:00:00', N'Pending', N'Bệnh nhân cần tư vấn về thuốc ARV', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 3), DATEADD(day, 2, GETDATE()), '09:30:00', N'Pending', N'Xét nghiệm định kỳ 3 tháng', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 4), DATEADD(day, 3, GETDATE()), '14:30:00', N'Pending', N'Bệnh nhân muốn tư vấn về chế độ ăn kiêng', GETDATE(), GETDATE());
-- Confirmed
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, 4, GETDATE()), '10:00:00', N'Confirmed', N'Bệnh nhân đã xác nhận lịch hẹn', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, 4, GETDATE()), '15:00:00', N'Confirmed', N'Bệnh nhân cần tư vấn về tác dụng phụ thuốc', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 3), DATEADD(day, 5, GETDATE()), '08:30:00', N'Confirmed', N'Xét nghiệm theo dõi điều trị', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 4), DATEADD(day, 5, GETDATE()), '13:00:00', N'Confirmed', N'Tư vấn dinh dưỡng cho người mới nhiễm', GETDATE(), GETDATE());
-- Completed
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, -3, GETDATE()), '09:00:00', N'Completed', N'Bệnh nhân khám tổng quát định kỳ. Kết quả khám: Bệnh nhân sức khỏe ổn định, huyết áp 120/80, nhịp tim 72. Khuyến nghị tiếp tục duy trì chế độ ăn uống và tập luyện hiện tại.', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, -2, GETDATE()), '14:00:00', N'Completed', N'Bệnh nhân tư vấn về thuốc ARV. Kết quả tư vấn: Bệnh nhân đã hiểu rõ về tầm quan trọng của việc uống thuốc đúng giờ. Đã hướng dẫn cách xử lý tác dụng phụ và lịch tái khám.', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 3), DATEADD(day, -1, GETDATE()), '08:00:00', N'Completed', N'Xét nghiệm máu định kỳ. Kết quả xét nghiệm: CD4: 450 cells/μL, Viral load: <50 copies/mL. Kết quả tốt, tiếp tục duy trì phác đồ điều trị hiện tại.', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 4), DATEADD(day, -1, GETDATE()), '15:30:00', N'Completed', N'Tư vấn dinh dưỡng cho bệnh nhân HIV. Kết quả tư vấn: Đã hướng dẫn chế độ ăn giàu protein, vitamin và khoáng chất. Khuyến nghị tránh thực phẩm sống và chưa nấu chín.', GETDATE(), GETDATE());
-- Cancelled
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, -5, GETDATE()), '10:00:00', N'Canceled', N'Bệnh nhân hủy do bận việc', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC001'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, -4, GETDATE()), '14:00:00', N'Canceled', N'Bệnh nhân bị ốm, xin dời lịch', GETDATE(), GETDATE());

-- Thêm các lịch khám bệnh với nhiều trạng thái khác nhau cho Doctor 2 (DOC002)
-- Pending
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, 1, GETDATE()), '16:00:00', N'Pending', N'Bệnh nhân có triệu chứng mệt mỏi', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, 2, GETDATE()), '09:00:00', N'Pending', N'Bệnh nhân cần tư vấn về phòng ngừa', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 3), DATEADD(day, 3, GETDATE()), '11:30:00', N'Pending', N'Tư vấn dinh dưỡng cho người cao tuổi', GETDATE(), GETDATE());
-- Confirmed
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, 4, GETDATE()), '08:00:00', N'Confirmed', N'Khám sức khỏe định kỳ', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, 5, GETDATE()), '10:30:00', N'Confirmed', N'Xét nghiệm theo dõi điều trị', GETDATE(), GETDATE());
-- Completed
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 1), DATEADD(day, -2, GETDATE()), '14:00:00', N'Completed', N'Khám tổng quát định kỳ. Kết quả khám: Bệnh nhân sức khỏe ổn định, cân nặng 55kg, chiều cao 160cm. Khuyến nghị tăng cường dinh dưỡng và tập luyện nhẹ nhàng.', GETDATE(), GETDATE()),
((SELECT id FROM patients WHERE patient_code = 'PAT001'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 3), DATEADD(day, -1, GETDATE()), '16:00:00', N'Completed', N'Tư vấn dinh dưỡng cho người nhiễm HIV. Kết quả tư vấn: Đã hướng dẫn chế độ ăn cân bằng, giàu protein và vitamin. Khuyến nghị uống đủ nước và tránh rượu bia.', GETDATE(), GETDATE());
-- Cancelled
INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, appointment_time, status, notes, created_at, updated_at) VALUES
((SELECT id FROM patients WHERE patient_code = 'PAT002'), (SELECT id FROM doctors WHERE doctor_code = 'DOC002'), (SELECT id FROM medical_services WHERE id = 2), DATEADD(day, -3, GETDATE()), '10:00:00', N'Canceled', N'Bệnh nhân có việc đột xuất', GETDATE(), GETDATE());

-- Insert online consultations (lịch tư vấn)
INSERT INTO online_consultations (appointment_id, consultation_type_id, meeting_link, start_time, end_time, notes, created_at, updated_at) VALUES
((SELECT TOP 1 id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE patient_code = 'PAT001') AND doctor_id = (SELECT id FROM doctors WHERE doctor_code = 'DOC001')), (SELECT id FROM consultation_types WHERE name = N'Online'), N'https://meet.google.com/abc-defg-hij', DATEADD(hour, 14, GETDATE()), DATEADD(hour, 15, GETDATE()), N'Bệnh nhân muốn tư vấn về chế độ ăn cho người tiểu đường', GETDATE(), GETDATE()),
((SELECT TOP 1 id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE patient_code = 'PAT002') AND doctor_id = (SELECT id FROM doctors WHERE doctor_code = 'DOC001')), (SELECT id FROM consultation_types WHERE name = N'Online'), N'https://meet.google.com/xyz-uvw-rst', DATEADD(hour, 15, GETDATE()), DATEADD(hour, 16, GETDATE()), N'Bệnh nhân cần tư vấn về tác dụng phụ của thuốc', GETDATE(), GETDATE());

-- Insert consultation histories (lịch sử tư vấn đã hoàn thành)
INSERT INTO consultation_histories (appointment_id, doctor_notes, patient_feedback, consultation_content, created_at, updated_at) VALUES
((SELECT TOP 1 id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE patient_code = 'PAT001') AND doctor_id = (SELECT id FROM doctors WHERE doctor_code = 'DOC001')), N'Bệnh nhân đã được tư vấn về các bài tập phù hợp với tình trạng sức khỏe. Cần theo dõi tiến độ tập luyện và điều chỉnh cường độ phù hợp.', N'Bác sĩ rất tận tâm và giải thích rõ ràng', N'Tư vấn về chế độ tập luyện cho người nhiễm HIV. Bệnh nhân tỏ ra tích cực và cam kết tuân thủ chế độ tập luyện được đề xuất.', GETDATE(), GETDATE());

-- Insert medications (thuốc ARV mẫu)
INSERT INTO medications (name, description, dosage, frequency, created_at, updated_at) VALUES
(N'Tenofovir', N'Thuốc ARV nhóm NRTI', N'300mg', N'07:00,19:00', GETDATE(), GETDATE()),
(N'Lamivudine', N'Thuốc ARV nhóm NRTI', N'150mg', N'07:00,19:00', GETDATE(), GETDATE()),
(N'Efavirenz', N'Thuốc ARV nhóm NNRTI', N'600mg', N'19:00', GETDATE(), GETDATE()),
(N'Abacavir', N'Thuốc ARV nhóm NRTI', N'300mg', N'07:00,19:00', GETDATE(), GETDATE()),
(N'Zidovudine', N'Thuốc ARV nhóm NRTI', N'300mg', N'07:00,19:00', GETDATE(), GETDATE()),
(N'Dolutegravir', N'Thuốc ARV nhóm INSTI', N'50mg', N'07:00', GETDATE(), GETDATE()),
(N'Lopinavir/ritonavir', N'Thuốc ARV nhóm PI', N'200mg/50mg', N'07:00,19:00', GETDATE(), GETDATE());