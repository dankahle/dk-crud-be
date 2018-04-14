const graphql = require('graphql');
const GraphQLList = graphql.GraphQLList;
const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLID = graphql.GraphQLID;
const GraphQLInt = graphql.GraphQLInt;
const User = require('./user');
const repo = require('./repo');

module.exports = {

  user: {
    type: User,
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLID)
      },
    },
    resolve (root, params) {
      return repo.getOne(params)
    }
  },

  users: {
    type: new GraphQLList(User),
    args: {
      limit: {
        name: 'limit',
        type: GraphQLInt
      },
      skip: {
        name: 'skip',
        type:GraphQLInt
      }
    },
    resolve (root, params) {
      return repo.getAll(params)
    }
  }
};
