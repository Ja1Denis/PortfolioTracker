import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './PortfolioHistory.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const timeRanges = [
  { label: 'mjesec dana', value: 30 },
  { label: '3 mjeseca', value: 90 },
  { label: '6 mjeseci', value: 180 },
  { label: 'godina dana', value: 365 }
];

const PortfolioHistory = ({ historyData }) => {
  const [selectedRange, setSelectedRange] = useState(30);

  const filterDataByDays = (days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return historyData.filter(point => new Date(point.x) >= cutoffDate);
  };

  const filteredData = filterDataByDays(selectedRange);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.`;
  };

  const chartData = {
    labels: filteredData.map(point => formatDate(point.x)),
    datasets: [
      {
        type: 'bar',
        label: 'Vrijednost',
        data: filteredData.map(point => point.y),
        backgroundColor: 'rgba(229, 231, 235, 0.5)',
        borderColor: 'rgba(229, 231, 235, 0.8)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Trend',
        data: filteredData.map(point => point.y),
        borderColor: '#0088FE',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#0088FE',
        tension: 0.1,
        yAxisID: 'y'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return `Datum: ${tooltipItems[0].label}`;
          },
          label: (context) => {
            return `Vrijednost: ${context.raw.toFixed(2)}€`;
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
          font: {
            size: 11
          }
        }
      },
      y: {
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: (value) => `${value.toFixed(0)}€`,
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Kretanje vrijednosti u zadnjih
          <select 
            value={selectedRange}
            onChange={(e) => setSelectedRange(Number(e.target.value))}
            className={styles.rangeSelect}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </h2>
      </div>
      <div className={styles.chartContainer}>
        {filteredData && filteredData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p className={styles.emptyMessage}>
            Nema dostupnih povijesnih podataka za odabrani period
          </p>
        )}
      </div>
    </div>
  );
};

export default PortfolioHistory;
