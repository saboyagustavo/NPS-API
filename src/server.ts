import 'reflect-metadata';
import express from 'express';
import './database';
const app = express();

app.get('/', (request, response) => {
    return response.json({ message: 'Hello, World! - NLW04' });
});

app.post('/', (request, response) => {
    return response.json({ message: 'Data successfully saved' });
});

app.listen(3333, () => console.log('\n', 'SERVER RUNNING ON PORT 3333'));
