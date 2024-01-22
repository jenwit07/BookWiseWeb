import axios from "axios";
import { toJS } from "mobx";
// import {encrypt} from './pef1'
// import {encrypt as rsa_encrypt} from './pef2'
import { encrypt as pef2_encrypt, decrypt as pef2_decrypt } from "./pef2";
import stores from "./store/mobx/stores";

const apiClient = (config) => {
  const { redirect, ...axiosConfig } = config;
  axiosConfig.withCredentials = true;
  if (!redirect) {
    axiosConfig.transformRequest = [
      (data, headers) => {
        try {
          console.log(config.baseURL)
          // Console.log('API',stores.authStore.session);
          if (stores.authStore.session.publicKey && data) {
            // Console.log('transformRequest data', data);
            return JSON.parse(
              pef2_encrypt(
                stores.authStore.session.publicKey,
                JSON.stringify(data)
              )
            );
          }
        } catch (e) {
          console.error(e);
        }
        return data;
      },
      ...axios.defaults.transformRequest,
    ];
  }
  const client = axios.create(axiosConfig);

  client.interceptors.request.use(
    async (config) => {
      if (redirect === true) {
        const body = JSON.parse(JSON.stringify(config));
        delete body.transformRequest;
        delete body.transformResponse;
        config.baseURL = process.env.SERVER_API;
        config.url = "/api";
        config.method = "post";
        config.data = pef2_encrypt(
          stores.authStore.session.publicKey,
          JSON.stringify(body)
        );
        config.params = null;
      }
      return config;
    },
    (error) => Promise.resolve({ error })
  );

  client.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => {
      // Session timeout or wrong RSA key pair
      if (error.response.status === 440 || error.response.status === 405) {
        // Reload browser window
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const serverApi = () => {
  return apiClient({
    baseURL: process.env.SERVER_API,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const anakinAPI = () => {
  return apiClient({
    redirect: true,
    baseURL: process.env.ANAKIN_API,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const authAPI = () =>
  apiClient({
    redirect: true,
    baseURL: process.env.AUTH_API,
    timeout: 120000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
