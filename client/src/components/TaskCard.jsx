import React, { useState, useEffect } from "react"
import { Card, Button, Stack } from "react-bootstrap"
import '../css/TaskCard.css';
import Icon from '@mdi/react';
import { mdiCheckOutline, mdiStarOutline, mdiStar } from '@mdi/js';
import toast from 'react-hot-toast';
import moment from "moment"
import ConfirmationModal from "./ConfirmationModal";
import EditingTask from "./EditingTask";
import { handleSolvingTask } from "../api/task"
import { useTranslation } from './Translation'

function TaskCard(props) {
    const { t } = useTranslation()
    function formatDate(date) {
        return moment(date).format('D. M. YYYY');
      }

        const solveTask = async (task) => {
            try {
                await handleSolvingTask(task);
            } catch (error) {
                toast.error(t.server_error);
            } finally {
                props.onUpdate()
                toast.success(t.task_solved)
            }
        };

        function durationColor(time) {
            if(time <= 29) return "green"
            if(time <= 69) return "orange"
            if(time >= 70) return "red"
            else return "green"
        }

        const renderStars = (priority) => {
            let stars = [];
            for (let i = 1; i <= 5; i++) {
              stars.push(
                <Icon
                  key={i}
                  path={i <= priority ? mdiStar : mdiStarOutline}
                  size={0.8}
                  color={i <= priority ? "gold" : "gray"}
                />
              );
            }
            return stars;
          };


    return(
        <Card id={props.task._id} style={{ width: '18rem' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Card.Title style={{borderBottom: "solid lightgray 1px"}}><h2>{props.task.name}</h2></Card.Title> 
                    <Card.Text>
                        <p>{props.task.description}</p>
                        <p>{formatDate(props.task.date)}</p>
                        <p>{renderStars(props.task.priority)}</p>
                        <p style={{color: durationColor(props.task.duration)}}>
                            {props.task.duration} {t.minutes}
                        </p>
                    </Card.Text>
                    <Stack direction="horizontal" style={{ justifyContent: 'space-evenly'}}>
                    <Button variant="success" className="TaskButton" onClick={() => solveTask(props.task)}>
                        <Icon path={mdiCheckOutline} size={1} />
                    </Button>
                    <EditingTask task={props.task} onUpdate={props.onUpdate}/>
                    <ConfirmationModal onSuccess={props.onUpdate} task={props.task}/>
                    </Stack>
            </Card.Body>
            
        </Card>
    )
}

export default TaskCard