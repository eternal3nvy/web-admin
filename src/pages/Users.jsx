import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import UserFilterBar from '../components/UserFilterBar';
import {
  getAllUsers,
  updateUser,
  updateUserStatus,
  deleteUser,
  getAllModerators,
  updateModerator,
  updateModeratorRole,
  deleteModerator,
} from '../services/userService';
import { USER_STATUSES, USER_STATUS_LABELS } from '../utils/userStatus';
import './UsersPage.css';

const formatName = (row) => {
  const parts = [row.name, row.patronymic, row.surname].filter(Boolean);
  return parts.join(' ') || '—';
};

const Users = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('users');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const data =
        activeTab === 'users'
          ? await getAllUsers(params)
          : await getAllModerators(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError(
        err.response?.data?.error ||
          (activeTab === 'users'
            ? 'Не вдалося завантажити користувачів'
            : 'Не вдалося завантажити модераторів')
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchParams]);

  useEffect(() => {
    if (activeTab === 'moderators' && !isAdmin) {
      setActiveTab('users');
      return;
    }
    fetchItems();
  }, [activeTab, searchParams, isAdmin, fetchItems]);

  const openEdit = (row) => {
    setActionError(null);
    setEditModal({ type: activeTab, row });
    setEditForm({
      name: row.name || '',
      surname: row.surname || '',
      patronymic: row.patronymic || '',
      phone_number: row.phone_number || '',
      email: row.email || '',
    });
  };

  const closeEdit = () => {
    setEditModal(null);
    setEditForm({});
    setActionError(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    setSaving(true);
    setActionError(null);
    try {
      const payload = {
        name: editForm.name.trim(),
        surname: editForm.surname.trim(),
        patronymic: editForm.patronymic.trim(),
        phone_number: editForm.phone_number.trim(),
      };

      if (editModal.type === 'users') {
        await updateUser(editModal.row.user_id, payload);
      } else {
        await updateModerator(editModal.row.moderator_id, payload);
      }

      closeEdit();
      fetchItems();
    } catch (err) {
      setActionError(err.response?.data?.error || 'Не вдалося зберегти зміни');
    } finally {
      setSaving(false);
    }
  };

  const handleUserStatusChange = async (user, newStatus) => {
    if (newStatus === (user.status || 'active')) return;

    setUpdatingId(user.user_id);
    try {
      await updateUserStatus(user.user_id, newStatus);
      setItems((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id ? { ...u, status: newStatus } : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Помилка зміни статусу');
      fetchItems();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleModeratorRoleChange = async (mod, newRole) => {
    const isAdminRole = newRole === 'admin';
    const currentIsAdmin = Boolean(mod.is_admin);

    if (isAdminRole === currentIsAdmin) return;

    setUpdatingId(mod.moderator_id);
    try {
      await updateModeratorRole(mod.moderator_id, isAdminRole);
      setItems((prev) =>
        prev.map((m) =>
          m.moderator_id === mod.moderator_id
            ? { ...m, is_admin: isAdminRole }
            : m
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Помилка зміни ролі');
      fetchItems();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (row) => {
    const label =
      activeTab === 'users'
        ? `користувача ${row.email}`
        : `модератора ${row.email}`;

    const confirmText =
      activeTab === 'users'
        ? `Позначити ${label} як видаленого?`
        : `Видалити ${label}? Цю дію не можна скасувати.`;

    if (!window.confirm(confirmText)) {
      return;
    }

    try {
      if (activeTab === 'users') {
        await deleteUser(row.user_id);
      } else {
        await deleteModerator(row.moderator_id);
      }
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Не вдалося видалити');
    }
  };

  const renderRowActions = (row) => (
    <>
      <button type="button" className="btn btn-edit" onClick={() => openEdit(row)}>
        Редагувати
      </button>
      <button type="button" className="btn btn-delete" onClick={() => handleDelete(row)}>
        Видалити
      </button>
    </>
  );

  const renderUserRows = () =>
    items.map((user) => {
      const status = user.status || 'active';
      return (
        <tr key={user.user_id}>
          <td>{user.user_id}</td>
          <td>{formatName(user)}</td>
          <td>{user.email}</td>
          <td>{user.phone_number || '—'}</td>
          <td>UAH{Number(user.balance || 0).toFixed(2)}</td>
          <td>{Number(user.rating || 0).toFixed(1)}</td>
          <td onClick={(e) => e.stopPropagation()}>
            <select
              className={`table-inline-select status-${status}`}
              value={status}
              disabled={updatingId === user.user_id}
              onChange={(e) => handleUserStatusChange(user, e.target.value)}
            >
              {USER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {USER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </td>
          <td>{new Date(user.creation_date).toLocaleDateString()}</td>
          <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
            {renderRowActions(user)}
          </td>
        </tr>
      );
    });

  const renderModeratorRows = () =>
    items.map((mod) => {
      const roleValue = mod.is_admin ? 'admin' : 'mod';
      return (
        <tr key={mod.moderator_id}>
          <td>{mod.moderator_id}</td>
          <td>{formatName(mod)}</td>
          <td>{mod.email}</td>
          <td>{mod.phone_number || '—'}</td>
          <td onClick={(e) => e.stopPropagation()}>
            <select
              className={`table-inline-select role-${roleValue}`}
              value={roleValue}
              disabled={updatingId === mod.moderator_id}
              onChange={(e) => handleModeratorRoleChange(mod, e.target.value)}
            >
              <option value="mod">Модератор</option>
              <option value="admin">Адміністратор</option>
            </select>
          </td>
          <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
            {renderRowActions(mod)}
          </td>
        </tr>
      );
    });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Users</h1>

      <div className="users-page-tabs">
        <button
          type="button"
          className={`users-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Користувачі
        </button>
        {isAdmin && (
          <button
            type="button"
            className={`users-tab ${activeTab === 'moderators' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderators')}
          >
            Модератори
          </button>
        )}
      </div>

      <UserFilterBar tab={activeTab} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Завантаження...</p>
      ) : items.length === 0 ? (
        <p>Записів не знайдено</p>
      ) : (
        <table className="lots-table">
          <thead>
            {activeTab === 'users' ? (
              <tr>
                <th>ID</th>
                <th>Ім'я</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Баланс</th>
                <th>Рейтинг</th>
                <th>Статус</th>
                <th>Реєстрація</th>
                <th>Дії</th>
              </tr>
            ) : (
              <tr>
                <th>ID</th>
                <th>Ім'я</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Дії</th>
              </tr>
            )}
          </thead>
          <tbody>
            {activeTab === 'users' ? renderUserRows() : renderModeratorRows()}
          </tbody>
        </table>
      )}

      {editModal && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>
              Редагувати{' '}
              {editModal.type === 'users' ? 'користувача' : 'модератора'}
            </h2>

            {actionError && (
              <div className="alert-inline error">{actionError}</div>
            )}

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={editForm.email} disabled />
              </div>
              <div className="form-group">
                <label>Ім'я *</label>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Прізвище *</label>
                <input
                  value={editForm.surname}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, surname: e.target.value }))
                  }
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>По батькові</label>
                <input
                  value={editForm.patronymic}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, patronymic: e.target.value }))
                  }
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  value={editForm.phone_number}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phone_number: e.target.value }))
                  }
                  disabled={saving}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="btn btn-edit"
                  disabled={saving}
                >
                  {saving ? 'Збереження...' : 'Зберегти'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
