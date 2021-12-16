import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import queries from '../queries';

const useStyles = makeStyles({
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  }
});

const CardPack = () => {
  const classes = useStyles();
  const [ cardData, setCardData ] = useState(undefined);

  // Query for all pokemon would go here
  // So something like; 
  /* const { load, err, pokemonData } = useQuery(
    queries.GET_ALL_POKEMON,
    {
      fetchPolicy: 'cache-and-network'
    }
  ); */

  // Query for Popularity would go here.
  // So something like
  /* const { load, err, popularData } = useQuery(
    queries.GET_POPULAR,
    {
      fetchPolicy: 'cache-and-network'
    }
  );*/

  let card = null;

  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          // Assumes logic for pokemon popularity is implemented and usable, I'll fix it once that's done.
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
              popular: while(popular>0){
                const random=Math.floor(Math.random(898))+1;
                const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}/`);
                const pokemon=pokemonData.find(p => p.name==res.results.name);
                if(pokemon.pokepop>=750){
                  const holo=Math.floor(Math.random(100));
                  if(holo<=1){
                    pokemon.isHolo=true;
                    result.push(pokemon);
                  }
                  else{
                    pokemon.isHolo=false;
                    result.push(pokemon);
                  }
                  popular--;
                  break;
                }
                else{
                  continue popular;
                }
              }
            }
            else{
              random: while(popular==0){
                const rand=Math.floor(Math.random(898))+1;
                const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${rand}/`);
                const pokemon=pokemonData.find(p => p.name==res.results.name);
                if(pokemon.pokepop>=750){
                  continue random;
                }
                else{
                  const holo=Math.floor(Math.random(100));
                  if(holo<=1){
                    pokemon.isHolo=true;
                    result.push(pokemon);
                  }
                  else{
                    pokemon.isHolo=false;
                    result.push(pokemon);
                  }
                  break;
                }
              }
            }
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

  const userCards = (pokemon) => {
    // Adds pokemon that user wants to their set of cards
    // currentUser.cards.push(pokemon) or something similar
  }
  
  const CardGrid = (pokemon) => {
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
        <PokeCard pokemon={pokemon}></PokeCard>
        <button onClick={userCards(pokemon)}>I want this pokemon</button>
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