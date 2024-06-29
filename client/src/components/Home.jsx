import React, { useState, useEffect } from "react"
import '../css/Home.css';
import { Button, Stack } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiLogout, mdiCog, mdiPlusThick } from '@mdi/js';
import toast, { Toaster } from 'react-hot-toast';
import Settings from "./Settings"
import Today from "./Today"
import CreateTask from "./CreateTask"



function Home(){
    const [user, setUser] = useState(null);

    const getUserInfo = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8000/user/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('token')
        window.location.href = '/'
    }

    //modal
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [tasks, setTasks] = useState(0);

    const addTask = () => {
        setTasks(tasks + 1);
    }


    return (
        <>
        {user ? (<>
        <div className="Home">
            <Stack direction="horizontal">
                <h1>Hello,  {user.name} </h1>
                <Button variant="outline-primary" className="ms-auto" onClick={handleShow}>
                    <Icon path={mdiCog} size={1} />
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                    <Icon path={mdiLogout} size={1} />
                </Button>
            </Stack>
            <Settings user={user} onClose={handleClose} show={show} onUpdate={getUserInfo}/>
        </div>
            <Today user={user} taskCount={tasks}/>
            <CreateTask onUpdate={getUserInfo} user={user} addTask={addTask}/>
        </>):(null)}
        </>
    )
}


export default Home