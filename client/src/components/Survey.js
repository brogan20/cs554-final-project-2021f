import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useMutation, useQuery } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import { Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import mutations from '../mutations';

const useStyles = makeStyles({
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  }
});

const Survey = () => {
  const classes = useStyles();
  const [ cardData, setCardData ] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [changePopularity, {popResults}] = useMutation(mutations.CHANGE_POPULARITY);
  const [changeFunds, {fundResults}] = useMutation(mutations.CHANGE_FUNDS);
  let card = null;

  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          let result=new Array();
          let randOne = Math.floor(Math.random() * 898) + 1
          let pokemonOne = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randOne}/`);
          let randTwo = Math.floor(Math.random() * 898) + 1
          let pokemonTwo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randTwo}/`);
          result.push(pokemonOne);
          result.push(pokemonTwo);
          setCardData(result);
          setLoading(false);
        }
        catch(e){
          console.log(e)
        }
      }
      fetchData()
    },
    []
  )
  if (loading) {
    return (
      <Spinner animation="border" style={{alignSelf: 'center'}}/>
    );
  }
  else {
    
    const ourUsersCards = (pokemon) => {
      changePopularity({
        variables: {pokemonName: pokemon.pokemonName, toChange: 5}
      });
      changeFunds({
        variables: {userName: "James", toChange: 5} // swap "James" with name given from firebase
      });
      alert(`You voted for ${pokemon.pokemonName}! You just earned 5 PokeDollars`);
      window.location.reload(false);
    }
    
    const CardGrid = (pokemon) => {
      let pokeCardData = {
        pokemonID: pokemon.data.id,
        pokemonName: pokemon.data.name,
        imageLink: pokemon.data.sprites.front_default,
        isShiny: false
      };
      return(
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2} key={pokeCardData.pokemonID}>
          <PokeCard pokemon={pokeCardData}></PokeCard>
          <button onClick={() => ourUsersCards(pokeCardData)}>I Like this Pokemon</button>
        </Grid>
      )
    }

    const carder = () => {
      card =
        cardData.map((pokemon) => {
          return CardGrid(pokemon);
        })
    }

    carder();

    return(
      <div>
        <h1>Pick your favorite pokemon!</h1>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    )
  }
}

export default Survey;