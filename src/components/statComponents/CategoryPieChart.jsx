import { useEffect, useState } from "react";
import { getLotsByCategory } from "../../services/statService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#CCCCCC"];

const CategoryPieChart = ({ topN = 3 }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stat = await getLotsByCategory();

        const sorted = stat.sort((a, b) => b.total - a.total);

        const top = sorted.slice(0, topN);

        const otherTotal = sorted.slice(topN).reduce((sum, item) => sum + item.total, 0);
        if (otherTotal > 0) {
          top.push({ category: "Other", total: otherTotal });
        }

        setData(top);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch category stats:", err);
        setError("Failed to load category stats");
      }
    };

    fetchData();
  }, [topN]);

  if (error) return <p>{error}</p>;
  if (!data.length) return <p>Loading pie chart...</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={(entry) => `${entry.category}: ${entry.total}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;