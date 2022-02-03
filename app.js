const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const app = express();
const indexRoutes = require('./routes/index');
const blogRoutes = require('./routes/blog');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(
  session({
    secret: 'THISSECRETKEY',
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.urlencoded());
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Server is running...');
});
