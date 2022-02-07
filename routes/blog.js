const express = require('express');
const router = express.Router();
const models = require('../models');
const bcrypt = require('bcrypt');
const SALT_ROUND = 10;
const { Op } = require('sequelize');

function authenticateMiddleware(req, res, next) {
  if (req.session) {
    if (req.session.user) {
      // send the user to their original request
      next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
}

router.get('/dashboard', authenticateMiddleware, (req, res) => {
  const userId = req.session.userId;
  models.Post.findAll({
    include: [
      {
        model: models.User,
        as: 'user',
      },
    ],
    where: {
      user_id: userId,
    },
  }).then((posts) => {
    res.render('dashboard', { allPosts: posts });
  });
});

router.get('/view-all', authenticateMiddleware, (req, res) => {
  models.Post.findAll({
    include: [
      {
        model: models.User,
        as: 'user',
      },
    ],
  }).then((posts) => {
    res.render('view-all', { allPosts: posts });
  });
});

router.post('/create-post', (req, res) => {
  const userId = req.session.userId;
  const title = req.body.title;
  const body = req.body.body;
  const category = req.body.category;
  const post = models.Post.build({
    title: title,
    body: body,
    category: category,
    user_id: userId,
  });
  post.save().then(() => {
    res.redirect('/blog/dashboard');
  });
});

router.post('/delete/:postId', (req, res) => {
  const postId = req.params.postId;
  models.Post.destroy({
    where: {
      id: postId,
    },
  }).then(() => {
    res.redirect('/blog/dashboard');
  });
});

router.get('/post/category/:category', (req, res) => {
  const category = req.params.category;
  models.Post.findAll({
    where: {
      category: {
        [Op.iLike]: category,
      },
    },
  }).then((posts) => {
    res.render('dashboard', { allPosts: posts });
  });
});

router.get('/edit/:postId', authenticateMiddleware, (req, res) => {
  const postId = req.params.postId;
  models.Post.findByPk(postId).then((post) => {
    res.render('edit', { fullPost: post });
  });
});

router.post('/update/:postId', (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const category = req.body.category;
  const postId = req.params.postId;

  models.Post.update(
    {
      title: title,
      body: body,
      category: category,
    },
    {
      where: {
        id: postId,
      },
    }
  ).then((updatedPost) => {
    res.redirect('/blog/dashboard');
  });
});

router.get('/post/:postId', authenticateMiddleware, (req, res) => {
  const postId = parseInt(req.params.postId);
  models.Post.findByPk(postId, {
    include: [
      {
        model: models.User,
        as: 'user',
      },
      {
        model: models.Comment,
        as: 'comments',
        include: [
          {
            model: models.User,
            as: 'commenter',
          },
        ],
      },
    ],
  }).then((post) => {
    res.render('post', post.dataValues);
  });
});

router.post('/create-comment', (req, res) => {
  const body = req.body.comment;
  const userId = req.session.userId;
  const postId = req.body.postId;

  const comment = models.Comment.build({
    body: body,
    user_id: userId,
    post_id: postId,
  });
  comment.save().then(() => {
    res.redirect(`/blog/post/${postId}`);
  });
});

router.post('/delete/comment/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.body.postId;

  models.Comment.destroy({
    where: {
      id: commentId,
    },
  }).then(() => {
    res.redirect(`/blog/post/${postId}`);
  });
});

module.exports = router;
