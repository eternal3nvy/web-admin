import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './FilterBar.css';

export default function UserFilterBar({ tab }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get(tab === 'users' ? 'status' : 'is_admin') || '',
  });

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('status');
    newParams.delete('is_admin');

    if (localFilters.search) {
      newParams.set('search', localFilters.search);
    }

    if (localFilters.status) {
      const key = tab === 'users' ? 'status' : 'is_admin';
      newParams.set(key, localFilters.status);
    }

    setSearchParams(newParams);
  };

  const handleReset = () => {
    setLocalFilters({ search: '', status: '' });
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('status');
    newParams.delete('is_admin');
    setSearchParams(newParams);
  };

  const statusOptions =
    tab === 'users'
      ? [
          { value: '', label: 'Усі статуси' },
          { value: 'active', label: 'Активні' },
          { value: 'on_review', label: 'На перевірці' },
          { value: 'banned', label: 'Заблоковані' },
          { value: 'suspended', label: 'Призупинені' },
          { value: 'deleted', label: 'Видалені' },
        ]
      : [
          { value: '', label: 'Усі ролі' },
          { value: 'true', label: 'Адміністратор' },
          { value: 'false', label: 'Модератор' },
        ];

  return (
    <form onSubmit={handleApply} className="filter-form">
      <div className="filter-group">
        <label>Пошук</label>
        <input
          type="text"
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Email, ім'я або прізвище..."
        />
      </div>

      <div className="filter-group">
        <label>{tab === 'users' ? 'Статус' : 'Роль'}</label>
        <select
          value={localFilters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Застосувати
      </button>

      {searchParams.toString() && (
        <button type="button" onClick={handleReset} className="btn btn-secondary">
          Скинути
        </button>
      )}
    </form>
  );
}
