import { useRef } from 'react'
import axios from 'axios'

const useApi = () => {
  const api = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_HOST,
    }),
  )

  // useEffect(() => {
  //   const currentAPI = api.current;

  //   // const requestInterceptorId = currentAPI.interceptors.request.use(async (config) => {
  //   //   let token;
  //   //   config.headers.authorization = `Bearer ${token}`;
  //   //   config.cancelToken = axios.CancelToken.source().token;
  //   //   return config;
  //   // });

  //   // const responseInterceptorId = currentAPI.interceptors.response.use(
  //   //   async (successfulReq) => {
  //   //     return successfulReq;
  //   //   },
  //   //   async (error) => {
  //   //     if (error.config && error.response && error.response.status === 401) {
  //   //       await loginWithRedirect({
  //   //         redirect_uri: window.location.origin,
  //   //       });
  //   //     }

  //   //     if (error && error.error_description === "Please verify your email before logging in.") {
  //   //       return (
  //   //         <div>
  //   //           Please verify your email then <button onClick={loginWithRedirect}>Login</button>
  //   //         </div>
  //   //       );
  //   //     }

  //   //     if (error.config && error.response && error.response.status === 403) {
  //   //       logout();
  //   //     }

  //   //     return Promise.reject(error);
  //   //   }
  //   // );

  //   return () => {
  //     currentAPI.interceptors.request.eject(requestInterceptorId);
  //     currentAPI.interceptors.response.eject(responseInterceptorId);
  //   };
  // });

  return api.current
}

export default useApi
