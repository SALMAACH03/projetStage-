const express = require('express');
const connectDB = require('./config/db.js');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoute.js');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1/auth', authRoutes); // Include a leading forward slash

app.get('/', (req, res) => {
  res.send({ message: 'welcome' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
