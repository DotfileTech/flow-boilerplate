import { useRef } from 'react';
import axios from 'axios';

const useApi = () => {
  const api = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_BASE_URL_API,
    })
  );

  return api.current;
};

export default useApi;
