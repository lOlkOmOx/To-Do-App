import React, { useState, useEffect } from "react"
import '../css/Today.css';
import { Stack, ProgressBar, Dropdown } from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiSort, mdiInformationOutline, mdiCheckCircleOutline } from '@mdi/js';
import toast from 'react-hot-toast';
import OldTask from "./OldTasks"
import TodayHistory from "./TodayHistory";
import { handleSolvingTask, deleteTask, getToday } from "../api/task"
import TaskCard from "./TaskCard";
import { useTranslation } from './Translation'

function Today(props) {

    const { t } = useTranslation()
    const [tasks, setTasks] = useState([])
    const [oldTasks, setOldTasks] = useState([])
    const [solvedTasks, setSolvedTasks] = useState([])
    const [progressBar, setProgressBar] = useState(0)
    const [solvedCount, setSolvedCount] = useState(0)
    const [taskCount, setTaskCount] = useState(0)
    const [sort, setSort] = useState("prior_1-5")

    const getTasks = async (sort) => {
        try {
            const data = await getToday(props.user, sort)
            if (data) {
                setTasks(data.tasks);
                setOldTasks(data.oldTasks)
                setSolvedTasks(data.solvedTasks)
                setProgressBar(data.solvedPercentage)
                setSolvedCount(data.solvedCount)
                setTaskCount(data.taskCount)
            }
        } catch (error) {
            console.log(error)
        } 
    }

    useEffect(() => {
        getTasks(sort)
    }, [props.taskCount, sort])

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
        } catch (error) {
            toast.error(t.server_error)
        } finally {
            getTasks()
            toast.success(t.task_deleted);
        }
    }

    return (
        <div className="Today">
            <Stack direction="horizontal" className="Stack">
                <h1>{t.today}</h1>
                <div className="ms-auto">
                    <Stack direction="horizontal">
                        {solvedCount !== 0 ? (
                            <TodayHistory tasks={solvedTasks} onUpdate={() => getTasks(sort)}/>
                        ):(null)}
                        <Dropdown className="ms-auto">
                            <Dropdown.Toggle variant="warning">
                                <Icon path={mdiSort} size={1.3} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => {setSort("prior_1-5")}} active={sort === "prior_1-5"}> {t.priority} 1-5 </Dropdown.Item>
                                <Dropdown.Item onClick={() => {setSort("prior_5-1")}} active={sort === "prior_5-1"}> {t.priority} 5-1</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setSort("mostTime")}} active={sort === "mostTime"}>{t.highest_time_first}</Dropdown.Item>
                                <Dropdown.Item onClick={() => {setSort("lowestTime")}} active={sort === "lowestTime"}>{t.lowest_time_first}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Stack>
                </div>
            </Stack>      
            {solvedCount !== 0 ? (
                <ProgressBar variant="success" now={progressBar} label={progressBar + t.completed_today + " ("+ solvedCount + t.from + (solvedCount + taskCount) + ")"} className="ProgressBar"/>
            ):(null)}

            {(oldTasks.length === 0 && tasks.length === 0 && solvedCount === 0) ? (<>
                <Icon path={mdiInformationOutline} size={4} style={{marginTop: "20px"}}/>
                <p>{t.no_active_tasks}</p>
            </>):(null) }

            {(tasks.length === 0 && solvedCount !== 0) ? (<>
                <Icon path={mdiCheckCircleOutline} size={4} style={{marginTop: "20px"}} color={"darkgreen"}/>
                <p>{t.all_tasks_done}</p>
            </>):(null) }  
            <Stack direction="horizontal" gap={2} className="flex-wrap CardContainer">

                {oldTasks.length !== 0 ? (<>
                    <OldTask oldTasks={oldTasks} onTaskSolve={handleSolvingTask} onDelete={handleDeleteTask} onUpdate={() => getTasks(sort)}/>
                </>):(null)}

                {tasks ? (<>
                    {tasks.map((task) => (
                        <TaskCard task={task} onUpdate={() => getTasks(sort)}/>
                    ))}
                </>):(null)}
            </Stack> 
        </div>
    )
}

export default Today