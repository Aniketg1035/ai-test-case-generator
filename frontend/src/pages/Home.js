import React, { useState } from 'react';
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
    padding: '40px 20px 20px',
  },
  logo: {
    fontSize: '64px',
    animation: 'bounce 2s infinite',
  },
  title: {
    fontSize: '42px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '10px 0',
  },
  subtitle: {
    color: '#aaa',
    fontSize: '16px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '800px',
    margin: '30px auto',
  },
  label: {
    color: '#00d2ff',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'block',
  },
  textarea: {
    width: '100%',
    height: '150px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(0,210,255,0.3)',
    borderRadius: '12px',
    padding: '15px',
    color: 'white',
    fontSize: '14px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: '15px',
    padding: '14px 40px',
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    border: 'none',
    borderRadius: '50px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'block',
    margin: '15px auto 0',
    transition: 'transform 0.2s',
  },
  uploadBox: {
    border: '2px dashed rgba(0,210,255,0.4)',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  uploadBtn: {
    padding: '10px 25px',
    background: 'rgba(0,210,255,0.15)',
    border: '1px solid rgba(0,210,255,0.4)',
    borderRadius: '50px',
    color: '#00d2ff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  exportRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  exportBtnExcel: {
    padding: '12px 28px',
    background: 'linear-gradient(90deg, #1a7a4a, #26a65b)',
    border: 'none',
    borderRadius: '50px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  exportBtnPdf: {
    padding: '12px 28px',
    background: 'linear-gradient(90deg, #c0392b, #e74c3c)',
    border: 'none',
    borderRadius: '50px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: '10px',
  },
  success: {
    color: '#00d2ff',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  testCard: {
    background: 'rgba(0,210,255,0.07)',
    border: '1px solid rgba(0,210,255,0.2)',
    borderRadius: '12px',
    padding: '18px',
    marginBottom: '12px',
  },
  edgeCard: {
    background: 'rgba(255,107,107,0.07)',
    border: '1px solid rgba(255,107,107,0.2)',
    borderRadius: '12px',
    padding: '18px',
    marginBottom: '12px',
  },
  riskCard: {
    background: 'rgba(255,193,7,0.07)',
    border: '1px solid rgba(255,193,7,0.2)',
    borderRadius: '12px',
    padding: '18px',
    marginBottom: '12px',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    color: 'white',
    marginTop: '8px',
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
  },
  cardText: {
    color: '#ccc',
    fontSize: '14px',
    marginBottom: '4px',
  },
  statsRow: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  statBox: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '15px 25px',
    textAlign: 'center',
    minWidth: '120px',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    color: '#aaa',
    fontSize: '12px',
    marginTop: '4px',
  },
};

function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const analyzeText = async () => {
    if (!text) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { text });
      setResult(response.data);
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setUploadMsg('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText(response.data.extracted_text);
      setUploadMsg(`✅ "${file.name}" uploaded! Text extracted successfully.`);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const exportExcel = async () => {
    if (!result) return;
    try {
      const response = await axios.post(
        `${API_URL}/api/export/excel`,
        { test_cases: result.functional_tests.map(tc => ({
          title: tc.title,
          steps: tc.steps,
          expected: tc.expected,
          priority: tc.priority,
        }))},
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'test_cases.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  const exportPdf = async () => {
    if (!result) return;
    try {
      const response = await axios.post(
        `${API_URL}/api/export/pdf`,
        { test_cases: result.functional_tests.map(tc => ({
          title: tc.title,
          steps: tc.steps,
          expected: tc.expected,
          priority: tc.priority,
        }))},
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'test_cases.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  return (
    <div style={styles.body}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .result-section { animation: fadeIn 0.5s ease; }
        button:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(0,210,255,0.5); }
        textarea:focus { border-color: rgba(0,210,255,0.6) !important; box-shadow: 0 0 15px rgba(0,210,255,0.2); }
        .upload-box:hover { border-color: rgba(0,210,255,0.8) !important; background: rgba(0,210,255,0.05); }
      `}</style>

      <div style={styles.header}>
        <div style={styles.logo}>🤖</div>
        <h1 style={styles.title}>AI Test Case Generator</h1>
        <p style={styles.subtitle}>✨ Powered by Groq AI — Generate test cases in seconds</p>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>📁 UPLOAD PDF OR WORD FILE (Optional)</label>
        <div className="upload-box" style={styles.uploadBox}>
          <div style={{fontSize: '36px'}}>📄</div>
          <div style={{color: '#aaa', fontSize: '14px', margin: '8px 0'}}>
            {fileName ? `Selected: ${fileName}` : 'Drag & drop or click to upload PDF / DOCX'}
          </div>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileUpload}
            style={{display: 'none'}}
            id="fileInput"
          />
          <label htmlFor="fileInput">
            <button style={styles.uploadBtn} onClick={() => document.getElementById('fileInput').click()}>
              {uploading ? '⏳ Uploading...' : '📂 Choose File'}
            </button>
          </label>
        </div>
        {uploadMsg && <p style={styles.success}>{uploadMsg}</p>}

        <label style={styles.label}>📋 OR PASTE YOUR SOFTWARE REQUIREMENTS</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: User should be able to login with email and password..."
          style={styles.textarea}
        />
        <button onClick={analyzeText} disabled={loading} style={styles.button}>
          {loading ? '⏳ Analyzing with AI...' : '🚀 Generate Test Cases'}
        </button>
        {error && <p style={styles.error}>❌ {error}</p>}
      </div>

      {result && (
        <div className="result-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={styles.exportRow}>
            <button style={styles.exportBtnExcel} onClick={exportExcel}>📊 Export to Excel</button>
            <button style={styles.exportBtnPdf} onClick={exportPdf}>📄 Export to PDF</button>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statNum}>{result.functional_tests?.length || 0}</div>
              <div style={styles.statLabel}>Test Cases</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNum}>{result.edge_cases?.length || 0}</div>
              <div style={styles.statLabel}>Edge Cases</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNum}>{result.risks?.length || 0}</div>
              <div style={styles.statLabel}>Risks Found</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={{...styles.sectionTitle, color: '#00d2ff'}}>✅ Functional Test Cases</div>
            {result.functional_tests?.map((tc, i) => (
              <div key={i} style={styles.testCard}>
                <div style={styles.cardTitle}>🔹 {tc.title}</div>
                <div style={styles.cardText}><b style={{color:'#00d2ff'}}>Steps:</b> {tc.steps}</div>
                <div style={styles.cardText}><b style={{color:'#00d2ff'}}>Expected:</b> {tc.expected}</div>
                <span style={styles.badge}>{tc.priority}</span>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={{...styles.sectionTitle, color: '#ff6b6b'}}>⚠️ Edge Cases</div>
            {result.edge_cases?.map((ec, i) => (
              <div key={i} style={styles.edgeCard}>
                <div style={styles.cardTitle}>🔸 {ec.title}</div>
                <div style={styles.cardText}>{ec.description}</div>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={{...styles.sectionTitle, color: '#ffc107'}}>🔥 Risk Analysis</div>
            {result.risks?.map((r, i) => (
              <div key={i} style={styles.riskCard}>
                <div style={styles.cardTitle}>⚡ {r.area}
                  <span style={{color: r.severity === 'High' ? '#ff6b6b' : '#ffc107', marginLeft: '10px', fontSize: '13px'}}>
                    [{r.severity}]
                  </span>
                </div>
                <div style={styles.cardText}>{r.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;