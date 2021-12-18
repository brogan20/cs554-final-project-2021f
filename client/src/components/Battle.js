import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation,  ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import queries from '../queries';
import mutations from '../mutations';

const useStyles = makeStyles({
    grid: {
      flexGrow: 1,
      flexDirection: 'row'
    }
  });

const Battle = () => {
    const classes = useStyles();
    //const [battleData, setBattleData] = useState(undefined);
    // Get the current User's username from firebase
    const { loading, error, data } = useQuery(queries.GET_ALL_USERS, {
        fetchPolicy: "network-only"
    });
    console.log(loading);
    console.log(error);
    console.log(data);
    let pokemon1=null;
    let user2=null;
    let pokemon2=null;
    if(!loading){
        const random = Math.floor(Math.random(data.allUsers.length));
        console.log(data.allUsers[random]);
        user2 = data.allUsers[random];
        console.log(user2);
        const rand = Math.floor(Math.random(user2.pokemonCollection.length));
        pokemon2 = user2.pokemonCollection[rand];
    }
    const [battle, {battleResults}]=useMutation(mutations.ADD_BATTLE);
    let card=null;

    /* useEffect(
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
    ) */

    const theCard = (trainer, pokemons) => {
        pokemon1=pokemons[0];
        battle({
          variables: {trainers: trainer, givenPokemon: pokemons}
        })
      }

    const CardGrid = (pokemon) => {
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.pokemonID}>
                <PokeCard pokemon={pokemon}></PokeCard>
                <button onClick={() => theCard(["Red", user2],[pokemon, pokemon2.pokemonName])}></button>
            </Grid>
        )
    }

    if (!pokemon1){
        /* Have user choose their pokemon
        card=
        pokeData &&
        pokeData.map((pokemon)=>{
            return CardGrid(pokemon)
        })
        */
        return (
            <div>
                <h2>Choose your pokemon for battle</h2>
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
            </div>
        )
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