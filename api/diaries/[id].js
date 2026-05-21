const { getPool, initTable } = require('../_db');

module.exports = async (req, res) => {
  const { id } = req.query;
  
  try {
    await initTable();
    
    if (req.method === 'GET') {
      const [rows] = await getPool().query('SELECT * FROM diaries WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: '日记不存在' });
      }
      res.json({ success: true, data: rows[0] });
    } else if (req.method === 'PUT') {
      const { title, content, weather, mood } = req.body;
      await getPool().query(
        'UPDATE diaries SET title = ?, content = ?, weather = ?, mood = ? WHERE id = ?',
        [title, content, weather || '', mood || '', id]
      );
      res.json({ success: true, message: '更新成功' });
    } else if (req.method === 'DELETE') {
      await getPool().query('DELETE FROM diaries WHERE id = ?', [id]);
      res.json({ success: true, message: '删除成功' });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};