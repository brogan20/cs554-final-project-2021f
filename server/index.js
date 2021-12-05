const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');
const userData = require('./dataFunctions/user')

const typeDefs = gql`
  type Query {
    users: [User]
  }

  type User {
    _id: String
    userName: String
    cardCollection: [Card]
    wallet: Int
  }

  type Card {
    _id: String
    _ardID: String
    cardName: String
    pic: Int
	count: Int
  }
  
  type Waif {
    _id: String
    characterName: String
	cardName: String
	description: String
	currentMeanPrice: Int
	popularityRank: Int
    miniPic: Int
  }
  
  type Listing {
    _id: String
    cardID: String
	cardName: String
	sellerName: String
	buyoutPrice: Int
	bidPrice: Int
    expirationDate: Int
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
