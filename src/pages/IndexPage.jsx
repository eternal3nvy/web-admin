import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMainStat } from "../services/statService";

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
        <div>
          <p>Total Users: {mainStat.total_users}</p>
          <p>Total Lots: {mainStat.total_lots}</p>
          <p>Active Lots: {mainStat.active_lots}</p>
          <p>Total Bids: {mainStat.total_bids}</p>
          <p>Total Moderators: {mainStat.total_moderators}</p>
        </div>
      )}
    </div>
  );
};

export default IndexPage;