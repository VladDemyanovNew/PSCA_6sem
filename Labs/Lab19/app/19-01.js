import express from 'express';
import { userRouter } from './routers/user.router.js';
import { postRouter } from './routers/post.router.js';
import { initORM, sequelize } from './database/db.js';
import { commentRouter } from './routers/comment.router.js';

const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.use((
    request,
    response,
    next) => {
    response.status(404).send({ error: 'Not found' })
});

app.use((
    error,
    request,
    response,
    next) => {
    response.status(error.status);
    response.send({ error: error.message });
})

sequelize.authenticate()
    .then(async () => {
        console.log('Connected to DB successfully');
        await initORM();
    })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server has been started on port 3000');
        });
    });
