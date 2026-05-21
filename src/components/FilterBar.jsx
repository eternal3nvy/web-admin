import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getSubcategories } from '../services/lotService';
import './FilterBar.css';

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('title[like]') || '',
    category_id: searchParams.get('category_id') || '',
    subcategory_id: searchParams.get('subcategory_id') || '',
    lot_status: searchParams.get('lot_status') || 'in-moderation',
    minPrice: searchParams.get('starting_price[gte]') || '',
    maxPrice: searchParams.get('starting_price[lte]') || '',
    startDate: searchParams.get('start_date[gte]') || '',
    endDate: searchParams.get('end_date[lte]') || ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoadingCats(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (localFilters.category_id) {
      const fetchSubcategories = async () => {
        try {
          const data = await getSubcategories(localFilters.category_id);
          setSubcategories(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
          console.error('Failed to fetch subcategories:', err);
          setSubcategories([]);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
    
    // Clear subcategory selection when category changes
    setLocalFilters(prev => ({ ...prev, subcategory_id: '' }));
  }, [localFilters.category_id]);

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

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams();

    const filterMapping = {
      search: 'title[like]',
      category_id: 'category_id',
      subcategory_id: 'subcategory_id',
      lot_status: 'lot_status',
      minPrice: 'starting_price[gte]',
      maxPrice: 'starting_price[lte]',
      startDate: 'start_date[gte]',
      endDate: 'end_date[lte]'
    };

    Object.entries(filterMapping).forEach(([localKey, urlKey]) => {
      if (localFilters[localKey]) {
        newParams.set(urlKey, localFilters[localKey]);
      }
    });

    setSearchParams(newParams);
  };

  const handleReset = () => {
    setLocalFilters({
      search: '',
      category_id: '',
      subcategory_id: '',
      lot_status: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: ''
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <form onSubmit={handleApply} className="filter-form">
      
      <div className="filter-group">
        <label>Search by title</label>
        <input 
          type="text" 
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Enter lot title..."
        />
      </div>

      <div className="filter-group">
        <label>Category:</label>
        <select 
          value={localFilters.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
          disabled={loadingCats}
        >
          <option value="">All categories</option>
          {categories.map((cat, idx) => (
            <option key={cat.id || idx} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Subcategory:</label>
        <select 
          value={localFilters.subcategory_id}
          onChange={(e) => handleChange('subcategory_id', e.target.value)}
          disabled={!localFilters.category_id || subcategories.length === 0}
        >
          <option value="">All subcategories</option>
          {subcategories.map((subcat, idx) => (
            <option key={subcat.lot_subcategory_id || idx} value={subcat.lot_subcategory_id}>
              {subcat.subcategory_name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Status:</label>
        <select 
          value={localFilters.lot_status}
          onChange={(e) => handleChange('lot_status', e.target.value)}
        >
          <option value="">All statuses</option>
          {lotStatuses.map((status, idx) => (
            <option key={`status-${idx}`} value={status}>
              {status.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min. price:</label>
        <input 
          type="number" 
          value={localFilters.minPrice}
          onChange={(e) => handleChange('minPrice', e.target.value)}
          placeholder="0"
          step="0.01"
        />
      </div>

      <div className="filter-group">
        <label>Max. price:</label>
        <input 
          type="number" 
          value={localFilters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          placeholder="∞"
          step="0.01"
        />
      </div>

      <div className="filter-group">
        <label>Start date from:</label>
        <input 
          type="date" 
          value={localFilters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>End date until:</label>
        <input 
          type="date" 
          value={localFilters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">Apply</button>
      
      {searchParams.toString() && (
        <button type="button" onClick={handleReset} className="btn btn-secondary">Clear</button>
      )}

    </form>
  );
}