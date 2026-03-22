import { api } from './api';

export interface RegisterSchema {
  name: string;
  email: string;
  password: string;
}

export interface LoginSchema {
  email: string;
  password: string;
}

export const register = async (data: RegisterSchema) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginSchema) => {
  // It should return token and maybe user details
  const response = await api.post('/auth/login', data);
  return response.data;
};
