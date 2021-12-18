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
    pokemonPopularity(pokemonName: String!): Int
    oneBattle(battleID: String!): Battle
    allUsers: [User]
  }

  type Pokemon {
    pokemonID: String
    pokemonName: String
    imageLink: String
    isShiny: Boolean
  }

  type Battle {
    _id: String
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

  type Bet {
    userName: String
    predictedWinner: String
    payout: Int
  }

  type GenericCodeMess {
    code: Int
    message: String
  }
  
  type Mutation {
    addUser(
      userName: String!
    ): User
    addPokemon(
      pokemonID: String!
      pokemonName: String!
      imageLink: String!
      isShiny: Boolean!
      userName: String!
    ): Pokemon
    changeFunds(
      userName: String
      toChange: Int
    ): Int
    changePokemonPopularity(
      pokemonName: String
      toChange: Int
    ): Int
    createBattle(
      trainers: [String]
      givenPokemon: [String]
    ): Battle
    createBet(
      userName: String
      betAmount: Int
      battleID: String
      predictedWinner: String
    ): Bet
    popualtePokemonData: GenericCodeMess
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
    battles: async (_, args) => {
      let ongoing;
      try{
        ongoing = await battleData.getCurrentBattles();
      }
      catch(e){
        throw e;
      }
      return ongoing;
    },
    pokemonPopularity: async (_, args) => {
      let pokePop;
      try{
        pokePop = await popularityData.getPokemonPopularity(args.pokemonName);
      }
      catch(e){
        throw e;
      }
      return pokePop;
    },
    oneBattle: async (_, args) => {
      let ourBattle;
      try{
        ourBattle = await battleData.getBattle(args.battleID);
      }
      catch(e){
        throw e;
      }
      return ourBattle;
    },
    allUsers: async (_, args) => {
      let userList;
      try{
        userList = await userData.getAllUsers();
      }
      catch(e){
        throw e;
      }
      return userList;
    }
  },
  Mutation: {
    addUser: async (_, args) => {
      let ourUser;
      try{
        ourUser = await userData.createUser(args.userName);
      }
      catch(e){
        throw e;
      }
      return ourUser;
    },
    addPokemon: async (_, args) => {
      let ourPokemon;
      try{
        ourPokemon = await userData.addPokemon(args.pokemonID, args.pokemonName, args.imageLink, args.isShiny, arrs.userName);
      }
      catch(e){
        throw e;
      }
      return ourPokemon;
    },
    changeFunds: async (_, args) => {
      let newFunds;
      try{
        newFunds = await userData.changeFunds(args.userName, args.toChange);
      }
      catch(e){
        throw e;
      }
      return newFunds;
    },
    changePokemonPopularity: async (_, args) => {
      let newPopularity;
      try{
        newPopularity = await popularityData.changePokemonPopularity(args.pokemonName, args.toChange);
      }
      catch(e){
        throw e;
      }
      return newPopularity;
    },
    createBattle: async (_, args) => {
      let newBattle;
      try{
        newBattle = await battleData.createBattle(args.trainers[0], args.trainers[1], args.givenPokemon[0], args.givenPokemon[1]);
      }
      catch(e){
        throw e;
      }
      return newBattle;
    },
    createBet: async (_, args) => {
      let newBet;
      try{
        newBet = await battleData.createBet(args.userName, args.betAmount, args.battleID, args.predictedWinner);
      }
      catch(e){
        throw e;
      }
      return newBet;
    },
    popualtePokemonData: async (_, args) => {
      let genericCodes;
      try{
        genericCodes = await popularityData.initPopularity();
      }
      catch(e){
        throw e;
      }
      return genericCodes;
    },
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