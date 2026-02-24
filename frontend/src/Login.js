import React, { useState } from "react";
import axios from "axios";

function Login({ setAuth }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (pin.length !== 4) {
      alert("Please enter 4 digit PIN");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/login", { pin });

      if (res.data.success) {
        setAuth(true);
      } else {
        alert("Invalid PIN");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        
        {/* Logo Circle */}
        <div style={styles.logoCircle}>
          🔐
        </div>

        <h2 style={styles.title}>Survey Admin Panel</h2>
        <p style={styles.subtitle}>Sign in to access your dashboard</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Enter 4 Digit PIN</label>
          <input
            type="password"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            style={styles.input}
          />
        </div>

        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={styles.footer}>© 2026 Survey Management System</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    width: "380px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
  logoCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontSize: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 20px auto",
  },
  title: {
    margin: "10px 0",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "25px",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.3s",
  },
  footer: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#aaa",
  },
};

export default Login;