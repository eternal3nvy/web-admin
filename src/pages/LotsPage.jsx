import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterBar from "../components/FilterBar";
import { getAllLots } from "../services/lotService";
import "./LotsPage.css";

function LotsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusColors = {
    'draft': '#95a5a6',
    'forbidden': '#e74c3c',
    'in-moderation': '#f39c12',
    'auction-active': '#27ae60',
    'sending-failed': '#e74c3c',
    'awaiting-delivery-info': '#3498db',
    'auction-failed': '#e67e22',
    'receiving-failed': '#c0392b',
    'awaiting-delivery-confirmation': '#2980b9',
    'completed': '#16a085'
  };

  const navigate = useNavigate();

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status) => {
    return statusColors[status] || '#95a5a6';
  };

  useEffect(() => {
  if (!searchParams.get('lot_status')) {
    const params = new URLSearchParams(searchParams);
    params.set('lot_status', 'in-moderation');
    setSearchParams(params);
    }}, []);

  useEffect(() => {
    const fetchLots = async () => {
      setLoading(true);
      setError(null);
      try {
        // Convert URLSearchParams to object for API call
        const params = Object.fromEntries(searchParams.entries());

        const data = await getAllLots(params);
        console.log("Fetched lots:", data);
        setLots(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to fetch lots:", err);
        setError("Failed to load lots");
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [searchParams]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lots</h1>
      <FilterBar />

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {loading ? (
        <p>Loading...</p>
      ) : lots.length === 0 ? (
        <p>No lots found</p>
      ) : (
        <table className="lots-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Start Price</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr 
                key={lot.lot_id}
                onClick={() => navigate(`/lots/${lot.lot_id}`)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td>{lot.lot_id}</td>
                <td>{lot.title}</td>
                <td>{lot.category_name}</td>
                <td>UAH{Number(lot.starting_price || 0).toFixed(2)}</td>
                <td>
                  <span 
                    style={{
                      backgroundColor: getStatusColor(lot.lot_status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatStatus(lot.lot_status)}
                  </span>
                </td>
                <td>{new Date(lot.creation_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LotsPage;