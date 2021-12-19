import { gql } from '@apollo/client';

const GET_PORTFOLIO = gql`
    query getPortfolio($gid: String!) {
        portfolio(gid: $gid){
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

const GET_POPULARITY = gql`
    query PokemonPopularity($pokemonName: String!) {
        pokemonPopularity(pokemonName: $pokemonName)
    }
`;

const GET_ALL_USERS = gql`
    query AllUsers($gid: String!) {
        allUsers(gid: $gid) {
            _id
            userName
            pokemonCollection {
                pokemonID
                pokemonName
                imageLink
                isShiny
            }
        }
    }
`

const GET_USER = gql`
    query getUser($gid: String!) {
        user(gid: $gid){
            _id
            gid
            userName
            pokemonCollection {
                pokemonID
                pokemonName
                imageLink
                isShiny
            }
            wallet
        }
    }
`;

let queries = {
    GET_PORTFOLIO,
    GET_ALL_BATTLES,
    GET_BETTER_BATTLE,
    GET_POPULARITY,
    GET_ALL_USERS,
    // GET_USER
}

export default queries;