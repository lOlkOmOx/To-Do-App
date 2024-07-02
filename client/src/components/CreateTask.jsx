import React, { useState } from "react"
import '../css/CreateTask.css';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiPlusThick } from '@mdi/js';
import toast from 'react-hot-toast';
import { createTask } from "../api/task";
import { useTranslation } from './Translation'

function CreateTask(props) {
    const { t } = useTranslation()
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

    const handleCreateTask = async () => {
        try {
            await createTask(props.user, name, description, date, duration, priority);
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            handleClose()
            props.onUpdate()
            props.addTask()
        }
    }

    return(
        <>
            <Button className="floating-button" variant="success" onClick={handleShow}>
                <Icon path={mdiPlusThick} size={8} />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t.new_task}</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                    <Form>
                        <FloatingLabel label={t.task_name} className="formField">
                            <Form.Control
                                type="text"
                                placeholder={t.task_name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t.description} className="formField">
                            <Form.Control
                                type="text"
                                placeholder={t.description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t.date} className="formField">
                            <Form.Control
                                type="date"
                                placeholder={t.date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t.duration_minutes} className="formField">
                            <Form.Control
                                type="number"
                                placeholder={t.duration_minutes}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </FloatingLabel>
                        <div className="radio">
                            <Form.Label>{t.priority} {t.five_high}</Form.Label>
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
                    <Button variant="success" type="submit" onClick={handleCreateTask}>{t.create}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CreateTask