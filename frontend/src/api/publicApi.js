const API_BASE_URL = process.env.REACT_APP_API_URL;

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || "API Error");
  }
  return data;
}

const publicApi = {
  // Login
  login: async ({ email, password }) => {
    return handleResponse(//“Je vais envoyer une requête au backend, puis je traite la réponse avec handleResponse”.
      await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        
      })
    );
  },

  // Register
  register: async ({ firstName, lastName, email, password, passwordConfirmation, role }) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, password, passwordConfirmation,
          role
        }),
      })
    );
  },


  // Activate account
  activateAccount: async (token) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/activate/${token}`, { method: "GET" })
    );
  },

  // Forgot password
  forgotPassword: async (email) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    );
  },

  // Reset password
  resetPassword: async (token, password, passwordConfirmation) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, passwordConfirmation }),
      })
    );
  },

  // Verify JWT token
  verifyToken: async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get current logged-in user
  getCurrentUser: async (token) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  // Logout
  logout: async (token) => {
    return true;
  },

  // Get Products (Coffees)
  getProducts: async () => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/home`)
    );
  },

  // Get Coffee Details
  getProductDetails: async (id) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/coffees/${id}`)
    );
  },

  // Get Coffees
  getCoffees: async () => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/coffees`)
    );
  },

  // Get Coffee by ID
  getCoffeeById: async (id) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/coffees/${id}`)
    );
  },

  // Get Machines
  getMachines: async () => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/machines`)
    );
  },

  // Get Machine Details by ID
  getMachineById: async (id) => {
    return handleResponse(
      await fetch(`${API_BASE_URL}/machines/${id}`)
    );
  }
};

export default publicApi;
