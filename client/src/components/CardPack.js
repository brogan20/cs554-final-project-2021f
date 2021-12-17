import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import queries from '../queries';
import mutations from '../mutations';
import axios from 'axios';

const useStyles = makeStyles({
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  }
});

const CardPack = () => {
  const classes = useStyles();
  const [ cardData, setCardData ] = useState(undefined);
  const client = useApolloClient();
  const addPokemon=useMutation(mutations.ADD_POKEMON);
  let card=null;

  async function popularQuery(pokemon){
    const { loading, error, popularData } = await client.query({query: queries.GET_POPULARITY, variables: { pokemonName: pokemon.data.name}});
    if(error){
      return `${error.message}`
    }
    return popularData;
  }

  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          let result=new Array();
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
          for(let i=0; i<3; i++){
            if(popular>0){
              console.log(popular);
            pop: while(popular>0){
              const random=Math.floor(Math.random(898))+1;
              const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}/`);
              const popularity=popularQuery(pokemon);
              if(typeof popularity != 'number'){
                popular=-1;
                throw `${popularity}`
              }
              else if(popularity<750){
                continue pop;
              }
              else{
                const shiny=Math.floor(Math.random(100));
                if(shiny<=1){
                  pokemon.data.isShiny=true;
                  result.push(pokemon.data);
                }
                else{
                  pokemon.data.isShiny=false;
                  result.push(pokemon.data);
                }
                break;
              }
            }
          }
          else{
            random: while(popular==0){
              const random=Math.floor(Math.random(898))+1;
              const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}/`);
              const popularity=popularQuery(pokemon);
              if(typeof popularity != 'number'){
                popular=-1;
                throw `${popularity}`;
              }
              else if(popularity>=750){
                continue random;
              }
              else{
                const shiny=Math.floor(Math.random(100));
                if(shiny<=1){
                  pokemon.data.isShiny=true;
                  result.push(pokemon.data);
                }
                else{
                  pokemon.data.isShiny=false;
                  result.push(pokemon.data);
                }
                break;
              }
            }
          }
          }
          if(popular==-1){
            return <h2>Failed to Fetch</h2>
          }
          console.log(result);
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