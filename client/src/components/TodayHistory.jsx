import React, { useState} from "react"
import { Button, Modal, Table,  OverlayTrigger, Tooltip } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiArchiveCheckOutline, mdiInformationOutline, mdiRestart } from '@mdi/js';
import toast from 'react-hot-toast';
import { handleUnsolvingTask } from "../api/task";
import { useTranslation } from './Translation'

function TodayHistory(props) {
    const { t } = useTranslation()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const unsolveTask = async (id) => {
        try {
            await handleUnsolvingTask(id);
        } catch (error) {
            toast.error(t.server_error);
        } finally {
            props.onUpdate()
            toast.success(t.task_unsolved);
        }
    };

    return(
        <div>
            <Button variant="secondary" className="ms-auto" onClick={handleShow} style={{marginRight: "5px"}}>
                    <Icon path={mdiArchiveCheckOutline} size={1.3} />
            </Button>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{t.today_solved_tasks}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped responsive>
                            <thead>
                                <tr>
                                    <th>{t.name}</th>
                                    <th>{t.description}</th>
                                    <th>{t.duration}</th>
                                    <th>{t.priority}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.tasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>{task.name}</td>
                                        <td>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>{task.description}</Tooltip>}>
                                                <Icon path={mdiInformationOutline} size={0.8} />
                                            </OverlayTrigger>
                                        </td>
                                        <td>{task.duration}</td>
                                        <td>{task.priority}</td>
                                        <td className="Actions">
                                            <Button variant="outline-danger" onClick={() => unsolveTask(task._id)}>
                                                <Icon path={mdiRestart} size={1} />
                                            </Button>
                                        </td>
                                </tr>
                                ))}
                            </tbody>
                    </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}> {t.close} </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default TodayHistory