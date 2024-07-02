import React, { useState, useEffect } from "react"
import '../css/CreateTask.css';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiFileEditOutline } from '@mdi/js';
import toast from 'react-hot-toast';
import { editTask } from "../api/task";
import { useTranslation } from './Translation'

function EditingTask(props) {
    const { t } = useTranslation()

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

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
    }, [props.task]);

    const handleEditTask = async () => {
        try {
            await editTask(props.task, name, description, date, duration, priority);
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            props.onUpdate()
            handleClose()
            toast.success(t.task_edited);
        }
    }

    return(
        <>
        {props.task ? (<>
            <Button variant="secondary" className="TaskButton TaskButtonMiddle" onClick={handleShow}>
                <Icon path={mdiFileEditOutline} size={1} />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t.edit_task}</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                    <Form>
                        <FloatingLabel label={t.task_name} className="formField">
                            <Form.Control
                                type="text"
                                placeholder={t.task_name}
                                value= {name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t.description} className="formField">
                            <Form.Control
                                type="text"
                                placeholder={t.description}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t.date} className="formField">
                            <Form.Control
                                type="date"
                                placeholder={t.date}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label={t.duration_minutes} className="formField">
                            <Form.Control
                                type="number"
                                placeholder={t.duration_minutes}
                                value={duration}
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
                    <Button variant="success" type="submit" onClick={handleEditTask}>{t.save_changes}</Button>
                </Modal.Footer>
            </Modal>
            </>):(<></>)}
        </>
    )
}

export default EditingTask