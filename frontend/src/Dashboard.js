import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ImportData from "./pages/ImportData";
import ViewRecords from "./pages/ViewRecords";

function Dashboard({ setAuth }) {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", background: "#f3f4f6" }}>
        <Sidebar setAuth={setAuth} />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ViewRecords />} />
            <Route path="/import" element={<ImportData />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Dashboard;