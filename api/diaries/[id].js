const { getPool, initTable } = require('../_db');

module.exports = async (req, res) => {
  const { id } = req.query;
  
  try {
    await initTable();
    
    if (req.method === 'GET') {
      const result = await getPool().query('SELECT * FROM diaries WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: '日记不存在' });
      }
      res.json({ success: true, data: result.rows[0] });
    } else if (req.method === 'PUT') {
      const { title, content, weather, mood } = req.body;
      await getPool().query(
        'UPDATE diaries SET title = $1, content = $2, weather = $3, mood = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
        [title, content, weather || '', mood || '', id]
      );
      res.json({ success: true, message: '更新成功' });
    } else if (req.method === 'DELETE') {
      await getPool().query('DELETE FROM diaries WHERE id = $1', [id]);
      res.json({ success: true, message: '删除成功' });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
