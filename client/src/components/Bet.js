import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const getTimeLeft = (timestamp) => {
  // Discard the time and time-zone information.
  const MS_PER_SECOND = 1000;
  let current = new Date();
  const utc1 = Date.UTC(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    current.getHours(),
    current.getMinutes(),
    current.getSeconds()
  );
  const utc2 = Date.UTC(
    timestamp.getFullYear(),
    timestamp.getMonth(),
    timestamp.getDate(),
    current.getHours(),
    timestamp.getMinutes(),
    timestamp.getSeconds()
  );
  let secs = (utc2 - utc1) / MS_PER_SECOND;
  // console.log(secs);
  return secs;
};

const Bet = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(-1);
  const [betAmount, setBetAmount] = useState(0);
  // useQuery to get data
  const battle = {
    id: "1",
    player1: { displayName: "ash" },
    player2: { displayName: "gary" },
    pokemon1: { id: 25, name: "pikachu", isHolo: false },
    pokemon2: { id: 133, name: "eevee", isHolo: false },
    winner: null,
    timestamp: new Date(Date.now() + 120000),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let remainder = getTimeLeft(battle.timestamp);
      if (remainder <= 0) {
        setExpired(true);
        // query the database for the winner!!
        clearInterval(interval);
      }
      setSecondsLeft(remainder);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const setTrainer = (e, num) => {
    e.preventDefault();
    setSelectedTrainer(num);
  };

  const changeAmount = (e) => {
    e.preventDefault();
    setBetAmount(e.target.value);
  };

  const submitBet = (e) => {
    e.preventDefault();
    if (expired) {
      // do error
      return;
    }
    let amt = parseInt(betAmount);
    if (isNaN(amt) || amt <= 0 /*|| amt > max pokeDollars*/) {
      // do error
      return;
    }
    if (selectedTrainer !== 1 || selectedTrainer !== 0) {
      // do error
      return;
    }
    // do mutation here
  };

  return (
    <div>
      <h1>Betting</h1>
      <Container fluid>
        <Row className="row justify-content-center">
          <Col xs={2}>
            <button
              className={`bet-button ${
                selectedTrainer === 0 ? "bet-button-selected" : null
              }`}
              onClick={(e) => setTrainer(e, 0)}
            >
              <Row>
                <Col>
                  <p>{battle.player1.displayName}'s</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <PokeCard pokemon={battle.pokemon1} />
                </Col>
              </Row>
              <Row>
                {selectedTrainer === 0 ? (
                  <p>Currently Selected</p>
                ) : (
                  <p>Click to select</p>
                )}
              </Row>
            </button>
          </Col>
          <Col xs={2}>
            <Row>
              <p>vs.</p>
            </Row>
            <Row>
              <Form onSubmit={submitBet}>
                <Form.Group>
                  <Form.Label>Bet Amount</Form.Label>
                  <Form.Control
                    onChange={changeAmount}
                    type="number"
                    name="amount"
                    placeholder="enter amount to bet"
                  />
                </Form.Group>
                {!expired && <Button>Submit Bet</Button>}
                {expired && <div className="btn-danger">Expired!</div>}
              </Form>
            </Row>
          </Col>
          <Col xs={2}>
            <button
              className={
                selectedTrainer === 1
                  ? "bet-button bet-button-selected"
                  : "bet-button"
              }
              onClick={() => setSelectedTrainer(1)}
            >
              <Row>
                <Col>
                  <p>{battle.player2.displayName}'s</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <PokeCard pokemon={battle.pokemon2} />
                </Col>
              </Row>
              <Row>
                {selectedTrainer === 1 ? (
                  <p>Currently Selected</p>
                ) : (
                  <p>Click to select</p>
                )}
              </Row>
            </button>
          </Col>
        </Row>
        <Row>
          {!expired && (
            <p>
              Expires: {Math.floor(secondsLeft / 60)}m, {secondsLeft % 60}s
            </p>
          )}
          {expired && <p>Expired!</p>}
        </Row>
      </Container>
      <Link to="/betting">
        <Button>Back to listings</Button>
      </Link>
    </div>
  );
};

export default Bet;
