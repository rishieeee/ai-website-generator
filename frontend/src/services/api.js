import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Save a generated project to the backend database
 * @param {string} prompt - The user's original prompt
 * @param {Object} code - Generated code {html, css, js}
 * @returns {Promise<Object>} - Saved project data
 */
export const saveProject = async (prompt, code) => {
    const response = await api.post('/projects', { prompt, code });
    return response.data;
};

/**
 * Get all saved projects
 * @returns {Promise<Array>} - List of projects
 */
export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

/**
 * Get a single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>} - Project data
 */
export const getProject = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

/**
 * Delete a project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

export default api;
