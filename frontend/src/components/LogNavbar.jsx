import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
const LogNavbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); 
        
        navigate('/login');
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
            <Container>
                <Navbar.Brand href="/home" className="fw-bold text-primary">
                    Ledger
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        
                        <span className="text-muted me-3 small fw-semibold">
                            Hello, {auth.user?.UserInfo?.email || 'User'}
                        </span>

                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={handleLogout}
                            className="px-3"
                        >
                            Log Out
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default LogNavbar;