import React from "react";

function Header() {
  return (
    <div style={styles.header}>
      <h3>Dashboard Overview</h3>
    </div>
  );
}

const styles = {
  header: {
    padding: "20px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default Header;