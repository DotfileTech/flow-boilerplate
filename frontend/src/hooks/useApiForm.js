import { useRef } from 'react';
import axios from 'axios';

const useApi = () => {
  const api = useRef(
    axios.create({
      baseURL: process.env.CONTENT_BACKEND,
    })
  );

  return api.current;
};

export default useApi;
