import React, { useState } from "react"
import '../css/Register.css';
import { Card, Button, FloatingLabel, Form } from 'react-bootstrap'; 
import toast, { Toaster } from 'react-hot-toast';
import config from "../config"

function Register() {
    const [view, setView] = useState("login");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const changeView = () => {
        setView(view === "login" ? "register" : "login");
    };

    const authCall = async (e) => {
        const endpoint = view === "login" ? "login" : "register";
        if (view === "register" && password !== confirmPassword) {
            toast.error("Passwords do not match");
            
        }
        try {
            const dToIn = {
                email: email,
                password: password,
            };

            const response = await fetch(config.uri+`/auth/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dToIn),
            });

            const data = await response.json();
            
            if (response.status === 201) {
                toast.success("Successfully registered");
                setView("login");
            } else if (response.status === 400) {
                toast.error("Wrong credidentals");
            } else if (response.status === 200){
                console.log(response);
                localStorage.setItem('token', data.token);
                toast.success("Successfully logged in");
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            toast.error(error);
        }
    };

    const submitForm = (e) => {
        e.preventDefault()
        authCall()

    }

    const demoLogin = () => {
        setEmail("demo@todo.com")
        setPassword("password")
        setTimeout(() => {
            authCall()
        }, 100)
    }


    return (
        <div className="Register">
            <Toaster position="top-center" reverseOrder={false}/>
            <div className="Logo">
                <h1>TO•DO</h1>
                <p>Simplify your life now.</p>
            </div>
            <div className="Card">
                {view === "register" ? (
                    <Card style={{ width: "30rem" }}>
                        <Card.Title as="h2">Sign Up</Card.Title>
                            <Form onSubmit={submitForm} style={{ padding: "30px" }}>
                                <FloatingLabel label="Email">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        style={{ margin: "20px 0" }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Confirm Password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        style={{ margin: "20px 0" }}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </FloatingLabel>
                                <Button type="submit" style={{ marginTop: "15px" }} disabled={!password || !confirmPassword || password !== confirmPassword}>
                                    {view === "login" ? "Log In" : "Sign Up"}
                                </Button>
                            </Form>
                        
                        <p className="Changer">Already a member? <a href="#!" onClick={changeView}>Login</a></p>
                    </Card>

                ) : (
                    <Card style={{ width: "30rem" }}>
                        <Card.Title as="h2">Login</Card.Title>
                        <Card.Text>
                                <Form onSubmit={submitForm} style={{ padding: "30px" }}>
                                    <FloatingLabel label="Email">
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Password">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            style={{ margin: "20px 0" }}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <Button type="submit" style={{ marginTop: "15px" }}>
                                        {view === "login" ? "Log In" : "Sign Up"}
                                    </Button>
                                </Form>
                        </Card.Text>
                        <p className="Changer">Need an account? <a href="#!" onClick={changeView}>Sign up</a></p>
                        <Button variant="success" onClick={demoLogin}>View demo</Button>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Register;