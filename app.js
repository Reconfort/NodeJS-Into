import express from 'express';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
const app = express()

app.use(express.json());

// routers
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(8080, () => {
    console.log('Express server is running on http://127.0.0.1:8080')
})