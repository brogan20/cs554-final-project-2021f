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
  let card = null;

  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          let result=new Array();
          let randOne = Math.floor(Math.random(898))+1;
          let pokemonOne = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randOne}/`);
          let randTwo = Math.floor(Math.random(898))+1;
          let pokemonTwo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randTwo}/`);
          result.push(pokemonOne);
          result.push(pokemonTwo);
          setCardData(result);
        }
        catch(e){
          console.log(e)
        }
      }
      fetchData()
    },
    []
  )

  const userCards = (pokemon) => {
    console.log(pokemon);
    console.log("you should add funds here, like 5 bucks");
  }
  
  const CardGrid = (pokemon) => {
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
        <PokeCard pokemon={pokemon}></PokeCard>
        <button onClick={userCards(pokemon)}>I Like this Pokemon</button>
      </Grid>
    )
  }

  const carder = () => {
    card =
      cardData.map((pokemon) => {
        return CardGrid(pokemon);
      })
  }

  return(
    <div>
      <h1>Pick your favorite pokemon!</h1>
      <br />
      <button onClick={carder}>Earn That Money</button>
      <Grid container className={classes.grid} spacing={5}>
        {card}
      </Grid>
    </div>
  )
}

export default Survey;