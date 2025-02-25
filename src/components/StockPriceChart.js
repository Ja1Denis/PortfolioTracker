import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './StockPriceChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TIME_RANGES = [
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1G', days: 365 }
];

const StockPriceChart = ({ symbol, priceHistory }) => {
  const [selectedRange, setSelectedRange] = useState('1M');

  const filteredData = useMemo(() => {
    const selectedDays = TIME_RANGES.find(r => r.label === selectedRange)?.days || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - selectedDays);
    
    return priceHistory.filter(item => new Date(item.date) >= cutoffDate);
  }, [priceHistory, selectedRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return new Date(tooltipItems[0].label).toLocaleDateString('hr-HR');
          },
          label: (context) => {
            return `Cijena: ${context.parsed.y.toFixed(2)}€`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 10,
          callback: (value) => {
            const date = new Date(filteredData[value]?.date);
            return date.toLocaleDateString('hr-HR', { month: 'short', day: 'numeric' });
          }
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          callback: (value) => `${value.toFixed(2)}€`
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const data = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        data: filteredData.map(item => item.price),
        borderColor: '#3b82f6',
        backgroundColor: '#93c5fd',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#3b82f6',
        tension: 0.2
      }
    ]
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Povijest cijena - {symbol}</h3>
        <div className={styles.timeRanges}>
          {TIME_RANGES.map(range => (
            <button
              key={range.label}
              className={`${styles.rangeButton} ${selectedRange === range.label ? styles.active : ''}`}
              onClick={() => setSelectedRange(range.label)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chart}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default StockPriceChart;
