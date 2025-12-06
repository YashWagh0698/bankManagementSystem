const express = require('express');
const cors = require('cors');
const accountRoutes = require('./routes/accountRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/command/account', accountRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Account Command Service running on port ${PORT}`);
});
