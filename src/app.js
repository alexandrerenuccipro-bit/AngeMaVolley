const express = require('express');
const path = require('node:path');
const morgan = require('morgan');
const session = require('express-session');

const homeRoutes       = require('./routes/home.routes');
const authRoutes       = require('./routes/auth.routes');
const equipeRoutes     = require('./routes/equipe.routes');
const calendrierRoutes = require('./routes/calendrier.routes');
const adminRoutes      = require('./routes/admin.routes');   // ← NOUVEAU

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session_secret_dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use('/',           homeRoutes);
app.use('/',           authRoutes);
app.use('/equipe',     equipeRoutes);
app.use('/calendrier', calendrierRoutes);
app.use('/admin',      adminRoutes);   // ← NOUVEAU

module.exports = app;
