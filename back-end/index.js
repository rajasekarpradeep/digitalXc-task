const express = require('express');
const secretSantaRoutes = require('./routes/secretSantaRoutes');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use('/api/secretsanta', secretSantaRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});