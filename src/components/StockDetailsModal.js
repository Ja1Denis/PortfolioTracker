import React from 'react';
import styles from './StockDetailsModal.module.css';
import { Line } from 'react-chartjs-2';
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

// Registracija potrebnih komponenti za Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockDetailsModal = ({ stock, onClose, history }) => {
  const formatCurrency = (value, currency = 'EUR') => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const chartData = {
    labels: history.map(point => new Date(point.x).toLocaleString('hr-HR')),
    datasets: [
      {
        label: `Cijena dionice ${stock.symbol}`,
        data: history.map(point => point.y),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Povijest cijena za ${stock.symbol}`
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatCurrency(value, stock.currency)
        }
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h2>Detalji dionice {stock.symbol}</h2>
        
        <div className={styles.stockInfo}>
          <div className={styles.infoRow}>
            <span>Tržište:</span>
            <span>{stock.market}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Količina:</span>
            <span>{stock.quantity}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Trenutna cijena:</span>
            <span>{formatCurrency(stock.price, stock.currency)}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Ukupna vrijednost:</span>
            <span>{formatCurrency(stock.value, stock.currency)}</span>
          </div>
        </div>

        <div className={styles.chartContainer}>
          {history && history.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className={styles.noData}>Nema dostupne povijesti cijena</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetailsModal;
