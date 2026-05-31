import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './FilterBar.css';

export default function UserFilterBar({ tab }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get(tab === 'users' ? 'status' : 'is_admin') || '',
    sort: searchParams.get('sort') || '-creation_date',
    limit: parseInt(searchParams.get('limit')) || 20,
  });

  useEffect(() => {
    setLocalFilters({
      search: searchParams.get('search') || '',
      status: searchParams.get(tab === 'users' ? 'status' : 'is_admin') || '',
      sort: searchParams.get('sort') || '-creation_date',
      limit: parseInt(searchParams.get('limit')) || 20,
    });
  }, [searchParams, tab]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    newParams.delete('search');
    newParams.delete('status');
    newParams.delete('is_admin');
    newParams.delete('sort');
    newParams.delete('page');

    if (localFilters.search) {
      newParams.set('search', localFilters.search);
    }

    if (localFilters.status) {
      const key = tab === 'users' ? 'status' : 'is_admin';
      newParams.set(key, localFilters.status);
    }

    if (localFilters.sort) {
      newParams.set('sort', localFilters.sort);
    }

    newParams.set('limit', localFilters.limit.toString());
    newParams.set('page', '1');

    setSearchParams(newParams);
  };

  const handleReset = () => {
    setLocalFilters({ search: '', status: '', sort: '-creation_date', limit: 20 });
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('status');
    newParams.delete('is_admin');
    newParams.delete('sort');
    newParams.delete('page');
    newParams.set('limit', '20');
    setSearchParams(newParams);
  };

  const hasActiveFilters =
    searchParams.get('search') ||
    searchParams.get('status') ||
    searchParams.get('is_admin') ||
    (searchParams.get('sort') && searchParams.get('sort') !== '-creation_date') ||
    (searchParams.get('limit') && searchParams.get('limit') !== '20');

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

      <div className="filter-group">
        <label>Сортування</label>
        <select
          value={localFilters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="-creation_date">Нові спочатку</option>
          <option value="creation_date">Старі спочатку</option>
          <option value="name">За ім'ям (А-Я)</option>
          <option value="-name">За ім'ям (Я-А)</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Елементів на сторінці</label>
        <select 
          value={localFilters.limit}
          onChange={(e) => handleChange('limit', parseInt(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn btn-primary">
          Застосувати
        </button>

        {hasActiveFilters && (
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Скинути
          </button>
        )}
      </div>
    </form>
  );
}