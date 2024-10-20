// src/services/supportService.js
export const loginSupport = async (credentials) => {
    try {
        const response = await fetch('http://localhost:3001/api/support/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the token in localStorage
            return data;
        } else {
            const errorData = await response.json();
            console.error('Error de inicio de sesión:', errorData);
            throw new Error('Error de inicio de sesión');
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        throw error;
    }
};

export const logoutSupport = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect to login page after logout
};

export const getSupportToken = () => {
    return localStorage.getItem('token');
};