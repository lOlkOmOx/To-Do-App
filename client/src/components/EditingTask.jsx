import React, { useState, useEffect } from "react"
import '../css/CreateTask.css';
import { Button, Stack, Modal, Form, FloatingLabel } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiPlusThick } from '@mdi/js';
import toast, { Toaster } from 'react-hot-toast';

function EditingTask(props) {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [duration, setDuration] = useState(60)
    const [priority, setPriority] = useState(1)

    useEffect(() => {
        if (props.task) {
            setName(props.task.name || "");
            setDescription(props.task.description || "");
            setDate(props.task.date ? new Date(props.task.date).toISOString().split('T')[0] : "");
            setDuration(props.task.duration || "");
            setPriority(props.task.priority || 1);
        }
    }, [props.task, props.show]);

    const handleEditTask = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                _id: props.task._id,
                name: name,
                description: description,
                date: date,
                duration: duration,
                priority: priority
            }
            const response = await fetch('http://localhost:8000/task/edit', {
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
            toast.success("Task edited");
            const data = await response.json();
            props.onUpdate()
            closeModal()
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const closeModal = () => {
        setName("")
        setDescription("")
        setDate("")
        setPriority(60)
        setDuration(1)
        props.onClose()
    }

return(
    <>
    {props.task ? (<>
        <Modal show={props.show} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit task</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                <Form>
                    <FloatingLabel label="Name" className="formField">
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            value= {name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Description" className="formField">
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Date" className="formField">
                        <Form.Control
                            type="date"
                            placeholder="Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Duration (minutes)" className="formField">
                        <Form.Control
                            type="number"
                            placeholder="Duration"
                            value={duration}
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
                    <Button variant="success" type="submit" onClick={handleEditTask}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </>):(<></>)}
    </>
)
}

export default EditingTask