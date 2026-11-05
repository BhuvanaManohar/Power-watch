import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Authenticated fetch wrapper for FastAPI backend endpoints.
 * Automatically attaches `Authorization: Bearer <access_token>` from active Supabase session.
 */
export async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData?.detail) {
        errorDetail = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // Ignore JSON parse errors for non-JSON error responses
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Profile API services calling FastAPI `/api/profile/me` endpoints.
 */
export const profileApi = {
  /**
   * Fetch current user profile via GET /api/profile/me
   */
  async getMyProfile() {
    return apiRequest('/api/profile/me', { method: 'GET' });
  },

  /**
   * Update current user profile attributes via PATCH /api/profile/me
   */
  async updateMyProfile(payload) {
    return apiRequest('/api/profile/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

/**
 * Public Incidents API services calling FastAPI `/api/incidents` endpoints.
 */
export const incidentsApi = {
  /**
   * Fetch all active/logged incidents via GET /api/incidents
   */
  async getIncidents() {
    return apiRequest('/api/incidents', { method: 'GET' });
  },

  /**
   * Fetch a single incident by its UUID via GET /api/incidents/:id
   */
  async getIncidentById(id) {
    return apiRequest(`/api/incidents/${id}`, { method: 'GET' });
  },
};

/**
 * Public Locations API services calling FastAPI `/api/locations` endpoints.
 */
export const locationsApi = {
  /**
   * Fetch all registered municipal locations via GET /api/locations
   */
  async getLocations() {
    return apiRequest('/api/locations', { method: 'GET' });
  },

  /**
   * Fetch a single location by its UUID via GET /api/locations/:id
   */
  async getLocationById(id) {
    return apiRequest(`/api/locations/${id}`, { method: 'GET' });
  },
};
