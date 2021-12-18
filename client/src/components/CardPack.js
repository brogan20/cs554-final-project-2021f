import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
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
  const [ loading, setLoading ] = useState(false);
  /*const client = new ApolloClient({
    link: new HttpLink({
      uri: "http://localhost:4000/"
    }),
    cache: new InMemoryCache()
  });*/

  /*let poke=new Array();

  const getPokemonName = async (r) => {
    const pokemon=await axios.get(`https://pokeapi.co/api/v2/pokemon/${r}/`);
    poke.push(pokemon);
    return pokemon.data.name;
  }

  const randomOne=Math.floor(Math.random()*898)+1;
  const randomTwo=Math.floor(Math.random()*898)+1;
  const randomThree=Math.floor(Math.random()*898)+1;*/

  /*const { popularityOne } = useQuery(queries.GET_POPULARITY, {
    variables: { pokemonName: getPokemonName(randomOne)}
  });
  const { popularityTwo } = useQuery(queries.GET_POPULARITY, {
    variables: { pokemonName: getPokemonName(randomTwo)}
  });
  const { popularityThree } = useQuery(queries.GET_POPULARITY, {
    variables: { pokemonName: getPokemonName(randomThree)}
  });*/

  /*if(popularityOne && popularityTwo && popularityThree){
  for(let i=0; i<3; i++){
    const shiny=Math.floor(Math.random()*100)+1;
    if(shiny<=2){
      poke[i].isShiny=true;
    }
    else{
      poke[i].isShiny=false;
    }
  }
} */
  const [addPokemon, {data, load, error}]=useMutation(mutations.ADD_POKEMON);
  let card=null;

  /*async function popularQuery(pokemon){
    console.log(pokemon)
    const { popularData } = await client.query({query: queries.GET_POPULARITY, variables: { pokemonName: pokemon.name}});
    console.log(popularData)
    return popularData;
  }*/

  useEffect(
    () => {
      console.log("useEffect fired")
      const fetchData = async () =>{
        console.log("fetchData fired")
        try{
          setLoading(true);
          let result=new Array();
          /*let popular=0;
          let popularNum=Math.floor(Math.random()*100)+1;
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
          }*/
          for(let i=0; i<3; i++){
            /*if(popular>0){
              console.log(popular);
            pop: while(popular>0){*/
              const random=Math.floor(Math.random()*898)+1;
              console.log(random)
              const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}/`);
              console.log(pokemon.data)
              /*const popularity=await popularQuery(pokemon.data);
              if(popularity<750){
                continue pop;
              }
              else{*/
                const shiny=Math.floor(Math.random()*100);
                if(shiny<=1){
                  //popular--;
                  pokemon.data.isShiny=true;
                  result.push(pokemon.data);
                }
                else{
                  //popular--;
                  pokemon.data.isShiny=false;
                  result.push(pokemon.data);
                }
              //}
          /*  }
          }
          else{
            random: while(popular==0){
              const random=Math.floor(Math.random()*898)+1;
              console.log(random);
              const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}/`);
              console.log(pokemon)
              const popularity=await popularQuery(pokemon);
              console.log(popularity)
              if(popularity>=750){
                continue random;
              }
              else{
                const shiny=Math.floor(Math.random()*100)+1;
                if(shiny<=2){
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
          }*/
        }
          console.log(result);
          setCardData(result);
          setLoading(false);
        }
        catch(e){
          console.log(e)
        }
      }
      if(!loading){
      fetchData();
      }
    },
    []
  )
  
  const CardGrid = (pokemon) => {
    console.log("cardgrid")
    const id=pokemon.id;
    pokemon.pokemonID=id;
    const name=pokemon.name;
    pokemon.pokemonName=name;
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

  console.log(cardData)

  if(cardData){

  card =
    cardData &&
    cardData.map((pokemon) => {
      return CardGrid(pokemon);
    })

  console.log(card)
  }

  return(
    <div>
      <h1>Get a new Card Pack!</h1>
      <br />
      <button onClick="">Claim Card Pack!</button>
      <Grid container className={classes.grid} spacing={5}>
        {card}
      </Grid>
    </div>
  )
}

export default CardPack;