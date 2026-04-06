import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ContentEditor from '../components/admin/ContentEditor';
import AppsManager from '../components/admin/AppsManager';
import AnnouncementsManager from '../components/admin/AnnouncementsManager';
import './AdminDashboard.css';

const TABS = [
  { id: 'content',       label: '📝 Site Content'    },
  { id: 'apps',          label: '🔮 App Listings'    },
  { id: 'announcements', label: '📢 Announcements'   },
];

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      {/* ─── Sidebar ─── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">🧙 Admin</div>
        <nav className="sidebar-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`sidebar-link${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-email">{currentUser?.email}</p>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
          <a href="/" className="sidebar-view-site">← View site</a>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-heading">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
        </header>

        <div className="admin-content">
          {activeTab === 'content'       && <ContentEditor />}
          {activeTab === 'apps'          && <AppsManager />}
          {activeTab === 'announcements' && <AnnouncementsManager />}
        </div>
      </main>
    </div>
  );
}
