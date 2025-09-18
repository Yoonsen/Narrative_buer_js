import React from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartWrapper = styled.div`
  flex: 1;
  min-height: 400px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.125rem;
`;

const ChartMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-weight: 500;
`;

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
          Vindu: {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ 
            margin: '4px 0', 
            color: entry.color,
            fontSize: '0.875rem'
          }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DispersionChart = ({ data, metadata }) => {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#9ca3af'
        }}>
          Ingen data å vise
        </div>
      </ChartWrapper>
    );
  }

  // Transform data for Recharts
  const chartData = data.map((item, index) => {
    const transformedItem = {
      window: index + 1,
      window_start: item.window_start,
      window_end: item.window_end
    };

    // Add word frequencies
    metadata.words.forEach(word => {
      transformedItem[word] = item[word] || 0;
    });

    return transformedItem;
  });

  return (
    <ChartWrapper>
      <ChartTitle>Ordspredning</ChartTitle>
      
      <ChartMeta>
        <MetaItem>
          <MetaLabel>Ord:</MetaLabel>
          {metadata.words.join(', ')}
        </MetaItem>
        <MetaItem>
          <MetaLabel>Vindustørrelse:</MetaLabel>
          {metadata.window} ord
        </MetaItem>
        <MetaItem>
          <MetaLabel>Stegstørrelse:</MetaLabel>
          {metadata.step} ord
        </MetaItem>
        <MetaItem>
          <MetaLabel>Antall vinduer:</MetaLabel>
          {data.length}
        </MetaItem>
      </ChartMeta>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="window" 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Vindu', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Frekvens', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {metadata.words.map((word, index) => (
            <Line
              key={word}
              type="monotone"
              dataKey={word}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={word}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default DispersionChart;
