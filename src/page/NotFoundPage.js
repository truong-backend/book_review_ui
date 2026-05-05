import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage({ serviceDown = false }) {
  if (serviceDown) {
    return (
      <div style={styles.wrap}>
        <div style={styles.icon}>🔌</div>
        <h1 style={styles.code}>503</h1>
        <h2 style={styles.title}>Server đang offline</h2>
        <p style={styles.desc}>
          Không thể kết nối đến server. Vui lòng thử lại sau ít phút.
        </p>
        <button style={styles.btn} onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>📭</div>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Trang không tồn tại</h2>
      <p style={styles.desc}>
        Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link to="/" style={styles.btn}>Về trang chủ</Link>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 24px',
    fontFamily: "'Lato', sans-serif",
  },
  icon: { fontSize: 80, marginBottom: 16 },
  code: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 96,
    fontWeight: 700,
    color: '#c8860a',
    margin: '0 0 8px',
    lineHeight: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1a0a00',
    margin: '0 0 16px',
  },
  desc: {
    fontSize: 16,
    color: '#666',
    maxWidth: 400,
    lineHeight: 1.6,
    margin: '0 0 32px',
  },
  btn: {
    display: 'inline-block',
    background: '#c8860a',
    color: 'white',
    padding: '12px 32px',
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};