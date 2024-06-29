import React, { useState, useEffect } from "react"
import '../css/Today.css';
import { Button, Stack, Modal, Form, ButtonGroup, Card, ProgressBar, Container, Row } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiExclamationThick, mdiClockTimeEightOutline, mdiCheckOutline, mdiFileEditOutline, mdiTrashCanOutline  } from '@mdi/js';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from "./ConfirmationModal";
import EditingTask from "./EditingTask";
import OldTask from "./OldTasks"

function Today(props) {

    const [tasks, setTasks] = useState()
    const [oldTasks, setOldTasks] = useState([])

    const getTasks = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/task/getToday?user=${props.user._id}&sort=prior_1-5`, {
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
            setTasks(data.tasks);
            setOldTasks(data.oldTasks)
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        getTasks();
    }, [props.taskCount]);

    const [selectedTaskId, setSelectedTaskId] = useState("")

    const deleteTask = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                task_id: selectedTaskId
            }
            const response = await fetch('http://localhost:8000/task/delete', {
                method: 'DELETE',
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
            toast.success("Task deleted");
            const data = await response.json();
            handleClose()
            getTasks()
            props.onUpdate()
            
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleSolvingTask = async (id) => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                _id: id,
                newState: true
            }
            const response = await fetch('http://localhost:8000/task/changeState', {
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
            toast.success("Task solved and moved to archive");
            const data = await response.json();
            getTasks()
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    //Confim modal
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    //Edit modal
    const [showEditingModal, setShowEditingModal] = useState(false)
    const handleCloseEditingModal = () => setShowEditingModal(false)
    const handleShowEditingModal = () => setShowEditingModal(true)
    const [taskToEdit, setTaskToEdit] = useState('')

    return (
        <div className="Today">
        
            <Stack direction="horizontal" className="Stack">
                <h1>Today</h1>
                <Button variant="secondary" className="ms-auto">Filtr</Button>
            </Stack>
            <ProgressBar animated variant="success" now={60} label={"60% completed today"} className="ProgressBar"/>
            <Stack direction="horizontal" gap={1} className="flex-wrap CardContainer">
            
{/*TODO přidat podmínku na zobrazení, pokud je nějaký item starý*/}
        {oldTasks.length !== 0 ? (<>
            <OldTask oldTasks={oldTasks} onTaskSolve={handleSolvingTask} setTaskId={setSelectedTaskId} onDelete={deleteTask} onUpdate={getTasks}/>
        </>):(<></>)}
            {tasks ? (<>
                {tasks.map((task) => (
                    <Card id="task.id" style={{ width: '18rem' }} className="taskCard">
                        <Card.Body>
                            <Card.Title><h2>{task.name}</h2></Card.Title>
                            <Card.Text>
                                <p>{task.description}</p>
                                <p>Priorita: {task.priority}</p>
                                <p><Icon path={mdiClockTimeEightOutline} size={1} /> {task.duration} minutes</p>
                            </Card.Text>

                            <Button variant="success" className="TaskButton" onClick={() => handleSolvingTask(task._id)}>
                                <Icon path={mdiCheckOutline} size={1} />
                            </Button>
                            <Button variant="secondary" className="TaskButton TaskButtonMiddle" onClick={() => {setTaskToEdit(task); handleShowEditingModal()}}>
                                <Icon path={mdiFileEditOutline} size={1} />
                            </Button>
                            <Button variant="danger" className="TaskButton" onClick={() => {setSelectedTaskId(task._id); handleShow()}}>
                                <Icon path={mdiTrashCanOutline} size={1} />
                            </Button>

                        </Card.Body>
                    </Card>
                ))}
            </>):(<>
                No tasks found
            </>)}
            </Stack>
            <ConfirmationModal show={show} onSuccess={deleteTask} onCancel={handleClose}/>
            <EditingTask task={taskToEdit} onUpdate={getTasks} show={showEditingModal} onClose={handleCloseEditingModal}/>
        </div>
    )
}

export default Today