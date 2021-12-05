import React from "react";
import { useQuery } from '@apollo/client';
import PokeCard from "./PokeCard";
import { Container, Col, Row, Spinner } from 'react-bootstrap';

const Portfolio = (props) =>{
    // commenting out until functions are made
    // const { loading, error, data } = useQuery();
    let data = [{id: 25, name: 'pikachu', image: 'some url', isHolo: false}];
    let loading = false;
    let cardList = null; 

    if(loading){
        return(
            <Spinner/>
        )
    }

    cardList =
        data &&
        data.map((pokemon) => {
            return(
                <Col xs={2}>
                    <PokeCard pokemon={pokemon}/>
                </Col>
            )
        });

    return(
        <Container fluid>
            <Row>
                {cardList}
            </Row>
        </Container>
        
    )
}

export default Portfolio;