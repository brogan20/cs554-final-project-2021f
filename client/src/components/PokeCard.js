import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Card } from 'react-bootstrap';

const PokeCard = ({pokemon}) =>{
    const cardRef = useRef();
    const [ data, setData ] = useState(null);
    let sprite = null;
    let type = null;

    useEffect(
        () => {
            const fetchData = async () =>{
                let res = null;
                try{
                    res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`); 
                    console.log(res.data);
                }
                catch(e){
                    // do nothing
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
        var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
        cardRef.current.style = tf;
    }

    const resetCard = (e) => {
        cardRef.current.style="";
    }

    if(data){
        sprite = data.sprites.other['official-artwork'].front_default;
        type = data.types[0].type.name;
    }
    return(
        <Card ref={cardRef} onMouseMove={rotateCard} onMouseOut={resetCard} className={`poke-card poke-card-${type}`}>
            <Card.Body className="poke-card-body">
                <Card.Title>{pokemon.name}</Card.Title>
                <Card.Img src={sprite} draggable="false"/>
            </Card.Body>
        </Card>
    )
}

export default PokeCard;