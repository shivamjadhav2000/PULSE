const API_BASE_URL=process.env.REACT_APP_API_BASE_URL
const AI_API_URL=process.env.REACT_APP_API_PYTHON_URL
exports.signup = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
    }
exports.login = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log in');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
    }
exports.createcrsis=async (data,token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/crisis/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create crisis');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Error during crisis creation:', error);
        throw error;
    }
    }
exports.noOfStaffRequired=async (data) => {
    try {
        const response = await fetch(`${AI_API_URL}predict/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get staff requirements');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Error during staff requirement calculation:', error);
        throw error;
    }
}
