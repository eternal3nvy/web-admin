import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLotById, approveLot, rejectLot } from '../services/lotService';
import './lotPage.css';

function LotPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

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
    const fetchLot = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLotById(id);
        setLot(Array.isArray(data) ? data[0] : data.data ? data.data[0] : data);
      } catch (err) {
        console.error('Failed to fetch lot:', err);
        setError('Failed to load lot details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLot();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await approveLot(id);
      setActionSuccess('Lot approved successfully!');
      setTimeout(() => {
        navigate('/lots');
      }, 1500);
    } catch (err) {
      console.error('Failed to approve lot:', err);
      setActionError('Failed to approve lot');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
    setRejectionReason('');
    setActionError(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setActionError('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await rejectLot(id, rejectionReason);
      setActionSuccess('Lot rejected successfully!');
      setShowRejectModal(false);
      setTimeout(() => {
        navigate('/lots');
      }, 1500);
    } catch (err) {
      console.error('Failed to reject lot:', err);
      setActionError('Failed to reject lot');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectionReason('');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading lot details...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (!lot) {
    return <div style={{ padding: '20px' }}>Lot not found</div>;
  }

  return (
    <div className="lot-page">
      <div className="lot-header">
        <button className="btn-back" onClick={() => navigate('/lots')}>← Back to Lots</button>
        <h1>{lot.title}</h1>
      </div>
            {lot.lot_status === 'in-moderation' && (
        <div className="moderation-actions">
          <h2>Moderation Actions</h2>
          <div className="action-buttons">
            <button 
              className="btn btn-approve"
              onClick={handleApprove}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : '✓ Approve Lot'}
            </button>
            <button 
              className="btn btn-reject"
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : '✗ Reject Lot'}
            </button>
          </div>
        </div>
      )}

      {actionError && <div className="alert alert-error">{actionError}</div>}
      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

      <div className="lot-container">
        <div className="lot-images">
          {lot.main_image ? (
            <img src={lot.main_image} alt={lot.title} className="lot-main-image" />
          ) : (
            <div className="no-image">No image available</div>
          )}
        </div>

        <div className="lot-details">
          <div className="detail-row">
            <span className="label">ID:</span>
            <span className="value">{lot.lot_id}</span>
          </div>

          <div className="detail-row">
            <span className="label">Category:</span>
            <span className="value">{lot.category_name}</span>
          </div>

          <div className="detail-row">
            <span className="label">Subcategory:</span>
            <span className="value">{lot.subcategory_name || 'N/A'}</span>
          </div>

          <div className="detail-row">
            <span className="label">Status:</span>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(lot.lot_status) }}
            >
              {formatStatus(lot.lot_status)}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Starting Price:</span>
            <span className="value price">${Number(lot.starting_price || 0).toFixed(2)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Bid Step:</span>
            <span className="value">${Number(lot.bid_step || 0).toFixed(2)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Created:</span>
            <span className="value">{new Date(lot.creation_date).toLocaleString()}</span>
          </div>

          {lot.start_date && (
            <div className="detail-row">
              <span className="label">Auction Start:</span>
              <span className="value">{new Date(lot.start_date).toLocaleString()}</span>
            </div>
          )}

          {lot.end_date && (
            <div className="detail-row">
              <span className="label">Auction End:</span>
              <span className="value">{new Date(lot.end_date).toLocaleString()}</span>
            </div>
          )}

          {lot.owner_id && (
            <div className="detail-row">
              <span className="label">Owner ID:</span>
              <span className="value">{lot.owner_id}</span>
            </div>
          )}
        </div>
      </div>

      <div className="lot-description">
        <h2>Description</h2>
        <p>{lot.description || 'No description provided'}</p>
      </div>

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reject Lot</h2>
            <p>Please provide a reason for rejecting this lot:</p>
            
            {actionError && <div className="alert alert-error">{actionError}</div>}
            
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="rejection-textarea"
              disabled={actionLoading}
            />
            
            <div className="modal-actions">
              <button 
                className="btn btn-cancel"
                onClick={handleCancelReject}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-reject"
                onClick={handleConfirmReject}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LotPage;