const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres'
});

async function initDB() {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL数据库连接成功!');

    await client.query(`
      CREATE TABLE IF NOT EXISTS diaries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        weather VARCHAR(50),
        mood VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    client.release();
  } catch (error) {
    console.error('数据库连接/初始化失败:', error);
  }
}

initDB();

app.get('/api/diaries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diaries ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取日记失败', error: error.message });
  }
});

app.get('/api/diaries/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diaries WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: '日记不存在' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取日记失败', error: error.message });
  }
});

app.post('/api/diaries', async (req, res) => {
  try {
    const { title, content, weather, mood } = req.body;
    const result = await pool.query(
      'INSERT INTO diaries (title, content, weather, mood) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, weather || '', mood || '']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建日记失败', error: error.message });
  }
});

app.put('/api/diaries/:id', async (req, res) => {
  try {
    const { title, content, weather, mood } = req.body;
    await pool.query(
      'UPDATE diaries SET title = $1, content = $2, weather = $3, mood = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
      [title, content, weather || '', mood || '', req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新日记失败', error: error.message });
  }
});

app.delete('/api/diaries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM diaries WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除日记失败', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`);
});
