import express from 'express';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import session from 'express-session';
import { getCredentials, isPasswordValid } from './auth.helper.js';

const PORT = 3000;

const app = express();

app.use(express.json());

passport.use(new BasicStrategy((username, password, done) => {
    console.log('passport.use', username, password);
    let rc = null;
    const creds = getCredentials(username);

    if (!creds) {
        rc = done(null, false, { message: 'incorrect login' });
    }
    else if (!isPasswordValid(creds.password, password)) {
        rc = done(null, false, { message: 'incorrect password' });
    } else {
        rc = done(null, username);
    }

    return rc;
}));

passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('deserializeUser', user);
    done(null, user);
});

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: '12345678',
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (request, response, next) => {
    if (request.session.logout && request.headers['authorization']) {
        request.session.logout = false;
        delete request.headers['authorization'];
    }
    next();
}, passport.authenticate('basic'));

app.get('/login', (request, response, next) => {
    response.send({ message: 'ok' });
});

app.get('/logout', (request, response) => {
   request.session.logout = true;
   response.redirect('/login');
});

app.get('/resource', (request, response) => {
    if(request.headers['authorization']) {
        response.send({ message: 'resource' });
    } else {
        response.redirect('/login');
    }
});

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
});


app.listen(PORT, () => console.log('Server has been started!'));
