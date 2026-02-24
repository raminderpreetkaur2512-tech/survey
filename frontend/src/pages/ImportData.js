import React, { useState, useRef } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function ImportData() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    if (!fileName.endsWith(".csv")) {
      alert("Only CSV files are allowed.");
      e.target.value = null;
      return;
    }

    if (selectedFile.size > 500 * 1024 * 1024) {
      alert("File size exceeds 500MB limit.");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadProgress(0);
      setIsProcessing(false);
      setMessage("Uploading CSV file...");

      const response = await axios.post(
        `${API_URL}/import-csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          timeout: 0,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);

              if (percent === 100) {
                setIsProcessing(true);
                setMessage(
                  "File uploaded successfully. Server is importing data... ⏳"
                );
              }
            }
          }
        }
      );

      setMessage(
        response.data.message || "🚀 CSV Import completed successfully!"
      );

      alert("🎉 CSV Import Successful!");
      resetForm();

    } catch (err) {
      console.error(err);

      if (err.response) {
        setMessage(err.response.data.error || "Server error occurred.");
      } else {
        setMessage("Network error. Please check connection.");
      }

      alert("❌ Import Failed");

    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>📥 Import CSV File (.csv)</h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          ref={fileInputRef}
        />

        {loading && (
          <div style={{ marginTop: "20px" }}>
            <div style={styles.progressContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${uploadProgress}%`
                }}
              />
            </div>
            <p style={{ marginTop: "8px" }}>
              {uploadProgress < 100
                ? `${uploadProgress}% Uploading`
                : "Processing on server... Please wait ⏳"}
            </p>
          </div>
        )}

        {message && (
          <p style={{ marginTop: "15px", color: "#333" }}>
            {message}
          </p>
        )}

        <button
          onClick={handleUpload}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          {loading
            ? isProcessing
              ? "Processing Data..."
              : "Uploading..."
            : "Start CSV Import"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "40px",
    display: "flex",
    justifyContent: "center"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    width: "100%"
  },
  button: {
    marginTop: "20px",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600"
  },
  progressContainer: {
    width: "100%",
    background: "#eee",
    borderRadius: "6px",
    overflow: "hidden",
    height: "12px"
  },
  progressBar: {
    height: "100%",
    background: "#2563eb",
    transition: "width 0.3s"
  }
};

export default ImportData;