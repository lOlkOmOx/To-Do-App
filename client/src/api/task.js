import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8000';

export const handleSolvingTask = async (id) => {

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
        const response = await fetch(`${BASE_URL}/task/changeState`, {
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error
    }
}

export const handleUnsolvingTask = async (id) => {

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const dToIn = {
            _id: id,
            newState: false
        }
        const response = await fetch(`${BASE_URL}/task/changeState`, {
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error
    }
}

export const deleteTask = async (id) => {

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const dToIn = {
            task_id: id
        }
        const response = await fetch(`${BASE_URL}/task/delete`, {
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
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error
    }
}

export const getToday = async (user, sort) => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/task/getToday?user=${user._id}&sort=${sort}`, {
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
            return data
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
}

export const getTaskList = async (user, type) => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/task/get${type}?user=${user._id}`, {
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
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
}

export const createTask = async (user, name, description, date, duration, priority) => {
    const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                owner_id: user._id,
                name: name,
                description: description,
                date: date || new Date(),
                duration: duration,
                priority: priority
            }
            const response = await fetch('http://localhost:8000/task/create', {
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
            toast.success("Task created");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
}

export const editTask = async (task, name, description, date, duration, priority) => {
    const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                _id: task._id,
                name: name,
                description: description,
                date: date,
                duration: duration,
                priority: priority
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
}

export const rescheduleTask = async (id) => {
    const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const dToIn = {
                _id: id,
                date: new Date()
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
}