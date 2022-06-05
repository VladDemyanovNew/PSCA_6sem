import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getByName } from './22-01.persistence.js';
import session from 'express-session';

const app = express();
const PORT = 3000;

app.set('views', 'app/views');
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: '12345678',
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy((username, password, callback) => {
  const user = getByName(username);
  if (!user) {
    return callback(null, false, `User with name='${ username }' is not found`);
  }
  if (user.password !== password) {
    return callback(null, false, `Password is invalid`);
  }

  return callback(null, user);
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get('/login', (request, response) => {
  response.render('login.hbs');
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  (request, response) => {
    response.redirect('/resource');
  },
);

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/login');
});

app.get(
  '/resource',
  (request, response) => {
    if (!request.isAuthenticated()) {
      return response.redirect('/login');
    }
    response.end('<h1>resource</h1>');
  },
);

app.use((
  request,
  response,
  next) => {
  response.status(404).send('<h1>Not found</h1>');
});

app.listen(PORT, () => console.log('Server has been started'));