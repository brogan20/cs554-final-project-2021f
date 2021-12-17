import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <div style={{backgroundImage: `linear-gradient(rgba(42, 117, 187, 0.5), rgba(255, 203, 5, 0.5)), url('/pile.jpg')`}} className='home-banner'>
                <p className='fw-bold'>Have you ever wanted to gamble on a children's game?</p>
                <p className='fw-bold'>Do you enjoy yelling at random people online about what the best digital monster is?</p>
                <p className='fw-bold'>Then we have the site for you!!!</p>
                <p>Welcome to [NAME_PENDING], the only site that lets you buy, fight, and bet on pokemon 
                    based not on their stats, not on the trainers skill, but purely based on how *SICK* they are.</p>
                <p>Come join in and earn your first pokemon pack free; it's like a slotmachine, except it's 
                    not regulated because it's aimed at kids.</p>
                <p>Try to form your perfect pokemon team, only to quickly relize you don't have enough money.</p>
                <p>Be funneled into our betting ring, where you bet on odds that are hidden from you.</p>
                <p>Go broke because you thought that emolga was a cool pokemon.</p>
                <p>Take surveys in a desperate attempt to gain a pittance of currency, never enough to buy 
                    a new pack, but enough to go back to the casino!</p>
                <p>Live the pokemon life!</p>
            </div>
            <Link className="btn btn-primary" to="/signup">Log In / Sign Up</Link>
        </div>
    )
}

export default Home;