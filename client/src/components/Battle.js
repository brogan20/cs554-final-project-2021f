import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation,  ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import { Grid } from '@material-ui/core';
import queries from '../queries';
import mutations from '../mutations';

const Battle = () => {
    const [battleData, setBattleData] = useState(undefined);
    // Get the current User's username from firebase
    const { loading, error, userData } = useQuery(queries.GET_ALL_USERS, {
        fetchPolicy: "network-only"
    });
    const client = new ApolloClient({
        link: new HttpLink({
            uri: "http://localhost:4000/"
        }),
        cache: new InMemoryCache()
    });
    console.log(loading);
    console.log(error);
    console.log(userData);
    let pokemon1=null;

    // Query to get the whole team of the current user, so they can pick their pokemon to use.
    async function pokeQuery(user) {
        console.log(user)
        const { pokeData } = await client.query({ query: queries.GET_PORTFOLIO, variables: { variables: { userName: user.userName } } });
        return pokeData;
    }

    const battle=useMutation(mutations.ADD_BATTLE);

    useEffect(
        () => {
            const fetchData = async () => {
                try {
                    let result = new Array();
                    const random = Math.floor(Math.random(userData.length));
                    const user2 = userData[random];
                    //const pokeData = await pokeQuery(user); for current user
                    const pokeData2 = await pokeQuery(user2);
                    const rand = Math.floor(Math.random(pokeData2.length));
                    const pokemon2 = pokeData2[rand];
                    result.push(user2);
                    result.push(pokemon2);
                    console.log(result);
                    setBattleData(result);
                }
                catch (e) {
                    console.log(e)
                }
            }
            fetchData()
        },
        []
    )

    const CardGrid = (pokemon) => {
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.pokemonID}>
                <PokeCard pokemon={pokemon}></PokeCard>
                <button onClick={() => battle({ variables: { trainers: ["firebase", battleData[0]], givenPokemon: [pokemon, battleData[1]]}})}></button>
            </Grid>
        )
    }

    if (!pokemon1){
        /* Have user choose their pokemon
        battleData[2].map((pokemon)=>{
            return CardGrid(pokemon)
        })
        */
       return <h2>Need to implement Firebase</h2>
    }

    else if (battle.trainerTwo === battle.winner) {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={battle.pokemonOne.pokemonID}>
                        <PokeCard pokemon={battle.pokemonOne}></PokeCard>
                    </Grid>
                    <p>VS.</p>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={battle.pokemonTwo.pokemonID}>
                        <PokeCard pokemon={battle.pokemonTwo}></PokeCard>
                        <p>Winner!!!</p>
                    </Grid>
                </Grid>
            </div>
        )
    }
    else {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={battle.pokemonOne.pokemonID}>
                        <PokeCard pokemon={battle.pokemonOne}></PokeCard>
                        <p>Winner!!!</p>
                    </Grid>
                    <p>VS.</p>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={battle.pokemonTwo.pokemonID}>
                        <PokeCard pokemon={battle.pokemonTwo}></PokeCard>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Battle;