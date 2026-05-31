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
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    max_page: 1,
    has_prev: false,
    has_next: false
  });

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;

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

  const lotStatuses = [
    'draft',
    'forbidden',
    'in-moderation',
    'auction-active',
    'sending-failed',
    'awaiting-delivery-info',
    'auction-failed',
    'receiving-failed',
    'awaiting-delivery-confirmation',
    'completed'
  ];

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
    // Allow viewing all statuses by default - no forced filter
  }, []);

  useEffect(() => {
    const fetchLots = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = Object.fromEntries(searchParams.entries());

        const data = await getAllLots(params);
        console.log("Fetched lots:", data);
        
        if (data && data.data && data.pagination) {
          setLots(Array.isArray(data.data) ? data.data : []);
          setPagination(data.pagination);
        } else {
          setLots(Array.isArray(data) ? data : []);
        }
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
      
      {/* Pagination Controls */}
      {lots.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('page', Math.max(1, currentPage - 1).toString());
              setSearchParams(params);
              window.scrollTo(0, 0);
            }}
            disabled={!pagination.has_prev}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: !pagination.has_prev ? 'not-allowed' : 'pointer',
              opacity: !pagination.has_prev ? 0.5 : 1,
              backgroundColor: '#fff',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            ← Prev
          </button>

          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexWrap: 'wrap' }}>
            {Array.from({ length: Math.min(pagination.max_page, 5) }, (_, i) => {
              let pageNum;
              if (pagination.max_page <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.max_page - 2) {
                pageNum = pagination.max_page - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', pageNum.toString());
                    setSearchParams(params);
                    window.scrollTo(0, 0);
                  }}
                  style={{
                    padding: '4px 6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: currentPage === pageNum ? '#408196' : '#fff',
                    color: currentPage === pageNum ? '#f6f8f9' : '#000',
                    fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                    fontSize: '12px',
                    minWidth: '28px'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('page', Math.min(pagination.max_page, currentPage + 1).toString());
              setSearchParams(params);
              window.scrollTo(0, 0);
            }}
            disabled={!pagination.has_next}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: !pagination.has_next ? 'not-allowed' : 'pointer',
              opacity: !pagination.has_next ? 0.5 : 1,
              backgroundColor: '#fff',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            Next →
          </button>

          <span style={{ marginLeft: '10px', fontSize: '12px', fontWeight: '500' }}>
            Page {pagination.current_page} of {pagination.max_page}
          </span>
        </div>
      )}
    </div>
  );
}

export default LotsPage;