import React, { useState, useEffect, useRef } from "react";
import BetListing from './BetListing';
import { useQuery } from "@apollo/client";
import axios from 'axios';

const Betting = ({pokemon}) =>{
    const [ data, setData ] = useState(null);
    let betList = null;

    useEffect(
        () => {
            const fetchData = async () =>{
                
            }
            fetchData()
        },
        []
    )

    if(data){
        betList =
            data && 
            data.map((bet) => {
                <BetListing battle={bet}/>
            });
    }

    return(
        <div>
            <h1>Ongoing Bets</h1>
            <div>
                {betList}
            </div>
        </div>
    )
}

export default Betting;