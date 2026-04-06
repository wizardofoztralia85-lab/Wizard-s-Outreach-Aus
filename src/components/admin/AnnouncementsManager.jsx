import { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './AdminPanel.css';

const EMPTY = { title: '', body: '' };

export default function AnnouncementsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  async function loadItems() {
    try {
      const snap = await getDocs(collection(db, 'announcements'));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setItems(list);
    } catch {
      // Firebase not configured
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  }

  function startEdit(item) {
    setEditId(item.id);
    setForm({ title: item.title, body: item.body });
    setStatus(null);
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
    setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (editId) {
        await updateDoc(doc(db, 'announcements', editId), {
          ...form, updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'announcements'), {
          ...form, createdAt: serverTimestamp(),
        });
      }
      setStatus('success');
      setEditId(null);
      setForm(EMPTY);
      await loadItems();
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Post announcements that appear at the top of the homepage. Delete them when they&apos;re no longer needed.
      </p>

      {status === 'success' && (
        <div className="alert alert-success">✔ Announcement saved.</div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">✖ Operation failed. Check your Firebase configuration.</div>
      )}

      {/* Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="panel-subheading">
          {editId ? '✏️ Edit Announcement' : '➕ New Announcement'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Announcement headline"
              required
            />
          </div>
          <div className="form-group">
            <label>Body *</label>
            <textarea
              value={form.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Full announcement text"
              rows={4}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editId ? '💾 Update' : '📢 Post Announcement'}
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
      <h2 className="panel-subheading">Posted Announcements</h2>
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', fontSize: '.9rem' }}>No announcements posted yet.</p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <div key={item.id} className="item-row">
              <div className="item-info">
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
