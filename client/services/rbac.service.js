import { authAPI } from "@api";
import helper from "@helper";
import { property } from "lodash-es";

export const getRoleRbac = async (
  cur_page = null,
  per_page = null,
  params = {}
) => {
  let { data } = await authAPI().get(`/v1/role`, {
    params: {
      domain: "obiwan_support",
      cur_page: cur_page,
      per_page: per_page,
      ...params,
    },
  });
  return data;
};

export const getPermissionRbac = async (
  cur_page = 1,
  per_page = 10,
  params = {}
) => {
  let { data } = await authAPI().get(`/v1/permission`, {
    params: {
      domain: "obiwan_support",
      cur_page: cur_page,
      per_page: per_page,
      ...params,
    },
  });
  return data;
};

export const getUserRbac = async (cur_page = 1, per_page = 10, params = {}) => {
  let { data } = await authAPI().get(`/v1/user`, {
    params: {
      domain: "obiwan_support",
      cur_page: cur_page,
      per_page: per_page,
      ...params,
    },
  });
  return data;
};

export const createUserRbac = async (body) => {
  try {
    let payload = await helper.validateUserPayload(body);
    if(payload.type !== "web_support") {
      delete payload["user"]
      delete payload["password"]
    }
    let { data, status } = await authAPI().post(`/v1/register`, {
      ...payload,
    });

    return { data, status };
  } catch (err) {
    throw err;
  }
};

export const updateUserPermissionRbac = async ({ type,email, roles = [] }) => {
  try {
    if (roles.length === 0) throw new Error("ต้องมีอย่างน้อย 1 บทบาท");
    if (!type || !email) throw new Error("ข้อมูลไม่ถูกต้อง");

    let { data, status } = await authAPI().post(`/v1/role/assign`, {
      domain: "obiwan_support",
      type: type,
      email: email,
      roles: roles,
    });

    return { data, status };
  } catch (err) {
    throw err;
  }
};

export const updateUserRbac = async (body) => {
  try {
    let payload = await helper.validateUpdateUserPayload(body);

    let { data, status } = await authAPI().put(`/v1/user`, {
      domain: "obiwan_support",
      ...payload,
    });

    return { data, status };
  } catch (err) {
    throw err;
  }
};

export const deleteUserRbac = async ({type,email}) => {
  try {
    if (!type || !email) throw new Error("ข้อมูลในการลบไม่ถูกต้อง");

    let { data, status } = await authAPI().delete(`/v1/user`, {
      params: {
        domain: "obiwan_support",
        type: type,
        email: email,
      },
    });

    return { data, status };
  } catch (err) {
    throw err;
  }
};

// {
//   "domain": "string",
//   "name": "string",
//   "name_locale_th": "string",
//   "name_locale_en": "string",
//   "description": "string",
//   "description_locale_th": "string",
//   "description_locale_en": "string",
//   "created_by": "string",
//   "color": "string",
//   "permission": [
//     "string"
//   ]
// }
export const createRoleRbac = async (role) => {
  try {
    let payload = await helper.validateCreateRole(role);

    let { data, status } = await authAPI().post(`/v1/role`, {
      domain: "obiwan_support",
      ...payload,
    });

    return { data, status };
  } catch (err) {
    throw err;
  }
};

// {
//   "domain": "string",
//   "role": "string",
//   "name": "string",
//   "name_locale_th": "string",
//   "name_locale_en": "string",
//   "description": "string",
//   "description_locale_th": "string",
//   "description_locale_en": "string",
//   "updated_by": "string",
//   "color": "string"
// }
export const updateRoleRbac = async (role) => {
  try {
    let payload = await helper.validateUpdateRole(role);

    let { data, status } = await authAPI().put(`/v1/role`, {
      domain: "obiwan_support",
      ...payload,
    });

    return { data, status };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteRoleRbac = async (role) => {
  try {
    if (!role) throw new Error("ไม่พบผู้ใช้");

    let { data, status } = await authAPI().delete(`/v1/role`, {
      params: {
        domain: "obiwan_support",
        role: role,
      },
    });

    return { data, status };
  } catch (err) {
    throw err;
  }
};

// {
//   "domain": "string",
//   "role": "string",
//   "permissions": [
//     "string"
//   ]
// }
export const assignPermissionToRoleRbac = async (body) => {
  try {
    let payload = await helper.assignPermissionToRole(body);

    let { status } = await authAPI().post(`/v1/permission/assign`, {
      domain: "obiwan_support",
      ...payload,
    });

    if (status !== 204) return false;
    return true;
  } catch (err) {
    throw err;
  }
};

/*
  {
    "domain": "string",
    "permission": "string",
    "access": "Y",
    "name": "string",
    "name_locale_th": "string",
    "name_locale_en": "string",
    "description": "string",
    "description_locale_th": "string",
    "description_locale_en": "string",
    "created_by": "string",
    "color": "string"
  }
*/
export const createPermissionRbac = async (body) => {
  try {
    let payload = await helper.validateCreatePermission(body);

    let { data, status } = await authAPI().post(`/v1/permission`, {
      domain: "obiwan_support",
      ...payload,
    });

    return { data, status };
  } catch (error) {
    throw error;
  }
};

/*
  {
    "domain": "string",
    "permission": "string",
    "access": "Y",
    "name": "string",
    "name_locale_th": "string",
    "name_locale_en": "string",
    "description": "string",
    "description_locale_th": "string",
    "description_locale_en": "string",
    "updated_by": "string",
    "color": "string"
  }
*/
export const updatePermissionRbac = async (body) => {
  try {
    let payload = await helper.validateUpdatePermission(body);

    let { data, status } = await authAPI().put(`/v1/permission`, {
      domain: "obiwan_support",
      ...payload,
    });

    return { data, status };
  } catch (error) {
    throw error;
  }
};

/*
  @params {string} domain
  @params {string} name
*/
export const deletePermissionRbac = async (permission) => {
  try {
    if (!permission) throw new Error("ไม่พบข้อมูล");

    let { data, status } = await authAPI().delete(`/v1/permission`, {
      params: {
        domain: "obiwan_support",
        permission_id: permission,
      },
    });

    return { data, status };
  } catch (error) {}
};
