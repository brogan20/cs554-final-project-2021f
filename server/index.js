const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');
const userData = require('./dataFunctions/user');
const popularityData = require('./dataFunctions/popularity');
const battleData = require('./dataFunctions/battles');

const typeDefs = gql`
  type Query {
    user(
      userName: String!
    ): User
    portfolio(
      userName: String!
    ): [Pokemon]
  }

  type User {
    _id: String
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
    },
    portfolio: async(_, args) => {
      const userName = args.userName;
      let user;
      try{
        user = await userData.getUser(userName);
      }
      catch(e){
        throw e;
      }
      return user.pokemonCollection;
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

let resolvedBattleData;
time=setInterval(async function(){
  resolvedBattleData = await battleData.payoutAllBattles();
  console.log(`Finished battles have been resolved`);
  console.log(`${resolvedBattleData.deletedBattles} battles have been deleted`);
  console.log(`${resolvedBattleData.paidBattles} battles paid out`);
  console.log(`${resolvedBattleData.bettersHere} betters have been paid(or not if they suck lamo)`);
  },10000);