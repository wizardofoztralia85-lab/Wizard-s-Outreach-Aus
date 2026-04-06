import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import './Home.css';

const DEFAULT_CONTENT = {
  heroTitle: "Wizard's Outreach Australia",
  heroSubtitle: 'Spreading the Glass Wizard Australia message and supporting our community.',
  aboutText:
    'Wizard\'s Outreach Australia is the central hub for Glass Wizard Australia. ' +
    'We bring together resources, apps, and community support to make a difference.',
  footerText: '© Glass Wizard Australia Pty Ltd. All rights reserved.',
};

const DEFAULT_APPS = [
  {
    id: 'wheelie-fun-hub',
    name: 'Wheelie Fun Hub',
    description: 'Support for children affected by parental addiction and mental health challenges.',
    url: '#',
    emoji: '🎡',
  },
  {
    id: 'lyric-live',
    name: 'Lyric Live',
    description: 'Experience music and lyrics in a whole new way — Free, Basic, and Pro tiers.',
    url: 'https://github.com/Glass-Wizard-Australia-Pty-Ltd/Lyric-Live-Free-Basic-Pro',
    emoji: '🎵',
  },
  {
    id: 'subscription-starter',
    name: 'Subscription Starter',
    description: 'Monthly subscription management made simple for Glass Wizard services.',
    url: 'https://github.com/Glass-Wizard-Australia-Pty-Ltd/subscription-starter',
    emoji: '📦',
  },
];

export default function Home() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch site content
        const contentDoc = await getDoc(doc(db, 'siteContent', 'main'));
        if (contentDoc.exists()) {
          setContent((prev) => ({ ...prev, ...contentDoc.data() }));
        }

        // Fetch app listings
        const appsSnap = await getDocs(collection(db, 'apps'));
        if (!appsSnap.empty) {
          const fetched = appsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setApps(fetched);
        }

        // Fetch announcements
        const annSnap = await getDocs(collection(db, 'announcements'));
        const list = annSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setAnnouncements(list);
      } catch {
        // Firebase not configured — use defaults silently
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home">
      {/* ─── Nav ─── */}
      <nav className="home-nav">
        <div className="container home-nav-inner">
          <span className="home-nav-logo">🧙 Wizard&apos;s Outreach</span>
          <Link to="/admin/login" className="btn btn-ghost btn-sm">Admin</Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <header className="home-hero">
        <div className="container hero-content">
          <h1>{content.heroTitle}</h1>
          <p className="hero-sub">{content.heroSubtitle}</p>
        </div>
      </header>

      {/* ─── Announcements ─── */}
      {announcements.length > 0 && (
        <section className="home-section">
          <div className="container">
            <h2 className="section-heading">📢 Announcements</h2>
            <div className="announcements-list">
              {announcements.map((ann) => (
                <div key={ann.id} className="announcement-card">
                  <h3>{ann.title}</h3>
                  <p>{ann.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── About ─── */}
      <section className="home-section home-section-alt">
        <div className="container">
          <h2 className="section-heading">About Us</h2>
          <p className="about-text">{content.aboutText}</p>
        </div>
      </section>

      {/* ─── Apps ─── */}
      <section className="home-section">
        <div className="container">
          <h2 className="section-heading">Our Apps</h2>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="apps-grid">
              {apps.map((app) => (
                <a
                  key={app.id}
                  href={app.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-card"
                >
                  <span className="app-emoji">{app.emoji || '🔮'}</span>
                  <h3>{app.name}</h3>
                  <p>{app.description}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <div className="container">
          <p>{content.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
