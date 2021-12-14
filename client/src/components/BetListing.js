import React, { useEffect, useState } from "react";
import PokeCard from './PokeCard';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const BetListing = ({ battle }) => {
  const getTimeLeft = (timestamp) => {
    // Discard the time and time-zone information.
    const MS_PER_SECOND = 1000;
    let current = new Date();
    const utc1 = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());
    const utc2 = Date.UTC(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), current.getHours(), timestamp.getMinutes(), timestamp.getSeconds());
    let secs = (utc2-utc1) / MS_PER_SECOND;
    // console.log(secs);
    return {
      minutes: Math.floor(secs/60),
      seconds: secs%60
    }
  };
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(battle.timestamp));
  const [ expired, setExpired ] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     console.log('This will run after 1 second!')
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // });
  
  useEffect(() => {
    const interval = setInterval(() => {
      let remainder = getTimeLeft(battle.timestamp);
      if(remainder.minutes <= 0 && remainder.seconds <= 0){
        setExpired(true);
        // query the database for the winner!!
        clearInterval(interval);
      }
      setTimeLeft(remainder);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link className="bet-listing" to={`/betting/${battle.id}`}>
      <Container className="bet-grid" fluid>
        <Row className="row justify-content-center">
          <Col xs={2}>
            <p>{battle.player1.displayName}'s</p>
            <PokeCard pokemon={battle.pokemon1}/>
          </Col>
          <Col xs={2}>
            <p>vs.</p>
          </Col>
          <Col xs={2}>
            <p>{battle.player2.displayName}'s</p>
            <PokeCard pokemon={battle.pokemon2}/>
          </Col>
        </Row>
        <Row>
          {!expired && <p>Expires: {timeLeft.minutes}m, {timeLeft.seconds}s</p>}
          {expired && <p>Expired!</p>}
        </Row>
      </Container>
    </Link>
  );
};

export default BetListing;
