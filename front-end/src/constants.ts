import { Link } from './types';

export const navLinks: Link[] = [
  {
    id: 1,
    text: 'Trang chủ',
    url: '/'
  },
  {
    id: 2,
    text: 'Đặt lịch xét nghiệm',
    url: '/test-bookings'
  },
  {
    id: 3,
    text: 'Đặt lịch tư vấn',
    url: '/consultation'
  },
  {
    id: 4,
    text: 'Phác đồ ARV',
    url: '/arv-protocol'
  },
  {
    id: 5,
    text: 'Quản trị',
    url: '/admin',
    roles: ['ROLE_ADMIN']
  }
];