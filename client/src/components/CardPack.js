import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import queries from '../queries';
import mutations from '../mutations';

const useStyles = makeStyles({
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  }
});

const CardPack = () => {
  const classes = useStyles();
  const [ cardData, setCardData ] = useState(undefined);
  let popular=0;
  let popularNum=Math.floor(Math.random(100))+1;
  if(popularNum==1){
    popular=3;
  }
  else if(popularNum>=2 && popularNum<=4){
    popular=2;
  }
  else if(popularNum>=5 && popularNum<=10){
    popular=1;
  }
  else{
    popular=0;
  }
  const randomOne=Math.floor(Math.random(898))+1;
  const pokemonOne = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomOne}/`);
  const { loading, error, popularOneData } = useQuery(queries.GET_POPULARITY, {
    variables: {pokemonName: pokemonOne.data.name},
    fetchPolicy: "network-only"
  });
  const randomTwo=Math.floor(Math.random(898))+1;
  const pokemonTwo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomTwo}/`);
  const { loading1, error1, popularTwoData } = useQuery(queries.GET_POPULARITY, {
    variables: {pokemonName: pokemonTwo.data.name},
    fetchPolicy: "network-only"
  });
  const randomThree=Math.floor(Math.random(898))+1;
  const pokemonThree = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomThree}/`);
  const { loading2, error2, popularThreeData } = useQuery(queries.GET_POPULARITY, {
    variables: {pokemonName: pokemonThree.data.name},
    fetchPolicy: "network-only"
  });
  let pokemonList=[pokemonOne, pokemonTwo, pokemonThree];
  let popularityList=[popularOneData, popularTwoData, popularThreeData];
  const addPokemon=useMutation(mutations.ADD_POKEMON);
  let card = null;


  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          let result=new Array();
          if(popularOneData && popularTwoData && popularThreeData){
          for(let i=0; i<3; i++){
            const shiny=Math.floor(Math.random(100));
            if(shiny<=1){
              pokemonList[i].data.isShiny=true;
              result.push(pokemonList[i].data);
            }
            else{
              pokemonList[i].data.isShiny=false;
              result.push(pokemonList[i].data);
            }
          }
          console.log(result);
          setCardData(result);
        }
        }
        catch(e){
          console.log(e)
        }
      }
      fetchData()
    },
    []
  )
  
  const CardGrid = (pokemon) => {
    const id=pokemon.id;
    const name=pokemon.name;
    const image=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    const shiny=pokemon.isShiny;
    const userName="firebase" // Will be received from firebase
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
        <PokeCard pokemon={pokemon}></PokeCard>
        <button onClick={() => addPokemon({ variables: { id, name, image, shiny, userName }})}>I want this pokemon</button>
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
      <h1>Get a new Card Pack!</h1>
      <br />
      <button onClick={carder}>Claim Card Pack!</button>
      <Grid container className={classes.grid} spacing={5}>
        {card}
      </Grid>
    </div>
  )
}

export default CardPack;