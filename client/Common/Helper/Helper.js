import Joi from "joi";
import dayjs from "dayjs";
import axios from "axios";

export default {
  getDateTimeFormatStr: function (date, format = "DD/MM/YY HH:mm:ss") {
    return dayjs(date).format(format);
  },
  validateUserPayload: async function (userPayload) {
    try {
      const schema = Joi.object({
        type: Joi.string()
          .required()
          .valid("web_support", "line", "facebook", "google", "twitter"),
        domain: Joi.string().required(),
        user: Joi.alternatives().conditional("type", {
          is: "web_support",
          then: Joi.string().min(3).max(30).required(),
          otherwise: Joi.optional(),
        }),
        password: Joi.alternatives().conditional("type", {
          is: "web_support",
          then: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
          otherwise: Joi.optional(),
        }),
        email: Joi.string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: false },
          })
          .required(),
        citizen_id: Joi.string().length(13).required(),
        name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.string()
          .pattern(/^[0-9]+$/)
          .required(),
        created_by: Joi.optional(),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: false, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...userPayload }, options);
      return data;
    } catch (err) {
      throw err;
    }
  },
  validateUpdateUserPayload: async function (userPayload) {
    try {
      const schema = Joi.object({
        type: Joi.string()
          .required()
          .valid("web_support", "line", "facebook", "google", "twitter"),
        user: Joi.alternatives().conditional("type", {
          is: "web_support",
          then: Joi.string().min(3).max(30).required(),
          otherwise: Joi.optional(),
        }),
        citizen_id: Joi.string().length(13),
        name: Joi.string(),
        email: Joi.string().required(),
        first_name: Joi.string(),
        last_name: Joi.string(),
        phone: Joi.string().pattern(/^[0-9]+$/),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...userPayload }, options);
      return data;
    } catch (err) {
      throw err;
    }
  },
  validateCreateRole: async function (rolePayload) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        permissions: Joi.array(),
        name_locale_th: Joi.string(),
        name_locale_en: Joi.string(),
        description: Joi.string(),
        description_locale_th: Joi.string(),
        description_locale_en: Joi.string(),
        created_by: Joi.string(),
        color: Joi.string(),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...rolePayload }, options);
      return data;
    } catch (error) {
      throw error;
    }
  },
  validateUpdateRole: async function (rolePayload) {
    try {
      const schema = Joi.object({
        role: Joi.string().required(),
        name: Joi.string(),
        name_locale_th: Joi.string(),
        name_locale_en: Joi.string(),
        description: Joi.string(),
        description_locale_th: Joi.string(),
        description_locale_en: Joi.string(),
        updated_by: Joi.string(),
        color: Joi.string(),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...rolePayload }, options);
      return data;
    } catch (error) {
      throw error;
    }
  },
  assignPermissionToRole: async function (body) {
    try {
      const schema = Joi.object({
        role: Joi.string().required(),
        permissions: Joi.array().required(),
      });

      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...body }, options);
      return data;
    } catch (error) {
      throw error;
    }
  },
  beautyColor: [
    "#FF6900",
    "#FCB900",
    "#7BDCB5",
    "#00D084",
    "#8ED1FC",
    "#0693E3",
    "#EB144C",
    "#F78DA7",
    "#9900EF",
  ],
  roleColor: [
    "#c41d7f",
    "#cf1322",
    "#d4380d",
    "#d46b08",
    "#d48806",
    "#7cb305",
    "#389e0d",
    "#08979c",
    "#096dd9",
    "#1d39c4",
    "#531dab",
  ],
  getRoleName: function (hexCode) {
    let hexColor = {
      "#c41d7f": "magenta",
      "#cf1322": "red",
      "#d4380d": "volcano",
      "#d46b08": "orange",
      "#d48806": "gold",
      "#7cb305": "lime",
      "#389e0d": "green",
      "#08979c": "cyan",
      "#096dd9": "blue",
      "#1d39c4": "geekblue",
      "#531dab": "purple",
    };
    return hexColor[hexCode];
  },
  getRoleHex: function (colorName) {
    if (!colorName) return "#1d39c4";
    let color = {
      magenta: "#c41d7f",
      red: "#cf1322",
      volcano: "#d4380d",
      orange: "#d46b08",
      gold: "#d48806",
      lime: "#7cb305",
      green: "#389e0d",
      cyan: "#08979c",
      blue: "#096dd9",
      geekblue: "#1d39c4",
      purple: "#531dab",
    };
    return color[colorName];
  },
  validateCreatePermission: async function (rolePayload) {
    try {
      const schema = Joi.object({
        permission: Joi.required(),
        access: Joi.string().valid("Y", "N"),
        name: Joi.string().required().required(),
        name_locale_th: Joi.string().required(),
        name_locale_en: Joi.string().required(),
        description: Joi.string().required(),
        description_locale_th: Joi.string().required(),
        description_locale_en: Joi.string().required(),
        created_by: Joi.string(),
        color: Joi.string(),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...rolePayload }, options);
      return data;
    } catch (error) {
      throw error;
    }
  },
  validateUpdatePermission: async function (rolePayload) {
    try {
      const schema = Joi.object({
        permission_id: Joi.string().required(),
        permission: Joi.string(),
        access: Joi.string().valid("Y", "N"),
        name: Joi.string(),
        name_locale_th: Joi.string(),
        name_locale_en: Joi.string(),
        description: Joi.string(),
        description_locale_th: Joi.string(),
        description_locale_en: Joi.string(),
        created_by: Joi.string(),
        color: Joi.string(),
      });
      const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
      };

      let data = await schema.validateAsync({ ...rolePayload }, options);
      return data;
    } catch (error) {
      throw error;
    }
  },
  getBase64: function (url) {
    return axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((response) =>
        Buffer.from(response.data, "binary").toString("base64")
      );
  },
  JMPixel: function (pixel) {
    return `${pixel * window.devicePixelRatio}px`;
  },
  JMPoint: function (point) {
    return point * window.devicePixelRatio;
  },
};
