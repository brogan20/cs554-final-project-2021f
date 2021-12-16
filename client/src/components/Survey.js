import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import queries from '../queries';
import axios from 'axios';

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
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  else {
    const userCards = (pokemon, e) => {
      console.log("This is where you change a pokemons popualrity");
      console.log("you should add funds here, like 5 bucks");
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
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokeCardData.pokemonID}>
          <PokeCard pokemon={pokeCardData}></PokeCard>
          <button onClick={() => userCards(pokeCardData)}>I Like this Pokemon</button>
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