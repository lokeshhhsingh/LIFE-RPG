const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

app.post('/submit', async (req, res) => {
  const { name, message } = req.body;
  const { data, error } = await supabase
    .from('submissions')
    .insert([{ name, message }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ status: 'saved', name, message });
});
app.get('/items', async (req, res) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});