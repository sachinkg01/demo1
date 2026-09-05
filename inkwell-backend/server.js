require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

const allowedOrigins=['http://localhost:5500','http://127.0.0.1:5500',
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(cors({
  origin:function(origin, callback){
    if(!origin ||allowedOrigins.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Inkwell API is running.');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log('Connected to MongoDB');
  app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
})
.catch((err)=>{
  console.error('MongoDB connection failed:',err.message);
  process.exit(1);
});