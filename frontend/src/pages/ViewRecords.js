import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function ViewRecords() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const limit = 50;
  const totalPages = Math.ceil(total / limit);

  const fetchData = async (pageNumber, searchValue = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/app-records?page=${pageNumber}&search=${searchValue}`
      );

      setData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, search);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchData(1, search);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Survey Data</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          fontWeight: "600",
        }}
      >
        <span>Total Records: {total}</span>
        <span>
          Page {page} of {totalPages || 1}
        </span>
      </div>

      {/* Search */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by name, card no, mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            flex: 1,
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 15px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p style={{ marginTop: "20px" }}>Loading data...</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>AC Name</th>
                <th>Name</th>
                <th>Card No</th>
                <th>Mobile</th>
                <th>District</th>
                <th>Section</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.AC_NAME_V1}</td>
                    <td>
                      {row.FNAME} {row.LNAME}
                    </td>
                    <td>{row.CARDNO}</td>
                    <td>{row.MNO}</td>
                    <td>{row.DIST_NAME_EN}</td>
                    <td>{row.SECTION}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{
            padding: "8px 15px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ⬅ Prev
        </button>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          style={{
            padding: "8px 15px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default ViewRecords;