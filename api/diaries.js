const { getPool, initTable } = require('./_db');

module.exports = async (req, res) => {
  try {
    await initTable();
    
    if (req.method === 'GET') {
      const [rows] = await getPool().query('SELECT * FROM diaries ORDER BY created_at DESC');
      res.json({ success: true, data: rows });
    } else if (req.method === 'POST') {
      const { title, content, weather, mood } = req.body;
      const [result] = await getPool().query(
        'INSERT INTO diaries (title, content, weather, mood) VALUES (?, ?, ?, ?)',
        [title, content, weather || '', mood || '']
      );
      const [rows] = await getPool().query('SELECT * FROM diaries WHERE id = ?', [result.insertId]);
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};