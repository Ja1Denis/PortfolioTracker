import React from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import styles from './PortfolioChart.module.css';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'
];

const PortfolioChart = ({ portfolio, isLoading }) => {
  const data = portfolio.map(stock => {
    const value = stock.price * stock.quantity;
    console.log('Stock data:', {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      quantity: stock.quantity,
      value: value
    });
    return value ? {
      x: stock.symbol,
      y: value,
      label: stock.symbol,
      tooltip: `${stock.name}\n${value.toFixed(2)}€`
    } : null;
  }).filter(Boolean);

  console.log('Final chart data:', data);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Raspodjela portfelja
        {isLoading && <span className={styles.loadingIndicator}>Osvježavanje...</span>}
      </h2>
      <div className={styles.chartContainer}>
        {portfolio.length > 0 ? (
          <VictoryPie
            data={data}
            colorScale={COLORS}
            labelComponent={
              <VictoryTooltip
                text={({ datum }) => datum.label || datum.x}
                style={{ fontSize: 12 }}
                flyoutStyle={{ stroke: "none" }}
              />
            }
            style={{
              labels: { fill: "white", fontSize: 12 },
              data: { stroke: "white", strokeWidth: 1 }
            }}
            padding={{ top: 20, bottom: 20, left: 50, right: 50 }}
            height={400}
          />
        ) : (
          <p className={styles.emptyMessage}>
            Dodajte dionice u portfelj za prikaz grafikona
          </p>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;
