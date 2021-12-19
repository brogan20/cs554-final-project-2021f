import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Card } from 'react-bootstrap';

const PokeCard = ({pokemon}) =>{
  const cardRef = useRef();
  const [ data, setData ] = useState(null);
  const [ isBack, setIsBack ] = useState(false);
  let sprite = null;
  let type = null;

  useEffect(
    () => {
      if(pokemon.isBack){
        setIsBack(true);
        return
      }
      const fetchData = async () =>{
        let res = null;
        try{
          res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemonID}/`); 
        }
        catch(e){
          // maybe make a placeholder image
          return;
        }
        setData(res.data);
      }
      fetchData()
    },
    []
  )

  const rotateCard = (e) => {
    e.preventDefault();
    // +5 for border
    var l = e.nativeEvent.offsetX+5;
    var t = e.nativeEvent.offsetY+5;
    // height and width of card
    var w = cardRef.current.offsetWidth;
    var h = cardRef.current.offsetHeight;
    // clamp position between 0 and 100
    var px = Math.abs(Math.floor(100 / w * l)-100);
    var py = Math.abs(Math.floor(100 / h * t)-100);
    // calculate rotation
    var lp = (px - 50)/1.5;
    var tp = (py - 50)/1.5;
    var tx = (lp/1.5) * .5;
    var ty = (tp/1.5) * -1;
    var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`;
    cardRef.current.style = tf;
    cardRef.current.firstChild.style = `background-position: ${px}% ${py}%`;

  }

  const setClass = (e) => {
    cardRef.current.className = cardRef.current.className + " poke-card-active";
  }

  const resetCard = (e) => {
    cardRef.current.style="";
    cardRef.current.firstChild.style = "";
    cardRef.current.className = cardRef.current.className.replace(' poke-card-active', '');
  }

  if(isBack){
    return (
    <Card ref={cardRef} onMouseMove={rotateCard} onMouseOver={setClass} onMouseOut={resetCard}>
      <Card.Body className={`poke-card-body ${pokemon.isShiny ? "poke-card-holo" : ""}`}>
        <img style={{width: '100%'}} src="/cardpack.png" alt="cardpack"/>
      </Card.Body>
    </Card>)
  }

  if(data){
    sprite = data.sprites.other['official-artwork'].front_default;
    type = data.types[0].type.name;
  }
  return(
    <Card ref={cardRef} onMouseMove={rotateCard} onMouseOver={setClass} onMouseOut={resetCard} className={`poke-card poke-card-${type}`}>
      <Card.Body className={`poke-card-body ${pokemon.isShiny ? "poke-card-holo" : ""}`}>
        <Card.Title>{pokemon.pokemonName}</Card.Title>
        <Card.Img src={sprite} alt={pokemon.pokemonName}draggable="false"/>
      </Card.Body>
    </Card>
  )
}

export default PokeCard;
