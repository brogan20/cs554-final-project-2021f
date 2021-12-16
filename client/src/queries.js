import { gql } from '@apollo/client';

const GET_PORTFOLIO = gql`
    query getPortfolio($userName: String!) {
        portfolio(userName: $userName){
            pokemonID
            pokemonName
            imageLink
            isShiny
        }
    }
`;

const GET_ALL_BATTLES = gql`
    query {
        battles {
            _id
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
            timeStamp
        }
    }
`;

const GET_BETTER_BATTLE = gql`
    query OneBattle($battleId: String!) {
        oneBattle(battleID: $battleId) {
        _id
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
        timeStamp
        }
    }
`

let queries = {
    GET_PORTFOLIO,
    GET_ALL_BATTLES,
    GET_BETTER_BATTLE
}

export default queries;