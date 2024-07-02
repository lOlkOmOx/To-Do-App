import React, { useState} from "react"
import '../css/oldTasks.css';
import { Button, Modal, Card, Table,  OverlayTrigger, Tooltip } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiExclamationThick, mdiTrashCanOutline, mdiCheckOutline, mdiCalendarToday, mdiInformationOutline } from '@mdi/js';
import moment from "moment"
import toast from 'react-hot-toast';
import { rescheduleTask } from "../api/task";
import { useTranslation } from './Translation'


function OldTask(props) {
    const { t } = useTranslation()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleRescheduleTask = async (id) => {
        try {
            await rescheduleTask(id);
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            props.onUpdate()
            toast.success(t.task_rescheduled);
        }
    }

    function formatDate(date) {
        return moment(date).format('D. M. YYYY')
      }

    return (
        <div className="OldTasks">
            <Card style={{ width: '18rem', height: '100%' }} className="dangerCard" >
                <Card.Body>
                    <Card.Title>{t.warning}</Card.Title>
                    <Card.Text>
                        <Icon path={mdiExclamationThick} size={4} color={"darkred"}/>
                        <p>{t.old_tasks_found}</p>
                        <Button variant="danger" onClick={handleShow}>{t.check_old_tasks}</Button>
                    </Card.Text>
                </Card.Body>
            </Card> 
                <Modal show={show} onHide={handleClose} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{t.old_tasks}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {props.oldTasks.length !== 0 ? (
                        <Table responsive size="sm" className="Table">
                            <thead>
                                <tr>
                                    <th>{t.task_name}</th>
                                    <th>{t.description}</th>
                                    <th>{t.date}</th>
                                    <th>{t.duration}</th>
                                    <th>{t.priority}</th>
                                    <th></th>  
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
                                        <td>{task.duration} {t.minutes}</td>
                                        <td>{task.priority}</td>
                                        <td className="Actions">
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">{t.set_for_today}</Tooltip>}>
                                                <Button variant="primary" onClick={() => handleRescheduleTask(task._id)}>
                                                    <Icon path={mdiCalendarToday} size={0.8} />
                                                </Button>
                                            </OverlayTrigger>
                                            <Button variant="danger" className="middleButton" onClick={() => {props.onDelete(task._id); props.onUpdate()}}>
                                                <Icon path={mdiTrashCanOutline} size={0.8} />
                                            </Button>
                                            <Button variant="success" onClick={() => {props.onTaskSolve(task._id); props.onUpdate()}}>
                                                <Icon path={mdiCheckOutline} size={0.8} />
                                            </Button>
                                            
                                        </td>
                                </tr>
                                ))}
                            </tbody>
                    </Table>
                    ):(null)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {t.close}
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default OldTask