require("dotenv").config({ path: `./server/.env.${process.env.NODE_ENV}` });
const axios = require("axios");
const _ = require("lodash");

const API = {};
Object.keys(process.env).forEach((key) => {
  if (key.endsWith("_API")) {
    API[process.env[key]] = { secret: process.env[key + "_SECRET"] || false };
  }
});

module.exports = apiClient = async (config, req, res) => {
  let API_WHITE = JSON.parse(process.env.API_WHITE_LIST);
  let access = false;
  for (let url of API_WHITE) {
    if (config.baseURL.indexOf(url) !== -1) {
      access = true;
    }
  }

  if (access === false) {
    throw Object.create({
      response: {
        status: 403,
        data: "Permission denied",
      },
    });
  }

  const client = axios.create({
    transformRequest: [
      (data, headers) => {
        try {
          let baseURL = config.baseURL;
          for (let url of Object.keys(API)) {
            if (config.baseURL.indexOf(url) > -1) {
              baseURL = url;
              break;
            }
          }
          if (data && API[baseURL].secret) {
            data = JSON.parse(
              pef1.encrypt(JSON.stringify(data), API[config.baseURL].secret)
            );
          }
          // if (data && API[config.baseURL].secret) {
          //     data = JSON.parse(pef1.encrypt(JSON.stringify(data), API[config.baseURL].secret));
          // }
        } catch (e) {
          console.error(e);
        }
        return data;
      },
      ...axios.defaults.transformRequest,
    ],
    transformResponse: [
      (data) => {
        try {
          let body = data;
          if (_.isObject(data)) {
            body = JSON.parse(data) ? JSON.parse(data) : data;
          }
          if (body.f === "pef1") {
            data = pef1.decrypt(data, API[config.baseURL].secret);
          }
          return data;
        } catch (error) {
          console.log(error);
          return error;
        }
      },
      ...axios.defaults.transformResponse,
    ],
  });

  client.interceptors.request.use(
    (config) => {
      const JWT =
        req.session.jwt && req.session.jwt.access_token
          ? req.session.jwt.access_token
          : "undefined";

      config.headers = {
        Authorization: !config.headers.Authorization
          ? `Bearer ${JWT}`
          : config.headers.Authorization,
        accept: "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "User-Agent": "HIDDEN-KINGDOM",
      };
      return config;
    },
    (error) => {
      console.error(error);
      Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return Promise.resolve(response);
    },
    (error) => {
      const originalRequest = error.config;

      /* CASE : request new token by refresh token*/
      if (error.response && error.response.status === 401) {
        console.log("request new token by refresh token!!!!");

        if (!originalRequest._retry) {
          originalRequest._retry = true;

          // refresh token was not found
          if (!req.session.jwt.refresh_token) {
            req.session.destroy();
            res.clearCookie("remind_me");
            res.clearCookie("connect.sid");
            error.response.status = 440;
            return Promise.reject(error);
          }

          const JWT =
            req.session.jwt && req.session.jwt.access_token
              ? req.session.jwt.access_token
              : "undefined";

          let refreshTokenConfig = {
            headers: {
              Authorization: `Bearer ${JWT}`,
              accept: "*/*",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "User-Agent": "HIDDEN-KINGDOM",
            },
          };

          return axios
            .post(
              process.env.AUTH_API + "/v1/token/refresh",
              {
                refresh_token: req.session.jwt.refresh_token,
              },
              refreshTokenConfig
            )
            .then((response) => {
              if (response.status === 200) {
                req.session.jwt = response.data;
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: "Bearer " + response.data.access_token,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                };
                return axios(originalRequest);
              }
            })
            .catch((error) => {
              /* CASE : request new token failed */
              console.log("request new token failed");
              console.error("code", error.response.status);
              console.error("data", error.response.data);
              req.session.destroy();
              res.clearCookie("remind_me");
              res.clearCookie("connect.sid");
              error.response.status = 440;
              return Promise.reject(error);
            });
        } else {
          /* CASE : _retry = 1 failed */
          req.session.destroy();
          res.clearCookie("remind_me");
          res.clearCookie("connect.sid");
          error.response.status = 440;
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
  return client.request(config);
};
