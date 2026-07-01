import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://ai-test-case-generator-xjne.onrender.com';

const styles = {
  body: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    padding: '30px 20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '10px 0',
  },
  subtitle: {
    color: '#aaa',
    fontSize: '15px',
  },
  grid: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  cardDesc: {
    color: '#aaa',
    fontSize: '13px',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#00d2ff',
  },
  badge: {
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: '60px',
    fontSize: '16px',
  },
  loading: {
    textAlign: 'center',
    color: '#00d2ff',
    marginTop: '60px',
    fontSize: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalBox: {
    background: '#1a1a2e',
    border: '1px solid rgba(0,210,255,0.3)',
    borderRadius: '16px',
    padding: '25px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  closeBtn: {
    background: 'rgba(255,107,107,0.15)',
    border: '1px solid rgba(255,107,107,0.4)',
    color: '#ff6b6b',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  testItem: {
    background: 'rgba(0,210,255,0.07)',
    border: '1px solid rgba(0,210,255,0.2)',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
  },
  testTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '6px',
  },
  testText: {
    color: '#ccc',
    fontSize: '13px',
    marginBottom: '3px',
  },
};

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
    setLoading(false);
  };

  const openProject = async (id) => {
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${API_URL}/api/projects/${id}`);
      setSelectedProject(response.data);
    } catch (err) {
      console.error('Failed to fetch project details', err);
    }
    setLoadingDetail(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Dashboard</h1>
        <p style={styles.subtitle}>All your generated test case projects</p>
      </div>

      {loading && <p style={styles.loading}>⏳ Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <p style={styles.empty}>No projects yet. Generate test cases to see them here!</p>
      )}

      {!loading && projects.length > 0 && (
        <div style={styles.grid}>
          {projects.map((p) => (
            <div key={p.id} style={styles.card} onClick={() => openProject(p.id)}>
              <div style={styles.cardTitle}>📁 {p.name}</div>
              <div style={styles.cardDesc}>{p.description}</div>
              <div style={styles.cardFooter}>
                <span>{formatDate(p.created_at)}</span>
                <span style={styles.badge}>{p.test_case_count} items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ color: '#00d2ff', fontSize: '20px' }}>{selectedProject.name}</h2>
              <button style={styles.closeBtn} onClick={() => setSelectedProject(null)}>✕</button>
            </div>
            {loadingDetail && <p style={styles.loading}>Loading...</p>}
            {!loadingDetail && selectedProject.test_cases.map((tc) => (
              <div key={tc.id} style={styles.testItem}>
                <div style={styles.testTitle}>
                  {tc.type === 'functional' && '🔹 '}
                  {tc.type === 'edge_case' && '🔸 '}
                  {tc.type === 'risk' && '⚡ '}
                  {tc.title}
                </div>
                {tc.steps && <div style={styles.testText}><b>Steps:</b> {tc.steps}</div>}
                {tc.expected_result && <div style={styles.testText}><b>Expected:</b> {tc.expected_result}</div>}
                {tc.description && <div style={styles.testText}>{tc.description}</div>}
                {tc.priority && <div style={styles.testText}><b>Priority:</b> {tc.priority}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;