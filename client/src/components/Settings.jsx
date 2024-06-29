import React, { useState } from "react"
import { Button, Stack, Modal, Form, ButtonGroup } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiContentSaveOutline } from '@mdi/js';
import toast, { Toaster } from 'react-hot-toast';

function Settings(props) {
        //change name
        const [newName, setNewName] = useState("")

        const handleNewName = async () => {
            const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('No token found');
                return;
            }
        
            try {
                const dToIn = {
                    email: props.user.email,
                    newName: newName
                }
                const response = await fetch('http://localhost:8000/user/changeName', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dToIn)
                })
        
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(errorData.message);
                    throw new Error('Network response was not ok');
                }
                toast.success("Name changed");
                const data = await response.json();
                props.onClose()
                props.onUpdate()
                return data;
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
    
        //changePassword
        const [oldPassword, setOldPassword] = useState("")
        const [newPassword, setNewPassword] = useState("")
        const [repeatPassword, setRepeatPassword] = useState(null)
    
        const handleNewPassword = async () => {
            const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('No token found');
                return;
            }
        
            try {
                const dToIn = {
                    email: props.user.email,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }
                const response = await fetch('http://localhost:8000/auth/changePassword', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dToIn)
                })
        
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(errorData.message);
                    throw new Error('Network response was not ok');
                }
                toast.success("Password changed");
                const data = await response.json();
                props.onClose()
                props.onUpdate()
                return data;
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
    
        //change language
        const [language, setLanguage] = useState("en")
    
        const handleLanguage = async (lang) => {
            const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('No token found');
                return;
            }
    
            setLanguage(lang)
        
            try {
                const dToIn = {
                    email: props.user.email,
                    newLanguage: lang
                }
                const response = await fetch('http://localhost:8000/user/changeLanguage', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dToIn)
                })
        
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(errorData.message);
                    throw new Error('Network response was not ok');
                }
                toast.success("Language changed");
                const data = await response.json();
                props.onClose()
                props.onUpdate()
                return data;
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
    return(
        <div>
            <Modal show={props.show} onHide={() => props.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Enter new name" autoComplete="off" onChange={(e) => setNewName(e.target.value)}/>
                    <Stack direction="horizontal">
                        <Button variant="success" className="ms-auto" onClick={handleNewName} disabled={newName.trim().length < 4 || newName.trim().length > 20}>
                            <Icon path={mdiContentSaveOutline} size={0.9} />
                        </Button>
                    </Stack>
                </Modal.Body>
                <Modal.Body>
                    <Form>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Old password" onChange={(e) => setOldPassword(e.target.value)}/>
                    <Form.Control type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)}/>
                    <Form.Control type="password" placeholder="Repeat password" onChange={(e) => setRepeatPassword(e.target.value)}/>
                    </Form>
                    <Stack direction="horizontal">
                        <Button variant="success" className="ms-auto" onClick={handleNewPassword} disabled={newPassword!==repeatPassword}>
                            <Icon path={mdiContentSaveOutline} size={0.9} />
                        </Button>
                    </Stack>
                </Modal.Body>
                <Modal.Body>
                    <Form.Label>Language</Form.Label>
                    <br></br>
                    <ButtonGroup style={{ width: '100%' }}>
                        <Button variant={language === "en" ? ("success") : ("outline-secondary")} onClick={() => handleLanguage("en")}>EN</Button>
                        <Button variant={language === "de" ? ("success") : ("outline-secondary")} onClick={() => handleLanguage("de")}>DE</Button>
                        <Button variant={language === "cz" ? ("success") : ("outline-secondary")} onClick={() => handleLanguage("cz")}>CZ</Button>
                    </ButtonGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.onClose()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Settings