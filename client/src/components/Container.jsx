import React, { useState, useEffect } from "react"
import { Stack, Accordion } from "react-bootstrap"
import '../css/Container.css';
import TaskCard from "./TaskCard";
import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';
import { getTaskList } from "../api/task";
import { useTranslation } from './Translation'

function Container(props) {

    const { t } = useTranslation()
    const [tasks, setTasks] = useState([])

    const getTasks = async () => {
        try {
            const data = await getTaskList(props.user, props.type)
            if (data) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.log(error)
        } 
    }

    useEffect(() => {
        getTasks();
    }, [props.taskCount]);

    return(
        <Accordion className="Container">
            <Accordion.Item >
                <Accordion.Header className="Stack">
                    <Stack  direction="horizontal">
                        {props.type === "ThisWeek" ? (<h1>{t.this_week}</h1>):(<h1>{t.later}</h1>)}
                    </Stack> 
                </Accordion.Header>
                <Accordion.Body>
                     {tasks.length === 0 ? (<>
                            <Icon path={mdiInformationOutline} size={4} style={{marginTop: "20px"}}/>
                            <p>{t.no_active_tasks}</p>
                        </>):(<>
                            <Stack direction="horizontal" gap={2} className="flex-wrap OtherCards CardContainer">
                                {tasks.map((task) => (
                                    <TaskCard task={task} onUpdate={getTasks}/>
                                ))}
                            </Stack>
                        </>)}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default Container