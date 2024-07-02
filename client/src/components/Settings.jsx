import React, { useState } from "react"
import '../css/Settings.css';
import { Button, Stack, Modal, Form, ButtonGroup } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiContentSaveOutline, mdiCog } from '@mdi/js';
import toast from 'react-hot-toast';
import { changeName, changePassword, changeLanguage } from "../api/user"
import { useTranslation } from './Translation'

function Settings(props) {
    const { t } = useTranslation()
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [show, setShow] = useState(false) 

    //change name
    const [newName, setNewName] = useState("")
        
    const handleChangeName = async (user, newName) => {
        try {
            await changeName(user, newName)
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            props.onUpdate()
            handleClose()
            toast.success(t.name_changed);
        }
    }
    
    //changePassword
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState(null)

    const handleNewPassword = async (user, oldPassword, newPassword) => {
        try {
            await changePassword(user, oldPassword, newPassword)
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            props.onUpdate()
            handleClose()
            toast.success(t.password_changed);
        }
    };
    
    //change language
    const handleLanguage = async (user, lang) => {
        try {
            await changeLanguage(user, lang)
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            props.onUpdate()
            handleClose()
            toast.success(t.lang_changed);
        }
    }

    function setButtonVariant(lang) {
        if (props.user.language === lang) {
            return "success"
        } else return "outline-secondary"
    }
            
    return(
        <div>
            <Button variant="light" className="button" onClick={handleShow}>
                    <Icon path={mdiCog} size={1.5} />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t.settings}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>{t.name}</Form.Label>
                    <Form.Control placeholder={t.enter_new_name} autoComplete="off" onChange={(e) => setNewName(e.target.value)}/>
                    <Stack direction="horizontal">
                        <Button variant="success" className="ms-auto saveButton" onClick={() => handleChangeName(props.user, newName)} disabled={newName.trim().length < 4 || newName.trim().length > 20}>
                            <Icon path={mdiContentSaveOutline} size={0.9} />
                        </Button>
                    </Stack>
                </Modal.Body>
                <Modal.Body>
                    <Form>
                        <Form.Label>{t.password}</Form.Label>
                        <Form.Control type="password" placeholder={t.old_password} onChange={(e) => setOldPassword(e.target.value)}/>
                        <Form.Control className="form" type="password" placeholder={t.new_password} onChange={(e) => setNewPassword(e.target.value)}/>
                        <Form.Control type="password" placeholder={t.repeat_password} onChange={(e) => setRepeatPassword(e.target.value)}/>
                    </Form>
                    <Stack direction="horizontal">
                        <Button variant="success" className="ms-auto saveButton" onClick={() => handleNewPassword(props.user, oldPassword, newPassword)} disabled={newPassword!==repeatPassword}>
                            <Icon path={mdiContentSaveOutline} size={0.9} />
                        </Button>
                    </Stack>
                </Modal.Body>
                <Modal.Body>
                    <Form.Label>{t.language}</Form.Label>
                    <ButtonGroup style={{ width: '100%' }}>
                        <Button variant={setButtonVariant("en")} onClick={() => handleLanguage(props.user, "en")}>EN</Button>
                        <Button variant={setButtonVariant("de")} onClick={() => handleLanguage(props.user, "de")}>DE</Button>
                        <Button variant={setButtonVariant("cz")} onClick={() => handleLanguage(props.user, "cz")}>CZ</Button>
                    </ButtonGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>{t.close}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Settings