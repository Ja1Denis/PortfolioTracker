import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './PortfolioChart.module.css';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'
];

const PortfolioChart = ({ portfolio }) => {
  const data = portfolio.map(stock => ({
    name: `${stock.name} (${stock.symbol})`,
    value: stock.price * stock.quantity
  }));

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    ) : null;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Raspodjela portfelja</h2>
      <div className={styles.chartContainer}>
        {portfolio.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={160}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toFixed(2)} €`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
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
