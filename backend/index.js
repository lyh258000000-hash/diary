const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL数据库连接成功!');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS diaries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        weather VARCHAR(50),
        mood VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    connection.release();
  } catch (error) {
    console.error('数据库连接/初始化失败:', error);
  }
}

initDB();

app.get('/api/diaries', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM diaries ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取日记失败', error: error.message });
  }
});

app.get('/api/diaries/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM diaries WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '日记不存在' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取日记失败', error: error.message });
  }
});

app.post('/api/diaries', async (req, res) => {
  try {
    const { title, content, weather, mood } = req.body;
    const [result] = await pool.query(
      'INSERT INTO diaries (title, content, weather, mood) VALUES (?, ?, ?, ?)',
      [title, content, weather || '', mood || '']
    );
    const [rows] = await pool.query('SELECT * FROM diaries WHERE id = ?', [result.insertId]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建日记失败', error: error.message });
  }
});

app.put('/api/diaries/:id', async (req, res) => {
  try {
    const { title, content, weather, mood } = req.body;
    await pool.query(
      'UPDATE diaries SET title = ?, content = ?, weather = ?, mood = ? WHERE id = ?',
      [title, content, weather || '', mood || '', req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新日记失败', error: error.message });
  }
});

app.delete('/api/diaries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM diaries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除日记失败', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`);
});