import { useEffect, useState } from "react";
import { getUsersGrowthStat } from "../../services/statService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const UsersGrowthChart = () => {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() - 30));
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formatDate(priorDate));
  const [endDate, setEndDate] = useState(formatDate(today));
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (start, end) => {
    if (new Date(start) > new Date(end)) {
      setError("Start date cannot be later than end date");
      return;
    }

    const startYear = start.split('-')[0];
    const endYear = end.split('-')[0];
    if (startYear.length < 4 || endYear.length < 4 || Number(startYear) < 2000) {
      setError("Please enter a valid year");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stat = await getUsersGrowthStat(start, end);
      setData(stat);
    } catch (err) {
      console.error("Failed to fetch user growth:", err);
      setError("Failed to load user growth stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(startDate, endDate);
  }, []);

  const handleApplyClick = () => {
    loadData(startDate, endDate);
  };

  return (
    <div>
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label>From: 
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={{ marginLeft: "5px", padding: "4px" }}
            />
          </label>
          <label>To: 
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={{ marginLeft: "5px", padding: "4px" }}
            />
          </label>
          
          <button 
            onClick={handleApplyClick} 
            disabled={loading}
            style={{
              padding: "6px 12px",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#ccc" : "#8884d8",
              color: "#fff",
              border: "none",
              borderRadius: "4px"
            }}
          >
            {loading ? "Loading..." : "Apply"}
          </button>
        </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      
      {!error && data.length === 0 && !loading && (
        <p className="text-muted">No new users joined in this period.</p>
      )}

      {!error && data.length > 0 && (
        <div style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.3s ease" }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(tick) => tick.substring(5)} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" name="New Users" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default UsersGrowthChart;