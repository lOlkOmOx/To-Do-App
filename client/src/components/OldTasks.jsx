import React, { useState} from "react"
import { Button, Modal, Card, Table, Stack, OverlayTrigger, Tooltip, } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiExclamationThick, mdiTrashCanOutline, mdiCheckOutline, mdiCalendarToday, mdiInformationOutline } from '@mdi/js';
import moment from "moment"
import toast, { Toaster } from 'react-hot-toast';


function OldTask(props) {

    //setSolved, setForToday, delete
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const rescheduleTask = async (id) => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                _id: id,
                date: new Date
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
            toast.success("Task rescheduled");
            const data = await response.json();
            props.onUpdate()
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };



    function formatDate(date) {
        return moment(date).format('D. M. YYYY');
      }

    return (
        <div className="OldTasks">
            <Card style={{ width: '18rem', height: '100%' }} className="dangerCard" >
                <Card.Body>
                    <Card.Title>Warning</Card.Title>
                    <Card.Text>
                        <Icon path={mdiExclamationThick} size={4} color={"darkred"}/>
                        <p>Old uncompleted tasks found!</p>
                    </Card.Text>
                    <Card.Footer>
                    <Button variant="danger" onClick={handleShow}>Check old tasks</Button>
                    </Card.Footer>
                </Card.Body>
            </Card> 


            <>
                <Modal show={show} onHide={handleClose} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Old tasks</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {props.oldTasks.length !== 0 ? (
                        <Table striped responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Priority</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.oldTasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>{task.name}</td>
                                        <td>
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">{task.description}</Tooltip>}>
                                                <Icon path={mdiInformationOutline} size={0.8} />
                                            </OverlayTrigger>
                                        </td>
                                        <td>{formatDate(task.date)}</td>
                                        <td>{task.duration}</td>
                                        <td>{task.priority}</td>
                                        <td>
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">Set for today</Tooltip>}>
                                                <Button variant="primary" onClick={() => rescheduleTask(task._id)}>
                                                    <Icon path={mdiCalendarToday} size={1} />
                                                </Button>
                                            </OverlayTrigger>
                                            <Button variant="danger" onClick={() => {props.setTaskId(task._id); props.onDelete()}}>
                                                <Icon path={mdiTrashCanOutline} size={1} />
                                            </Button>
                                            <Button variant="success" onClick={() => props.onTaskSolve(task._id)}>
                                                <Icon path={mdiCheckOutline} size={1} />
                                            </Button>
                                            
                                        </td>
                                </tr>
                                ))}
                            </tbody>
                    </Table>
                    ):(
                        <>
                            <Icon path={mdiInformationOutline} size={4} />
                                All past tasks done
                                You can close this window
                        </>
                    )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShow}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </div>
    )
}

export default OldTask