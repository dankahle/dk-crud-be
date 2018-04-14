const _ = require('lodash'),
  User = require('../../rest/user/model');

exports.getAll = function ({skip, limit}) {
  const query = User.find();

  if (skip !== undefined && limit !== undefined) {
    query.skip(+skip).limit(+limit)
  }
  return query.exec();
}

exports.getOne = function ({id}) {
  return User.findById(id).exec();
}

exports.addOne = function ({data}) {
  return User.create(data);
}

exports.updateOne = function ({id, data}) {
  return User.replaceOne({_id: id}, data)
    .then(() => User.findById(id).exec())
}

exports.removeOne = function ({id}) {
  return User.findById(id)
    .then(user => user.remove());
}

