import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ setAuth }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Survey Admin</h2>

      <Link to="/import" style={styles.link}>
        📥 Import Survey Data
      </Link>

      <Link to="/" style={styles.link}>
        📊 View Records
      </Link>

      <button
        style={styles.logoutBtn}
        onClick={() => setAuth(false)}
      >
        🚪 Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    background: "#1f2937",
    color: "#fff",
    padding: "25px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  logo: { marginBottom: "20px" },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    background: "#374151",
    borderRadius: "6px"
  },
  logoutBtn: {
    marginTop: "auto",
    padding: "10px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer"
  }
};

export default Sidebar;