const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const app = express();
const pgp = require('pg-promise')();

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

app.use(express.static('static'));

const connectionString =
  'postgres://bspllujf:hhyg_pfq8DDbEtJLYmZDPf4K3McFWW9i@castor.db.elephantsql.com/bspllujf';

const db = pgp(connectionString);

app.get('/', (req, res) => {
  db.any('SELECT post_id, title, body, date_created FROM posts').then(
    (posts) => {
      console.log(posts);
      res.render('index', { allPosts: posts });
    }
  );
});

app.get('/edit/:postId', (req, res) => {
  const postId = parseInt(req.params.postId);
  db.one(
    'SELECT post_id, title, body, date_created FROM posts WHERE post_id=$1',
    [postId]
  ).then((post) => {
    console.log(post);
    res.render('edit', post);
  });
});

app.post('/create-post', (req, res) => {
  const title = req.body.titleText;
  const body = req.body.bodyText;
  const username = req.session.username;

  db.none('INSERT INTO posts(title, body, username) VALUES($1, $2, $3)', [
    title,
    body,
    username,
  ]).then(() => {
    res.redirect('/');
  });
});

app.post('/post/delete', (req, res) => {
  const postId = parseInt(req.body.postId);
  db.none('DELETE FROM posts WHERE post_id = $1', [postId]).then(() => {
    res.redirect('/');
  });
});

app.post('/update', (req, res) => {
  const title = req.body.titleText;
  const body = req.body.bodyText;
  const postId = parseInt(req.body.postId);

  db.none('UPDATE posts SET title=$1, body=$2 WHERE post_id=$3', [
    title,
    body,
    postId,
  ]).then(() => {
    res.redirect('/');
  });
});

app.get('/create-account', (req, res) => {
  res.render('create-account');
});

app.post('/create-account', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.none('INSERT INTO users(username, password) VALUES($1, $2)', [
    username,
    password,
  ]).then(() => {
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.any('SELECT username, password FROM users').then((users) => {
    const persistedUser = users.find((user) => {
      return user.username == username && user.password == password;
    });
    if (persistedUser) {
      if (req.session) {
        req.session.username = persistedUser.username;
      }
      res.redirect('/');
    } else {
      res.render('login', { errorMessage: 'Username or password is invalid.' });
    }
  });
});

app.get('/view-posts', (req, res) => {
  const username = req.session.username;
  db.any(
    'SELECT post_id, title, body, date_created, username FROM posts WHERE username=$1',
    [username]
  ).then((posts) => {
    res.render('index', { allPosts: posts });
  });
});

app.listen(3000, () => {
  console.log('Server is running...');
});
