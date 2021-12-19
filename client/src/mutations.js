import { gql } from "@apollo/client";

const ADD_USER = gql`
  mutation AddUser($userName: String!, $gid: String!) {
    addUser(userName: $userName, gid: $gid) {
      gid
      userName
    }
  }
`;

const CHANGE_FUNDS = gql`
  mutation ChangeFunds($gid: String, $toChange: Int) {
    changeFunds(gid: $gid, toChange: $toChange) {
      userName
    }
  }
`;

const CHANGE_POPULARITY = gql`
  mutation ChangePokemonPopularity($pokemonName: String, $toChange: Int) {
    changePokemonPopularity(pokemonName: $pokemonName, toChange: $toChange)
  }
`;

const PLACE_BET = gql`
  mutation Mutation(
    $gid: String
    $betAmount: Int
    $battleId: String
    $predictedWinner: String
  ) {
    createBet(
      gid: $gid
      betAmount: $betAmount
      battleID: $battleId
      predictedWinner: $predictedWinner
    ) {
      userName
      predictedWinner
      payout
    }
  }
`;

const ADD_POKEMON = gql`
  mutation AddPokemon(
    $pokemonID: String!
    $pokemonName: String!
    $imageLink: String!
    $isShiny: Boolean!
    $gid: String!
  ) {
    addPokemon(
      pokemonID: $pokemonID
      pokemonName: $pokemonName
      imageLink: $imageLink
      isShiny: $isShiny
      gid: $gid
    ) {
      pokemonID
      pokemonName
      imageLink
      isShiny
    }
  }
`;

const ADD_BATTLE = gql`
  mutation CreateBattle($trainers: [String], $givenPokemon: [PokemonInput]) {
    createBattle(trainers: $trainers, givenPokemon: $givenPokemon) {
      trainerOne
      trainerTwo
      pokemonOne {
        pokemonID
        pokemonName
        imageLink
        isShiny
      }
      pokemonTwo {
        pokemonID
        pokemonName
        imageLink
        isShiny
      }
      winner
    }
  }
`;

let mutations = {
  ADD_USER,
  CHANGE_FUNDS,
  CHANGE_POPULARITY,
  PLACE_BET,
  ADD_POKEMON,
  ADD_BATTLE,
};

export default mutations;
