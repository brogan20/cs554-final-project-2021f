const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');
const userData = require('./dataFunctions/user');
const popularityData = require('./dataFunctions/popularity');
const battleData = require('./dataFunctions/battles');

const typeDefs = gql`
  type Query {
    users: [User]
  }

  type User {
    _id: String
    token: String
    userName: String
    pokemonCollection: [Pokemon]
    wallet: Int
  }

  type Pokemon {
    _id: String
    pokemonID: String
    pokemonName: String
    imageLink: String
    isShiny: Boolean
  }
  
  type Mutation {
    addUser(
      username: String!
    ): User
  }
`;


const resolvers = {
  Query: {
    user: async (_, args) => {
      return userData.getUser(args.userName);
    }
  },
  Mutation: {
    addUser: async (_, args) => {
      return userData.createUser(args.userName);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
