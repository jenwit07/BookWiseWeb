import React, { useCallback, useEffect, useState } from "react";
import { Transfer } from "antd";
import { getPermissionRbac } from "../../services/rbac.service";
import { useTranslation } from "react-i18next";

export const PermissionTransfer = ({ selectedCallback }) => {
  const { t, i18n } = useTranslation();
  const [userPermissionDataSource, setPermissionDataSource] = useState({
    userPermissionKeys: [],
    webPermission: [],
    selectedKeys: [],
  });
  const FetchData = useCallback(async () => {
    let { data: webPermission } = await getPermissionRbac();
    webPermission = await webPermission.map((e) => {
      return {
        key: e.permission,
        title: e.name_locale[i18n.language],
        description: e.description_locale[i18n.language],
        permission_id: e.permission_id,
      };
    });

    setPermissionDataSource({
      ...userPermissionDataSource,
      webPermission: webPermission,
    });
  }, []);

  useEffect(() => {
    FetchData();
    return () => {
      setPermissionDataSource({
        userPermissionKeys: [],
        webPermission: [],
        selectedKeys: [],
      }); // This worked for me
    };
  }, [FetchData]);

  return (
    <Transfer
      listStyle={{
        width: 200,
      }}
      dataSource={userPermissionDataSource.webPermission}
      titles={[t("Source"), t("Target")]}
      targetKeys={userPermissionDataSource.userPermissionKeys}
      onChange={(targetKeys, direction, moveKeys) => {
        setPermissionDataSource({
          ...userPermissionDataSource,
          userPermissionKeys: targetKeys,
        });

        let result = userPermissionDataSource.webPermission.filter((e) =>
          targetKeys.includes(e.key)
        );
        result = result.map((e) => e.permission_id);
        selectedCallback(result);
      }}
      render={(item) => `${item.title} ( ${item.key} )`}
    />
  );
};
