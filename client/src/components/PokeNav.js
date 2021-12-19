import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import queries from "../queries";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../firebase/AuthContext";
import WalletContext from '../contexts/walletCon';


const NavLink = ({name, to}) => {
    return(
        <li className='nav-item'>
            <Link className='nav-link' to={to}>{name}</Link>
        </li>
    )
}

const PokeNav = () => {
    const { currentUser } = useContext(AuthContext);
    const { userWallet } = useContext(WalletContext);
    if(!currentUser){

    };
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Link className="navbar-brand" to="/">Pokémon Bettles</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavLink name="Portfolio" to="/portfolio"/>
                    <NavLink name="New Card Pack" to="/cardpack"/>
                    <NavDropdown title="Battles" id="basic-nav-dropdown">
                    <Link className="dropdown-item" to="/betting">Betting</Link>
                    <Link className="dropdown-item" to="/survey">Voting</Link>
                    <NavDropdown.Divider />
                    <Link className="dropdown-item" to="/battle">Battle Registration</Link>
                    </NavDropdown>
                    {currentUser && <NavLink name={`${currentUser.displayName}: ${userWallet}$`} to="/payment"/>}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default PokeNav;