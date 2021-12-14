import React from "react";
import { useQuery } from '@apollo/client';
import { Container, Col, Row, Spinner, Card } from 'react-bootstrap';

const Ranking = (props) =>{
  // commenting out until functions are made
  // const { loading, error, data } = useQuery();
  let data = [ // sorted by most popular to least popular
    {
      id: 25,
      name: 'pikachu',
      image: 'some url',
      isHolo: false,
      ranking: 2000,
      totalWins: 20420,
      totalLosses: 20310,
    },
    {
      id: 1,
      name: 'bulbasaur',
      image: 'some url',
      isHolo: false,
      ranking: 1999,
      totalWins: 20420,
      totalLosses: 20310,
    }];
  // src: https://thewebdev.info/2021/04/24/how-to-add-an-ordinal-suffix-to-a-javascript-number/
  const ordinal = (number) => {
    const ordinalRules = new Intl.PluralRules("en", {
      type: "ordinal"
    });
    const suffixes = {
      one: "st",
      two: "nd",
      few: "rd",
      other: "th"
    };
    const suffix = suffixes[ordinalRules.select(number)];
    console.log(number)
    return (number + suffix);
  }

  let loading = false;

  if (loading){
    return(
      <Spinner/>
    )
  }

  return(
    <div>
      <h1>Portfolio</h1>
      <p>{data.length} cards in collection</p>
      <Container fluid>
        <Row>
          {data.map((p, i) => (
            <Col xs={2}>
              <Card>
                <Card.Img
                  variant="top"
                  src={p.image}
                />
                <Card.Body>
                  <Card.Title>{p.name}</Card.Title>
                  <Card.Text>
                    {i ? `${ordinal(i + 1)} ` : ""}Most Popular
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Ranking;
