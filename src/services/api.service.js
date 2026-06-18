// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)
/**
 * Servicio para realizar peticiones a la API
 */
export const apiService = {
  /**
   * Obtiene el token de autenticación del localStorage
   * @returns {string|null} Token de autenticación
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Realiza una petición GET a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @returns {Promise} Promesa con la respuesta
   */
  async get(endpoint) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error en petición GET a ${endpoint}`);
    }

    return response.json();
  },

  /**
   * Realiza una petición POST a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @param {object} data - Datos a enviar en el cuerpo de la petición
   * @returns {Promise} Promesa con la respuesta
   */
  async post(endpoint, data) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Lanza un objeto de error con status y data
      const error = new Error(responseData.message || `Error ${response.status} en ${endpoint}`);
      error.status = response.status;
      error.data = responseData;
      throw error;
    }

    return responseData;
  },

  /**
   * Realiza una petición PUT a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @param {object} data - Datos a enviar en el cuerpo de la petición
   * @returns {Promise} Promesa con la respuesta
   */
  async put(endpoint, data) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error en petición PUT a ${endpoint}`);
    }

    return response.json();
  },

  /**
   * Realiza una petición DELETE a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @returns {Promise} Promesa con la respuesta
   */
  async delete(endpoint) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error en petición DELETE a ${endpoint}`);
    }

    return response.json();
  },

  /**
   * Realiza una petición PATCH a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @param {object} data - Datos a enviar en el cuerpo de la petición
   * @returns {Promise} Promesa con la respuesta
   */
  async patch(endpoint, data) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error en petición PATCH a ${endpoint}`);
    }

    return response.json();
  }


};

