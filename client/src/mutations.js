import { gql } from '@apollo/client';

const CHANGE_FUNDS = gql`
    mutation ChangeFunds($userName: String, $toChange: Int) {
        changeFunds(userName: $userName, toChange: $toChange)
    }
`;

const CHANGE_POPULARITY = gql`
    mutation ChangePokemonPopularity($pokemonName: String, $toChange: Int) {
        changePokemonPopularity(pokemonName: $pokemonName, toChange: $toChange)
    }  
`;

let mutations = {
    CHANGE_FUNDS,
    CHANGE_POPULARITY
}

export default mutations;