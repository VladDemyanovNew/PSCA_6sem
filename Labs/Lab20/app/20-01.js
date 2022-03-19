import express from 'express';
import { userRouter } from './routers/user.router.js';
import hbs from 'hbs';
import expressHbs from 'express-handlebars';
import { cancelOperation } from './common/helpers.js';

const app = express();

app.engine('hbs', expressHbs.engine({
    layoutsDir: 'app/views/layouts',
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: {
        cancelOperation: cancelOperation,
    }
}));
app.set('view engine', 'hbs');
app.set('views', 'app/views');
hbs.registerPartials('app/views/partials');

app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);

app.use((
    request,
    response,
    next) => {
    response.status(404);
    response.render('error.hbs', {
        message: 'Ресурс не найден!',
    });
});

app.use((
    error,
    request,
    response,
    next) => {
    response.status(error.status);
    response.render('error.hbs', {
        message: error.message,
    });
});

app.listen(3000, () => {
    console.log('Server has been started on port 3000');
});