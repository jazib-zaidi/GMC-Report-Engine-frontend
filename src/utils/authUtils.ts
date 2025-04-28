import { User } from '../types';
import axios from 'axios';

// Simulate Google OAuth authentication
export const authenticateWithGoogle = async (): Promise<User> => {
  const url = `${import.meta.env.VITE_API_URL}`;
  const response = await axios.get(url);

  window.location.href = response.data.authUrl;
  const user: User = {
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    imageUrl:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  };

  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('user');
};
