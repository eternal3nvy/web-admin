import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMainStat } from "../services/statService";
import UsersGrowthChart from "../components/statComponents/UsersGrowthChart";
import CategoryPieChart from "../components/statComponents/CategoryPieChart";
import './IndexPage.css';
import LotsByPeriodChart from "../components/statComponents/LotsByPeriodChart";

const IndexPage = () => {
  const { role } = useAuth();

  const [mainStat, setStat] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const stat = await getMainStat();
          setStat(stat);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStat(null);
        setError("Failed to load statistics");
      }
    };

    fetchStat();
  }, []);
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Role: {role}</p>

      {mainStat === null ? (
        <p>{error || "Loading..."}</p>
      ) : (
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{mainStat.total_users}</p>
        </div>

        <div className="stat-card">
          <h3>Total Lots</h3>
          <p>{mainStat.total_lots}</p>
        </div>

        <div className="stat-card">
          <h3>Active Lots</h3>
          <p>{mainStat.active_lots}</p>
        </div>

        <div className="stat-card">
          <h3>Total Bids</h3>
          <p>{mainStat.total_bids}</p>
        </div>

        <div className="stat-card">
          <h3>Total Moderators</h3>
          <p>{mainStat.total_moderators}</p>
        </div>
      </div>
      )}

      <h2>User Growth</h2>
      <UsersGrowthChart />

      <h2>Lots by Category (Top 5)</h2>
      <CategoryPieChart topN={5} />

      <h2>Lots by period</h2>
      <LotsByPeriodChart />
    </div>
  );
};

export default IndexPage;