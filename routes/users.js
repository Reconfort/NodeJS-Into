import express from 'express';
const router = express.Router();

// Sample in-memory consider it as databas
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// GET /users
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (name) {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(users);
});

// GET /users/:id
router.get('/:id', (req, res, next) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }
  res.json(user);
});

export default router;