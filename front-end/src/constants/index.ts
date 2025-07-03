export const navLinks = [
  {
    title: 'Trang chủ',
    path: '/',
    roles: ['ROLE_PATIENT', 'ROLE_STAFF', 'ROLE_ADMIN'],
  },
  {
    title: 'Đội ngũ bác sĩ',
    path: '/doctors',
  },
  {
    title: 'Đặt lịch khám',
    path: '/test-bookings',
    roles: ['ROLE_PATIENT', 'ROLE_STAFF', 'ROLE_ADMIN'],
  },
  {
    title: 'Tư vấn',
    path: '/consultation',
  },
] 