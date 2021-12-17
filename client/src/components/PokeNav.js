import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';



const NavLink = ({name, to}) => {
    return(
        <li className='nav-item'>
            <Link className='nav-link' to={to}>{name}</Link>
        </li>
    )
}

const PokeNav = () => {

    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Link className="navbar-brand" to="/">Card Fight</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavLink name="Portfolio" to="/portfolio"/>
                    <NavLink name="Rankings" to="/rankings"/> 
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

export default PokeNav;