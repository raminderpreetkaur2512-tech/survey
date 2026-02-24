import React from "react";

function DashboardHome() {
  return (
    <div style={{ padding: "30px" }}>
      <h2>Welcome to Admin Dashboard</h2>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>Total Records</h3>
          <p style={styles.number}>0</p>
        </div>

        <div style={styles.card}>
          <h3>Today Uploads</h3>
          <p style={styles.number}>0</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    width: "200px",
  },
  number: {
    fontSize: "28px",
    fontWeight: "bold",
  },
};

export default DashboardHome;