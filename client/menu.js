import React, { lazy } from "react";

import {
  ContainerFilled,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

// Side Menu Show
import User from "@pages/Rbac/User/User";
import Role from "@pages/Rbac/Role/Role";
import Permission from "@pages/Rbac/Permission/Permission";
import Store from "./pages/Store/Store";

const menu = (t) => [
  {
    name: "stores",
    label: t("stores"),
    icon: ApartmentOutlined,
    path: "/stores",
    component: [Store],
  },
  {
    name: "iam-admin",
    label: t("iamAndAdmin"),
    icon: UserOutlined,
    items: [
      {
        name: "user",
        label: t("UserManagement"),
        path: "/iam-admin/user",
        component: [User],
        main: true,
      },
      {
        name: "role",
        label: t("RoleManagement"),
        path: "/iam-admin/role",
        component: [Role],
      },
      {
        name: "permission",
        label: t("PermissionManagement"),
        path: "/iam-admin/permission",
        component: [Permission],
      },
    ],
  }
];

export default menu;

export function getRoutes(t) {
  let routes = [];
  const findRoutes = (menu) => {
    for (let item of menu) {
      if (item.path && item.component) {
        routes.push({
          path: item.path,
          component: item.component,
          label: item.label,
        });
      }
      if (item.items) {
        findRoutes(item.items);
      }
    }
  };
  findRoutes(menu(t));
  return routes;
}

export function menuFiltered(t, permissions = []) {
  let permissionsLowerCase = permissions.map((v) => v.toLowerCase());
  const checkRoutes = (route) => {
    if (
      permissionsLowerCase.includes(route) ||
      permissionsLowerCase.includes("*") ||
      permissionsLowerCase.includes("/*")
    ) {
      return true;
    }

    let pos = 1;

    while (pos > 0) {
      pos = route.lastIndexOf("/");
      route = route.substr(0, pos);
      if (permissions.includes(route + "/*")) {
        return true;
      }
    }
  };

  const findRoutes = (menu) => {
    let result = [];
    for (let item of menu) {
      let access = false;

      if (item.path && item.component) {
        access = checkRoutes(item.path.toLowerCase());
      }

      if (item.items) {
        let subItems = findRoutes(item.items);
        if (subItems.length) {
          access = true;
        }
        item.items = subItems;
      }
      if (access === true) {
        result.push(item);
      }
    }
    return result;
  };

  return findRoutes(menu(t));
}

export const getMainMenu = (t) => {
  let mainMenu = null;
  let findMainMenu = menu(t).filter((e) => e.main === true);
  if (findMainMenu.length) {
    mainMenu = findMainMenu[0].path;
  } else {
    for (const nested of menu(t)) {
      if (nested.items) {
        let findNestedItemsMainMenu = nested.items.filter(
          (e) => e.main === true
        );
        if (findNestedItemsMainMenu.length)
          mainMenu = findNestedItemsMainMenu[0].path;
      }
    }
  }
  return mainMenu || "/iam-admin/user";
};
