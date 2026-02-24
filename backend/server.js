const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));

/* ==============================
   MYSQL CONNECTION POOL
============================== */

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000
});

console.log("✅ MySQL Pool Connected");

/* ==============================
   FILE UPLOAD CONFIG
============================== */

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 500 * 1024 * 1024 }
});

/* ==============================
   SAFE HELPERS
============================== */

const safeString = (val) => {
  if (!val) return null;
  const v = String(val).trim();
  if (v === "" || v.toLowerCase() === "nan") return null;
  return v;
};

const safeNumber = (val) => {
  const num = parseInt(val);
  return isNaN(num) ? null : num;
};

app.get("/", (req, res) => {
  res.send("Survey Backend is Running 🚀");
});
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    console.log("DB TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// login api

app.post("/login", async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ success: false, message: "PIN required" });
    }

    // Trim & convert safely
    const cleanPin = pin.toString().trim();

    const [rows] = await db.promise().query(
      "SELECT id FROM admins WHERE pin = ? LIMIT 1",
      [cleanPin]   // works for both INT & VARCHAR
    );

    if (rows.length > 0) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    console.log("🔥 LOGIN ERROR FULL:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ==============================
   CSV IMPORT API
============================== */

app.post("/import-csv", upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const filePath = path.join(__dirname, req.file.path);
  const batchSize = 1000;
  let batch = [];
  let totalInserted = 0;

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {

      batch.push([
        safeString(row.ACNO),
        safeString(row.AC_NAME_EN),
        safeString(row.AC_NAME_V1),
        safeString(row.PART),
        safeString(row.SECTION),
        safeString(row.SRNO),
        safeString(row.HNO),
        safeString(row.HNO_V),
        safeString(row.FNAME),
        safeString(row.LNAME),
        safeString(row.FNAMEV),
        safeString(row.LNAMEV),
        safeString(row.REL),
        safeString(row.RFNAME),
        safeString(row.RLNAME),
        safeString(row.RFNA_V),
        safeString(row.RLNA_V),
        safeString(row.CARDNO),
        safeString(row.SEX),
        safeNumber(row.AGE),
        safeString(row.MNO),
        safeString(row.SECTION_NAME_EN),
        safeString(row.SECTION_NAME_V1),
        safeString(row.URBAN_RURAL),
        safeString(row.POSTOFF_PIN),
        safeString(row.POSTOFF_NAME_EN),
        safeString(row.POSTOFF_NAME_V1),
        safeString(row.DIST_NO),
        safeString(row.DIST_NAME_EN),
        safeString(row.DIST_NAME_V1),
        safeString(row.PSBUILDING_NO),
        safeString(row.PSBUILDING_ID),
        safeString(row.PSBUILDING_NAME_V1),
        safeString(row.PSBUILDING_NAME_EN)
      ]);

      if (batch.length === batchSize) {
        await connection.query(
          `INSERT INTO survey_admin (
            ACNO, AC_NAME_EN, AC_NAME_V1,
            PART, SECTION, SRNO,
            HNO, HNO_V,
            FNAME, LNAME, FNAMEV, LNAMEV,
            REL,
            RFNAME, RLNAME, RFNA_V, RLNA_V,
            CARDNO, SEX, AGE, MNO,
            SECTION_NAME_EN, SECTION_NAME_V1,
            URBAN_RURAL,
            POSTOFF_PIN, POSTOFF_NAME_EN, POSTOFF_NAME_V1,
            DIST_NO, DIST_NAME_EN, DIST_NAME_V1,
            PSBUILDING_NO, PSBUILDING_ID,
            PSBUILDING_NAME_V1, PSBUILDING_NAME_EN
          ) VALUES ?`,
          [batch]
        );

        totalInserted += batch.length;
        batch = [];
      }
    }

    if (batch.length > 0) {
      await connection.query(
        `INSERT INTO survey_admin (
          ACNO, AC_NAME_EN, AC_NAME_V1,
          PART, SECTION, SRNO,
          HNO, HNO_V,
          FNAME, LNAME, FNAMEV, LNAMEV,
          REL,
          RFNAME, RLNAME, RFNA_V, RLNA_V,
          CARDNO, SEX, AGE, MNO,
          SECTION_NAME_EN, SECTION_NAME_V1,
          URBAN_RURAL,
          POSTOFF_PIN, POSTOFF_NAME_EN, POSTOFF_NAME_V1,
          DIST_NO, DIST_NAME_EN, DIST_NAME_V1,
          PSBUILDING_NO, PSBUILDING_ID,
          PSBUILDING_NAME_V1, PSBUILDING_NAME_EN
        ) VALUES ?`,
        [batch]
      );

      totalInserted += batch.length;
    }

    await connection.commit();
    connection.release();

    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      message: `🚀 CSV Import completed. Total inserted: ${totalInserted}`
    });

  } catch (error) {

    console.log("🔥 IMPORT ERROR:");
    console.error(error);

    await connection.rollback();
    connection.release();

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


/* ==============================
   FETCH RECORDS WITH PAGINATION
============================== */

app.get("/app-records", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const limit = 50;
    const offset = (page - 1) * limit;

    let whereClause = "";
    let values = [];

    if (search) {
      whereClause = `
        WHERE 
          FNAME LIKE ? OR 
          LNAME LIKE ? OR 
          CARDNO LIKE ? OR 
          MNO LIKE ?
      `;
      values = [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      ];
    }

    // Get total count
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as total FROM survey_admin ${whereClause}`,
      values
    );

    const total = countResult[0].total;

    // Get paginated data
    const [rows] = await db.promise().query(
      `SELECT * FROM survey_admin
       ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({
      total,
      data: rows
    });

  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   DB CHECK ROUTE
============================== */

app.get("/check-db", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT COUNT(*) as total FROM survey_admin"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   START SERVER
============================== */



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});