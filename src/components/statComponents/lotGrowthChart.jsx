import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { getLotGrowthChartData } from '../../services/statService';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; 
    
    return (
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px' }}>
          Ставка #{data.bidNumber}
        </p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Час:</strong> {data.time}</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Ставка:</strong> ${payload[0].value}</p>
        <p style={{ margin: 0 }}><strong>Юзер:</strong> {data.email}</p>
      </div>
    );
  }
  return null;
};

const LotGrowthChart = ({ lotId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const result = await getLotGrowthChartData(lotId);
        
        const chartData = result.map((item, index) => ({
          ...item,
          bidNumber: index + 1 
        }));
        
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (lotId) {
      fetchChartData();
    }
  }, [lotId]);

  if (loading) return <div style={{ marginTop: '20px' }}>Завантаження графіка...</div>;
  if (!data || data.length === 0) return null;

  return (
    <div className="lot-growth-chart" style={{ marginTop: '30px', width: '100%', height: '300px' }}>
      <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Історія ставок</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          <XAxis 
            dataKey="bidNumber" 
            tick={{ fontSize: 12 }}
          />
          
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#27ae60" 
            strokeWidth={3} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LotGrowthChart;