import React, { useState } from "react"
import '../css/CreateTask.css';
import { Button, Stack, Modal, Form, FloatingLabel } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiPlusThick } from '@mdi/js';
import toast, { Toaster } from 'react-hot-toast';

function CreateTask(props) {
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false)
        setName("")
        setDescription("")
        setDate(null)
        setDuration(60)
        setPriority(1)
    }
    const handleShow = () => setShow(true)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(null)
    const [duration, setDuration] = useState(60)
    const [priority, setPriority] = useState(1)

    const handleNewTask = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                owner_id: props.user._id,
                name: name,
                description: description,
                date: date || new Date,
                duration: duration,
                priority: priority
            }
            const response = await fetch('http://localhost:8000/task/create', {
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
            toast.success("Task created");
            const data = await response.json();
            handleClose()
            props.onUpdate()
            props.addTask()
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

return(
    <>
        <Button className="floating-button" variant="success" onClick={handleShow}>
            <Icon path={mdiPlusThick} size={8} />
        </Button>
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New task</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                <Form>
                    <FloatingLabel label="Name" className="formField">
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Description" className="formField">
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Date" className="formField">
                        <Form.Control
                            type="date"
                            placeholder="Date"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Duration (minutes)" className="formField">
                        <Form.Control
                            type="number"
                            placeholder="Duration"
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </FloatingLabel>
                    <div className="radio">
                    <Form.Label>Priority 1=high</Form.Label>
                        <br/>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Form.Check
                                  key={value}
                                  type="radio"
                                  name="priority"
                                  value={value}
                                  label={value}
                                  checked={priority === value}
                                  onChange={(e) => setPriority(parseInt(e.target.value))}
                                  inline
                                />
                              ))}
                    </div>
                    
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type="submit" onClick={handleNewTask}>Create</Button>
                </Modal.Footer>
            </Modal>
    </>
)
}

export default CreateTask