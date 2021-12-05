const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');

const typeDefs = gql`
  type Query {
    users: [User]
  }

  type User {
    _id: String
    username: String
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

};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
