import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DormDuty API berjalan di http://localhost:${PORT}/api/v1`));
