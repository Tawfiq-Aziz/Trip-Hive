import express from 'express';
import "dotenv/config.js";
import cors from 'cors';

const app = express();
app.use(cors()); // Enable cross-origin resource sharing

app.get('/', (req, res) => res.send('API IS WORKING'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
