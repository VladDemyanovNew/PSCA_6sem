import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { createUser } from './persistence.js';
import session from 'express-session';

dotenv.config();
const app = express();

passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  enableProof: true,
}, (accessToken, refreshToken, profile, done) => {
  const user = createUser({ facebookId: profile.id });
  return done(null, user);
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.set('views', 'app/views');
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  key: 'sid',
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (request, response) => {
  response.render('login.hbs');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    { successRedirect: '/resource', failureRedirect: '/login' },
  ),
);

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/login');
});

app.get('/resource', (request, response) => {
  if (!request.isAuthenticated()) {
    return response.redirect('/login');
  }
  response.end(`<h1>User: ${JSON.stringify(request.user)}</h1>`);
});

app.use((request, response, next) => {
  response.status(404).send('<h1>Not found</h1>');
});

app.listen(process.env.PORT, () =>
  console.log('Server has been started'));