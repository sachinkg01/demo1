require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Inkwell API');
});

const PORT = process.env.PORT || 5001;

async function startServer() {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const mongoMemoryServer = await MongoMemoryServer.create();
    mongoUri = mongoMemoryServer.getUri();
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});