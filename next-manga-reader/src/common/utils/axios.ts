import { cookies } from "next/headers";
import { API_URL } from "../constants/api";
import axios from "axios";

export const getHeaders = () => ({
  Cookie: cookies().toString(),
});

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

export const get = async <T>(path: string, params?: object): Promise<T> => {
  const headers = getHeaders();

  const response = await axios.get(path, { headers, params });

  try {
    return (await response.data) as T;
  } catch (error) {
    throw new Error(`Failed to parse response from ${path}: ${error}`);
  }
};
