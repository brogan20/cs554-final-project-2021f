import React from "react";
import { Card } from 'react-bootstrap';

const PokeCard = ({pokemon}) =>{

    return(
        <Card>
            <Card.Body>
                <Card.Title>{pokemon.name}</Card.Title>
            </Card.Body>
        </Card>
    )
}

export default PokeCard;