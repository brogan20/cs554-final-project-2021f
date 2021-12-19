import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import queries from "../queries";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../firebase/AuthContext";


const NavLink = ({name, to}) => {
    return(
        <li className='nav-item'>
            <Link className='nav-link' to={to}>{name}</Link>
        </li>
    )
}

const PokeNav = () => {
    const { currentUser } = useContext(AuthContext);
    if(!currentUser){
      return(
        <div>
          <h2>You must log in to see your portfolio.</h2>
          <Link className="btn btn-primary" to="/signup">Login / Signup</Link>
        </div>
      )
    };
    const { loading, error, data } = useQuery(queries.GET_PORTFOLIO, {
      variables: { gid: currentUser.uid }, 
      fetchPolicy: "network-only",
    });
    if (error || loading) {
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
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
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
                    <NavLink name={`${data.userName}: ${data.wallet}$`} to="/payment"/>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default PokeNav;