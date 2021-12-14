import React from 'react';
import { Link } from 'react-router-dom';

const BetListing = ({battle}) => {
    const [ timeLeft, setTimeLeft ] = useState(Date.now());

    const getTimeLeft = (endDate) => {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    return (
        <Link key={battle.id}>
            <div>
                <p>{battle.player1}'s {battle.pokemon1} vs. {battle.player2}'s {battle.pokemon2}</p>
                <p>Expires {timestamp}</p>
            </div>
        </Link>
    )
}

export default BetListing;