// src/data/menuData.js

export const menuItems = [
  {
    id: '1',
    label: '대시보드',
    path: '/',
    icon: '📊',
  },
  {
    id: '2',
    label: '주문 관리',
    path: '/orders',
    icon: '📋',
    children: [
      {
        id: '2-1',
        label: '주문 목록',
        path: '/orders/list',
      },
      {
        id: '2-2',
        label: '결제 내역',
        path: '/orders/payments',
      },
    ],
  },
  {
    id: '3',
    label: '품목 및 재고',
    path: '/items',
    icon: '📦',
    children: [
      {
        id: '3-1',
        label: '품목 관리',
        path: '/items/products',
      },
      {
        id: '3-2',
        label: '재고 현황',
        path: '/items/inventory',
      },
    ],
  },
  {
    id: '4',
    label: '거래처 관리',
    path: '/orders',
    icon: '📋',
    children: [
      {
        id: '4-1',
        label: '거래처 목록',
        path: '/vendor/list',
      },
    ],
  },
  {
    id: '5',
    label: '정산 관리',
    path: '/settle',
    icon: '📋',
    children: [
      {
        id: '5-1',
        label: '일정산 현황',
        path: '/settle/day',
      },
      {
        id: '5-2',
        label: '월정산 현황',
        path: '/settle/month',
      },
    ],
  },
  {
    id: '6',
    label: '통계 및 분석',
    path: '/statistic',
    icon: '📊',
    children: [
      {
        id: '6-1',
        label: '대시보드',
        path: '/statistic/dashboard',
      },
      {
        id: '6-2',
        label: '고객분석',
        path: '/statistic/customer',
      },
    ],
  },
  {
    id: '7',
    label: '고객 관리',
    path: '/settle',
    icon: '📋',
    children: [
      {
        id: '7-1',
        label: '고객 현황',
        path: '/customer/list',
      },
      {
        id: '7-2',
        label: '부가 정보',
        path: '/customer/etc',
      },
    ],
  },
  {
    id: '8',
    label: '코드 관리',
    path: '/codes',
    icon: '📋',
  },
  {
    id: '9',
    label: '시스템 설정',
    path: '/settings',
    icon: '⚙️',
  },
];
