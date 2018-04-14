const graphql = require('graphql');
const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLID = graphql.GraphQLID;
const GraphQLBoolean = graphql.GraphQLBoolean;
const UserInput = require('./user-input');
const User = require('./user');
const repo = require('./repo');

module.exports = {

  add: {
    type: User,
    args: {
      data: {
        name: 'data',
        type: new GraphQLNonNull(UserInput)
      }
    },
    resolve (root, params) {
      return repo.addOne(params);
    }
  },

  update: {
    type: User,
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID)
      },
      data: {
        name: 'data',
        type: UserInput
      }
    },
    resolve (root, params) {
      return repo.updateOne(params);
    }
  },

  remove: {
    type: User,
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve (root, params) {
      return repo.removeOne(params);
    }
  }

};
