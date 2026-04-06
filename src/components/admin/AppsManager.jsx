import { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './AdminPanel.css';

const EMPTY_APP = { name: '', description: '', url: '', emoji: '' };

export default function AppsManager() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_APP);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  async function loadApps() {
    try {
      const snap = await getDocs(collection(db, 'apps'));
      setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      // Firebase not configured
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadApps(); }, []);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  }

  function startEdit(app) {
    setEditId(app.id);
    setForm({ name: app.name, description: app.description, url: app.url, emoji: app.emoji || '' });
    setStatus(null);
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY_APP);
    setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const payload = { ...form, updatedAt: serverTimestamp() };
      if (editId) {
        await updateDoc(doc(db, 'apps', editId), payload);
      } else {
        await addDoc(collection(db, 'apps'), { ...payload, createdAt: serverTimestamp() });
      }
      setStatus('success');
      setEditId(null);
      setForm(EMPTY_APP);
      await loadApps();
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this app listing?')) return;
    try {
      await deleteDoc(doc(db, 'apps', id));
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Manage the app cards shown on the homepage. Add, edit, or remove listings.
      </p>

      {status === 'success' && (
        <div className="alert alert-success">✔ App listing saved.</div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">✖ Operation failed. Check your Firebase configuration.</div>
      )}

      {/* Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="panel-subheading">{editId ? '✏️ Edit App' : '➕ Add New App'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>App Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Wheelie Fun Hub"
                required
              />
            </div>
            <div className="form-group" style={{ maxWidth: '80px' }}>
              <label>Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => handleChange('emoji', e.target.value)}
                placeholder="🔮"
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL *</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Short description of the app"
              rows={3}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editId ? '💾 Update App' : '➕ Add App'}
            </button>
            {editId && (
              <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <h2 className="panel-subheading">Current Listings</h2>
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : apps.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', fontSize: '.9rem' }}>No app listings yet. Add one above.</p>
      ) : (
        <div className="item-list">
          {apps.map((app) => (
            <div key={app.id} className="item-row">
              <span className="item-emoji">{app.emoji || '🔮'}</span>
              <div className="item-info">
                <strong>{app.name}</strong>
                <span>{app.description}</span>
                <a href={app.url} target="_blank" rel="noopener noreferrer" className="item-url">
                  {app.url}
                </a>
              </div>
              <div className="item-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(app)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(app.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
