const API_BASE_URL = "http://localhost:5000/api/user";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "API Error");
  }
  return data;
}

const userApi = {
  // ==========================
  // DASHBOARD
  // ==========================
  getDashboardSummary: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // ==========================
  // SUBSCRIPTIONS
  // ==========================
  getActiveSubscriptions: async () => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/active`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getSubscriptionHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/history`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getSubscriptionDetails: async (id) => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  cancelSubscription: async (id) => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}/cancel`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // ==========================
  // PROFILE
  // ==========================
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (updates) => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  suspendAccount: async () => {
    const res = await fetch(`${API_BASE_URL}/profile/suspend`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  deleteAccount: async () => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

export default userApi;
