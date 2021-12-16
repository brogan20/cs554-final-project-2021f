const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');
const userData = require('./dataFunctions/user');
const popularityData = require('./dataFunctions/popularity');
const battleData = require('./dataFunctions/battles');

const typeDefs = gql`
  type Query {
    user(userName: String!): User
    portfolio(userName: String!): [Pokemon]
    battles: [Battle]
  }

  type Bet {
    userName: String,
    predectedWinner: Pokemon,
    payout: Int
  }

  type Pokemon {
    pokemonID: String
    pokemonName: String
    imageLink: String
    isShiny: Boolean
  }

  type Bet {
    _id: ID
    userName: String
    predectedWinner: String
    payout: Int
  }

  type Battle {
    _id: ID
    trainerOne: String
    trainerTwo: String
    pokemonOne: Pokemon
    pokemonTwo: Pokemon
    winner: String
    battleBets: [Bet]
    payoutGiven: Boolean
    timeStamp: Float
  }

  type User {
    _id: String
    userName: String
    pokemonCollection: [Pokemon]
    wallet: Int
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
      const userName = args.userName;
      let user;
      try{
        user = await userData.getUser(userName);
      }
      catch(e){
        throw e;
      }
      return user;
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
    },
    battles: async() => {
      let ongoing;
      try{
        ongoing = await battleData.getCurrentBattles();
      }
      catch(e){
        throw e;
      }
      return ongoing;
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
  // console.log(`Finished battles have been resolved`);
  }, 10000);