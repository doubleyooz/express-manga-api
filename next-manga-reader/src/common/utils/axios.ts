import { cookies } from 'next/headers';
import { API_URL } from '../constants/api';
import axios from 'axios';

export const getHeaders = () => ({
  Cookie: cookies().toString()
});

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

export const get = async <T>(
  path: string,
  params?: object
): Promise<{ message: string; data: T }> => {
  const headers = getHeaders();

  try {
    const response = await axios.get(path, { headers, params });
    return (await response.data) as { message: string; data: T };
  } catch (error) {
    throw new Error(`Failed to parse response from ${path}: ${error}`);
  }
};

export const post = async <T>(
  path: string,
  data?: object
): Promise<{ message: string; data: T }> => {
  const headers = getHeaders();

  try {
    const response = await axios.post(path, { data }, { headers });
    return (await response.data) as { message: string; data: T };
  } catch (error) {
    throw new Error(`Failed to parse response from ${path}: ${error}`);
  }
};
