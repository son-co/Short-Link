import { handleApiWithOutToken } from '@/api';
import { API_URL, JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { message } from 'antd';

const API_BASE_URL = API_URL + '/api/v1/admin';

export class AuthService {
  static async authenticate(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  static async createShortLink(data) {
    try {
      const token = getCookie(JWT);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/short-link/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create short link: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create short link error:', error);
      throw error;
    }
  }
}
