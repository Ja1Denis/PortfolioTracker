import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import styles from './PortfolioChart.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  'rgb(75, 192, 192)',
  'rgb(255, 159, 64)',
  'rgb(54, 162, 235)',
  'rgb(255, 99, 132)',
  'rgb(153, 102, 255)',
  'rgb(255, 205, 86)',
  'rgb(201, 203, 207)'
];

const PortfolioChart = ({ portfolio, history, cash }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Izračunaj ukupnu vrijednost gotovine u EUR
  const getCashValue = () => {
    return cash.reduce((total, item) => {
      if (item.currency === 'EUR') {
        return total + item.amount;
      }
      // TODO: Dodati konverziju drugih valuta u EUR
      return total + item.amount;
    }, 0);
  };

  const cashValue = getCashValue();

  // Podaci za pie chart
  const pieData = {
    labels: [...portfolio.map(stock => stock.symbol), 'Gotovina'],
    datasets: [{
      data: [...portfolio.map(stock => stock.value), cashValue],
      backgroundColor: COLORS,
      borderColor: COLORS.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.2)')),
      borderWidth: 1
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Raspodjela Portfelja',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Podaci za line chart
  const lineData = {
    labels: history.map(point => new Date(point.x).toLocaleString('hr-HR')),
    datasets: [
      {
        label: 'Dionice',
        data: history.map(point => point.y),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Gotovina',
        data: history.map(() => cashValue),
        fill: false,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1
      },
      {
        label: 'Ukupno',
        data: history.map(point => point.y + cashValue),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vrijednost Portfelja Kroz Vrijeme'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  const totalValue = portfolio.reduce((sum, stock) => sum + stock.value, 0) + cashValue;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.totalValue}>
        <h3>Ukupna Vrijednost</h3>
        <p>{formatCurrency(totalValue)}</p>
      </div>

      <div className={styles.charts}>
        <div className={styles.pieChart}>
          <Doughnut data={pieData} options={pieOptions} />
        </div>

        <div className={styles.lineChart}>
          {history.length > 0 ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p className={styles.noData}>Nema dostupnih podataka za prikaz</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
