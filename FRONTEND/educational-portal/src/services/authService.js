// src/services/authService.js
export const login = async (credentials) => {
    try {
        const response = await fetch('http://localhost:3001/api/institucion/login', {
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
            throw new Error('Error de inicio de sesión');
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect to login page after logout
};

export const getToken = () => {
    return localStorage.getItem('token');
};
