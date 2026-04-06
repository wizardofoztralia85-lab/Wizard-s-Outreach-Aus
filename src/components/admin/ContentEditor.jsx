import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const DEFAULTS = {
  heroTitle: "Wizard's Outreach Australia",
  heroSubtitle: 'Spreading the Glass Wizard Australia message and supporting our community.',
  aboutText:
    "Wizard's Outreach Australia is the central hub for Glass Wizard Australia. " +
    'We bring together resources, apps, and community support to make a difference.',
  footerText: '© Glass Wizard Australia Pty Ltd. All rights reserved.',
};

export default function ContentEditor() {
  const [fields, setFields] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'siteContent', 'main'));
        if (snap.exists()) {
          setFields((prev) => ({ ...prev, ...snap.data() }));
        }
      } catch {
        // Firebase not configured — use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await setDoc(doc(db, 'siteContent', 'main'), fields, { merge: true });
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="spinner-wrap"><div className="spinner" /></div>;
  }

  return (
    <form onSubmit={handleSave}>
      <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '.9rem' }}>
        Edit the text shown on the public homepage. Changes are saved to Firestore and appear live immediately.
      </p>

      {status === 'success' && (
        <div className="alert alert-success">✔ Content saved successfully.</div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">✖ Failed to save. Check your Firebase configuration.</div>
      )}

      <div className="form-group">
        <label htmlFor="heroTitle">Hero Title</label>
        <input
          id="heroTitle"
          type="text"
          value={fields.heroTitle}
          onChange={(e) => handleChange('heroTitle', e.target.value)}
          placeholder="Main headline on the homepage"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="heroSubtitle">Hero Subtitle</label>
        <textarea
          id="heroSubtitle"
          value={fields.heroSubtitle}
          onChange={(e) => handleChange('heroSubtitle', e.target.value)}
          placeholder="Short tagline below the headline"
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="aboutText">About Section</label>
        <textarea
          id="aboutText"
          value={fields.aboutText}
          onChange={(e) => handleChange('aboutText', e.target.value)}
          placeholder="Organisation description"
          rows={5}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="footerText">Footer Text</label>
        <input
          id="footerText"
          type="text"
          value={fields.footerText}
          onChange={(e) => handleChange('footerText', e.target.value)}
          placeholder="Copyright / footer notice"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : '💾 Save Changes'}
      </button>
    </form>
  );
}
