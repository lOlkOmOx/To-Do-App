import React, { useState, useEffect } from "react"
import '../css/Home.css';
import { Button, Stack } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiLogout } from '@mdi/js';
import Settings from "./Settings"
import Today from "./Today"
import CreateTask from "./CreateTask"
import Container from "./Container"
import { getUser } from "../api/user"
import { useTranslation } from './Translation'

function Home(){
    const { t, changeLanguage } = useTranslation()
    const [user, setUser] = useState(null)

    const getUserData = async () => {
        try {
            const data = await getUser()
            if (data) {
            setUser(data.user)
            }
        } catch (error) {
            console.log(error)
        } 
    }

    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        if (user) {
            changeLanguage(user.language);
        }
    }, [user]);

    const handleLogout = async () => {
        localStorage.removeItem('token')
        window.location.href = '/'
    }

    const [tasks, setTasks] = useState(0);
    const addTask = () => {
        setTasks(tasks + 1);
    }

    return (
        <>
            {user ? (<>
                <div className="Home">
                    <Stack direction="horizontal">
                        <h1> {t.hello} {user.name}!</h1>
                        <div className="ms-auto">
                            <Settings user={user} onUpdate={getUserData}/>
                        </div>
                        <Button variant="danger" onClick={handleLogout}>
                            <Icon path={mdiLogout} size={1.5} />
                        </Button>
                    </Stack>
                </div>
                    <CreateTask onUpdate={getUserData} user={user} addTask={addTask}/>
                    <Today user={user} taskCount={tasks}/>
                    <Container user={user} type={"ThisWeek"} taskCount={tasks}/>
                    <Container user={user} type={"Later"} taskCount={tasks}/>
            </>):(null)}
        </>
    )
}


export default Home