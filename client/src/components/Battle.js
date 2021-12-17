import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation } from '@apollo/client';
import { Grid } from '@material-ui/core';
import queries from '../queries';
import mutations from '../mutations';

const Battle = () => {
    // Get the current User's username from firebase
    const { loading, error, userData } = useQuery(queries.GET_ALL_USERS, {
        fetchPolicy: "network-only"
    });
    const random=Math.floor(Math.random(userData.length));
    const user2=userData[random];
    // Query to get the whole team of the current user, so they can pick their pokemon to use.
    const { loading1, error1, pokeData } = useQuery(queries.GET_PORTFOLIO, {
        variables: {userName: user2},
        fetchPolicy: "network-only"
    });
    const rand=Math.floor(Math.random(pokeData.length));
    const pokemon2=pokeData[rand];
    const battle = useMutation(mutations.ADD_BATTLE, {
        variables: {trainers: ["firebase", user2], givenPokemon: ["pikachu", pokemon2]}
    });

    if(error){
        return <h2>{error.message}</h2>
    }
    else if(error1){
        return <h2>{error1.message}</h2>
    }

    if(battle.trainerTwo===battle.winner){
        return(
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
    else{
        return(
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
}

export default Battle;