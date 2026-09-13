const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.userId = data.user.id;
  next();
}

// Exponential XP curve: each level needs more XP than the last
function xpThreshold(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Item types that can only ever be owned once
const ONE_TIME_TYPES = ['badge', 'theme'];

app.use(cors());
app.use(express.json());

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const userId = data.user.id;
  await supabase.from('profiles').insert([{ id: userId }]);
  await supabase.from('characters').insert([{
    user_id: userId,
    level: 1,
    current_xp: 0,
    currency: 0,
    attributes: {},
    streak_count: 0
  }]);

  res.json({ message: 'Signed up', user_id: userId, access_token: data.session?.access_token });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({ access_token: data.session.access_token, user_id: data.user.id });
});

app.get('/me', requireAuth, (req, res) => {
  res.json({ user_id: req.userId });
});

// CREATE a task
app.post('/tasks', requireAuth, async (req, res) => {
  const { title, attribute, xp_value } = req.body;

  if (!title || !attribute) {
    return res.status(400).json({ error: 'title and attribute are required' });
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ user_id: req.userId, title, attribute, xp_value: xp_value || 10 }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data[0]);
});

// READ all tasks for the logged-in user
app.get('/tasks', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// UPDATE a task — this is where completing a task triggers the RPG engine
app.patch('/tasks/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data: existingTaskArr, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId);

  if (fetchError) {
    return res.status(500).json({ error: fetchError.message });
  }
  if (!existingTaskArr || existingTaskArr.length === 0) {
    return res.status(404).json({ error: 'Task not found or not yours' });
  }
  const existingTask = existingTaskArr[0];

  const { data: updatedTaskArr, error: updateError } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select();

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }
  const updatedTask = updatedTaskArr[0];

  const justCompleted = !existingTask.completed && updatedTask.completed === true;

  if (!justCompleted) {
    return res.json({ task: updatedTask, leveled_up: false });
  }

  const { data: charArr, error: charFetchError } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', req.userId);

  if (charFetchError) {
    return res.status(500).json({ error: charFetchError.message });
  }
  if (!charArr || charArr.length === 0) {
    return res.status(500).json({ error: 'Character not found for this user' });
  }
  const character = charArr[0];

  const xpGained = updatedTask.xp_value || 0;
  let newXp = character.current_xp + xpGained;
  let newLevel = character.level;
  let leveledUp = false;

  while (newXp >= xpThreshold(newLevel)) {
    newXp -= xpThreshold(newLevel);
    newLevel += 1;
    leveledUp = true;
  }

  const newAttributes = { ...character.attributes };
  newAttributes[updatedTask.attribute] = (newAttributes[updatedTask.attribute] || 0) + xpGained;

  const today = new Date().toISOString().split('T')[0];
  let newStreak = character.streak_count;

  if (character.last_completed_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (character.last_completed_date === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  const currencyGained = Math.ceil(xpGained / 2);

  const { data: updatedCharArr, error: charUpdateError } = await supabase
    .from('characters')
    .update({
      level: newLevel,
      current_xp: newXp,
      currency: character.currency + currencyGained,
      attributes: newAttributes,
      streak_count: newStreak,
      last_completed_date: today
    })
    .eq('user_id', req.userId)
    .select();

  if (charUpdateError) {
    return res.status(500).json({ error: charUpdateError.message });
  }

  res.json({
    task: updatedTask,
    character: updatedCharArr[0],
    leveled_up: leveledUp,
    xp_gained: xpGained,
    currency_gained: currencyGained
  });
});

// DELETE a task
app.delete('/tasks/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data.length === 0) {
    return res.status(404).json({ error: 'Task not found or not yours' });
  }
  res.json({ message: 'Task deleted', task: data[0] });
});

// GET the logged-in user's character stats
app.get('/character', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Character not found' });
  }
  res.json(data[0]);
});

// GET the full shop catalog
app.get('/shop', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('shop_items')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// BUY an item
app.post('/shop/buy', requireAuth, async (req, res) => {
  const { item_id } = req.body;

  if (!item_id) {
    return res.status(400).json({ error: 'item_id is required' });
  }

  const { data: itemArr, error: itemError } = await supabase
    .from('shop_items')
    .select('*')
    .eq('id', item_id);

  if (itemError) {
    return res.status(500).json({ error: itemError.message });
  }
  if (!itemArr || itemArr.length === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const item = itemArr[0];

  const { data: charArr, error: charError } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', req.userId);

  if (charError) {
    return res.status(500).json({ error: charError.message });
  }
  if (!charArr || charArr.length === 0) {
    return res.status(404).json({ error: 'Character not found' });
  }
  const character = charArr[0];

  if (character.currency < item.price) {
    return res.status(400).json({ error: 'Not enough currency', have: character.currency, need: item.price });
  }

  const { data: existingInvArr, error: invFetchError } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', req.userId)
    .eq('item_id', item_id);

  if (invFetchError) {
    return res.status(500).json({ error: invFetchError.message });
  }

  const alreadyOwned = existingInvArr && existingInvArr.length > 0;

  if (alreadyOwned && ONE_TIME_TYPES.includes(item.type)) {
    return res.status(400).json({ error: 'You already own this item' });
  }

  const { error: deductError } = await supabase
    .from('characters')
    .update({ currency: character.currency - item.price })
    .eq('user_id', req.userId);

  if (deductError) {
    return res.status(500).json({ error: deductError.message });
  }

  let inventoryResult;

  if (alreadyOwned) {
    const existingRow = existingInvArr[0];
    const { data: updatedInv, error: invUpdateError } = await supabase
      .from('inventory')
      .update({ quantity: existingRow.quantity + 1 })
      .eq('id', existingRow.id)
      .select();

    if (invUpdateError) {
      return res.status(500).json({ error: invUpdateError.message });
    }
    inventoryResult = updatedInv[0];
  } else {
    const { data: newInv, error: invInsertError } = await supabase
      .from('inventory')
      .insert([{ user_id: req.userId, item_id: item_id, quantity: 1 }])
      .select();

    if (invInsertError) {
      return res.status(500).json({ error: invInsertError.message });
    }
    inventoryResult = newInv[0];
  }

  res.json({
    message: 'Purchase successful',
    item: item,
    inventory: inventoryResult,
    remaining_currency: character.currency - item.price
  });
});

// GET the user's inventory (with item details attached) — manual join, no DB foreign key needed
app.get('/inventory', requireAuth, async (req, res) => {
  const { data: invRows, error: invError } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', req.userId);

  if (invError) {
    return res.status(500).json({ error: invError.message });
  }

  if (!invRows || invRows.length === 0) {
    return res.json([]);
  }

  const itemIds = invRows.map(row => row.item_id);

  const { data: items, error: itemsError } = await supabase
    .from('shop_items')
    .select('*')
    .in('id', itemIds);

  if (itemsError) {
    return res.status(500).json({ error: itemsError.message });
  }

  const merged = invRows.map(row => ({
    ...row,
    shop_items: items.find(item => item.id === row.item_id)
  }));

  res.json(merged);
});

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