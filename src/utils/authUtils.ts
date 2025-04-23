import { User } from '../types';
import axios from 'axios';

// Simulate Google OAuth authentication
export const authenticateWithGoogle = async (): Promise<User> => {
  const response = await axios.get(
    'https://gmc-report-engine-backend-production.up.railway.app'
  );

  window.open(response.data.authUrl);
  const user: User = {
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    imageUrl:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  };

  localStorage.setItem('user', JSON.stringify(user));

  // return new Promise((resolve) => {

  //   setTimeout(() => {
  //     // const user: User = {
  //     //   id: 'user123',
  //     //   name: 'John Doe',
  //     //   email: 'john.doe@example.com',
  //     //   imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  //     // };

  //     localStorage.setItem('user', JSON.stringify(user));

  //     resolve(user);
  //   }, 1500);
  // });
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
