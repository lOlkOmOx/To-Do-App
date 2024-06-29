import React, { useState } from "react"
import { Button, Modal } from "react-bootstrap"

function ConfirmationModal(props) {
    return(
        <>
        <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want really to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={props.onSuccess}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export default ConfirmationModal