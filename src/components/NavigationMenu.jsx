import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavigationMenu = () => {  
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" expand="lg" fixed="top" variant="dark">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {/* <Nav.Link href="/dashboards">Dashboards</Nav.Link>
          <Nav.Link href="/cadastro-professor">Cadastro de Professor</Nav.Link> */}
          <Nav.Link onClick={() => navigate('/', {replace:true})} >Dashboards</Nav.Link>
          <Nav.Link onClick={() => navigate('/cadastro-professor', {replace: true})}>Cadastro de Professores</Nav.Link>
          <Nav.Link onClick={() => navigate('/cadastro-reserva', { replace: true })}>Cadastro de Reserva</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationMenu;