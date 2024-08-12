import toast from 'react-hot-toast';

const BASE_URL = '';


export const getUser = async () => {
    const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/user/get`, {
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

export const changeName = async (user, newName) => {
    const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('No token found');
                return;
            }
        
            try {
                const dToIn = {
                    email: user.email,
                    newName: newName
                }
                const response = await fetch(`${BASE_URL}/user/changeName`, {
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

export const changePassword = async (user, oldPassword, newPassword) => {
    const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('No token found');
                return;
            }                           
        
            try {
                const dToIn = {
                    email: user.email,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }
                const response = await fetch(`${BASE_URL}/auth/changePassword`, {
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

export const changeLanguage = async (user, lang) => {
    const token = localStorage.getItem('token');
        
            if (!token) {
                console.error('No token found');
                return;
            }
        
            try {
                const dToIn = {
                    email: user.email,
                    newLanguage: lang
                }
                const response = await fetch(`${BASE_URL}/user/changeLanguage`, {
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