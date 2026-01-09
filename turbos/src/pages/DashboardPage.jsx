// src/pages/DashboardPage.jsx
import React from 'react';
import { Bar, Line } from 'react-chartjs-2'; // Line 추가 임포트
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, // 선 그래프용 엘리먼트 추가
  PointElement, // 선 그래프의 점 엘리먼트 추가
  Title, 
  Tooltip, 
  Legend,
  Filler // 선 하단 색상 채우기용
} from 'chart.js';
import '../styles/Dashboard.css'; // 대시보드 전용 스타일

// ChartJS에 필요한 컴포넌트 등록 (필수)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // 등록
  PointElement, // 등록
  Title,
  Tooltip,
  Legend,
  Filler 
);

// --- 샘플 데이터 ---
const dailySalesData = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      label: '일매출 현황 (만원)',
      data: [300, 250, 400, 350, 500, 600, 450],
      backgroundColor: '#0465f7ff', // 메인 테마 컬러 적용
    },
  ],
};

const monthlySalesData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
    datasets: [
      {
        label: '월매출 현황 (백만원)',
        data: [8000, 7500, 9000, 8500, 10000, 11000, 9500],
        backgroundColor: '#798faf',
      },
    ],
  };

// --- 1. 데이터 및 라벨 생성 (분기별: 1Q, 2Q, 3Q, 4Q) ---
// --- 1. 고정된 데이터 생성 (컴포넌트 외부에서 실행) ---
const yearConfigs = [
  { year: '2021', color: '#FF6384' },
  { year: '2022', color: '#36A2EB' },
  { year: '2023', color: '#FFCE56' },
  { year: '2024', color: '#4BC0C0' },
  { year: '2025', color: '#9966FF' },
];

// X축 라벨을 전역변수 push 방식이 아닌 map으로 한 번에 생성하여 무한 루프 방지
const lineLabels = yearConfigs.flatMap(conf => [
  `${conf.year}년`, '2분기', '3분기', '4분기'
]);

// 데이터셋 생성: 년도별로 선 색상을 다르게 부여
const yearlyDatasets = yearConfigs.map((conf, index) => {
  const data = Array(20).fill(null);
  
  // 분기별 데이터 생성
  for (let q = 0; q < 4; q++) {
    const dataIdx = index * 4 + q;
    data[dataIdx] = Math.floor(Math.random() * (180 - 140) + 140);
  }

  // 년도 간 선 연결 (연속성)
  if (index > 0) {
    data[index * 4 - 1] = data[index * 4];
  }

  return {
    label: `${conf.year}년 추이`,
    data: data,
    borderColor: conf.color,
    backgroundColor: `${conf.color}33`,
    borderWidth: 3,
    tension: 0.4,
    pointRadius: 4,
    fill: true,
    spanGaps: true,
  };
});

const yearlySalesData = {
  labels: lineLabels,
  datasets: yearlyDatasets,
};

// --- 선차트 옵션 
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        title: (items) => lineLabels[items[0].dataIndex].replace('년', '년 1분기')
      }
    }
  },
  scales: {
    x: {
      ticks: {
        autoSkip: false,
        color: (context) => (lineLabels[context.index]?.includes('년') ? '#000000' : '#777777'),
        font: (context) => (lineLabels[context.index]?.includes('년') ? { size: 13, weight: 'bold' } : { size: 11 }),
      },
      grid: {
        color: (context) => (lineLabels[context.index]?.includes('년') ? '#e0e0e0' : 'transparent'),
      }
    },
    y: { beginAtZero: false, suggestedMin: 120, ticks: { callback: (value) => value + '억' } }
  }
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // 무한 증식 방지 핵심
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '매출 데이터',
    },
  },
};

// --- 컴포넌트 정의 ---
const SalesChart = ({ title, data, type = 'bar' }) => (
  <div className="card chart-container">
    <h3>{title}</h3>
    {type === 'bar' ? (
      <Bar options={chartOptions} data={data} />
    ) : (
      <Line options={lineOptions} data={data} />
    )}
  </div>
);

const SalesTable = ({ title, data, unit = "만원" }) => (
  <div className="card table-container">
    <h3>{title}</h3>
    <table>
      <thead>
        <tr>
          <th>날짜/월</th>
          <th>매출액 (만원)</th>
        </tr>
      </thead>
      <tbody>
        {data.labels.map((label, index) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{data.datasets[0].data[index].toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const DashboardPage = () => {
  return (
    <div>
      <h2>📊 대시보드</h2>
      <p>환영합니다! 오늘의 POS 시스템 매출 현황입니다.</p>
      
      <div className="dashboard-grid">
        {/* 상단: 일매출/월매출 (Bar) */}
        <SalesChart title="일매출 현황" data={dailySalesData} />
        <SalesTable title="일매출 상세" data={dailySalesData} unit="만원" />
        
        <SalesChart title="월매출 현황" data={monthlySalesData} />
        <SalesTable title="월매출 상세" data={monthlySalesData} unit="백만원" />

        {/* 하단 영역: 최근 3개년 매출 현황 (Line) */}
        <div className="yearly-section">
        <SalesChart title="최근 5개년 연매출 추이(분기별)" data={yearlySalesData} type="line" />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
