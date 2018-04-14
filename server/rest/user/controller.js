const express = require('express'),
  repo = require('../../graphql/user/repo');

exports.getAll = function (req, res, next) {
  const params = {};
  if (req.query.skip && req.query.limit) {
    params.skip = req.query.skip;
    params.limit = req.query.limit;
  }
  repo.getAll(params)
    .then(users => res.send(users))
    .catch(next);
}

exports.addOne = function (req, res, next) {
  const user = req.body;
  repo.addOne({data: user})
    .then(_user => res.send(_user))
    .catch(next);
}

exports.getOne = function (req, res, next)
{
  repo.getOne({id: req.params.id})
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).end();
      }
    })
    .catch(next)
}

exports.updateOne = function(req, res, next)
{
  repo.updateOne({id: req.params.id, data: req.body})
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next)
}

exports.removeOne = function(req, res, next)
{
  repo.removeOne({id: req.params.id})
    .then(user => res.send(user));
}

