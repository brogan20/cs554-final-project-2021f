import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
    return (
        <div>
            <div style={{backgroundImage: `linear-gradient(rgba(42, 117, 187, 0.5), rgba(255, 203, 5, 0.5)), url('/pile.jpg')`}} className='home-banner'>
                <p className='home-heading'>The Pokémon Trading Card Game Reimagined.</p>
                <p className='home-heading'>(but worse)</p>
                <p className='home-heading'>This is Pokémon Bettles.</p>
            </div>
            <Container fluid>
                <Row>
                    <p className='fw-bold'>Do you enjoy yelling at random people online about what the best digital monster is?</p>
                    <p className='fw-bold'>Then we have the site for you!!!</p>
                </Row>
                <Row className="align-items-center home-row">
                    <Col>
                        <p>The only site that lets you buy, fight, and bet on pokemon 
                        based not on their stats, not on the trainers skill, but purely based on how <i>SICK</i> they are.</p>
                    </Col>
                    <Col>
                        <p>Earn your first pokemon pack free! It's like a slotmachine, except it's 
                            not regulated because it's aimed at kids.</p>
                    </Col>
                    <Col>
                        <p>Try to form your perfect pokemon team, only to quickly relize you don't have enough money.</p>
                    </Col>
                    <Col>
                        <p className="h-100">Be funneled into our betting ring, where you bet on odds that are hidden from you.</p>
                    </Col>
                    <Col>
                        <p>Go broke because you thought that emolga was a cool pokemon.</p>
                    </Col>
                    <Col>
                        <p>Take surveys in a desperate attempt to gain a pittance of currency, never enough to buy 
                            a new pack, but enough to go back to the casino!</p>
                    </Col>
                </Row>
                <Row>
                    <p className='home-heading'>Live the pokemon life!</p>
                </Row>
                <Link className="btn btn-primary" to="/signup">Login / Signup</Link>
            </Container>

        </div>
    )
}

export default Home;