import React, {useState} from "react"
import { Button, Modal } from "react-bootstrap"
import Icon from '@mdi/react';
import {mdiTrashCanOutline} from '@mdi/js';
import { deleteTask } from "../api/task";
import toast from 'react-hot-toast';
import { useTranslation } from './Translation'

function ConfirmationModal(props) {
  const { t } = useTranslation()

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleDeleteTask = async (id) => {
    try {
        await deleteTask(id);
    } catch (error) {
        toast.error(t.server_error);
    } finally {
        props.onSuccess()
        handleClose()
        toast.success(t.task_deleted);
    }
};

    return(
        <>
          <Button variant="danger" className="TaskButton" onClick={handleShow}>
            <Icon path={mdiTrashCanOutline} size={1} />
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{t.confirmation}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t.confirmation_text}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>{t.cancel}</Button>
              <Button variant="danger" onClick={() => {handleDeleteTask(props.task._id)}}>{t.delete}</Button>
            </Modal.Footer>
          </Modal>
        </>
    )
}

export default ConfirmationModal