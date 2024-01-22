import React, { useState, useEffect, useCallback } from "react";
import { C3POTable } from "r2d2";
// import { C3POTable } from "@components/proveTable";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { ContentBox } from "@components/ContentBox/ContentBox";
import { DescBox } from "@components/ContentBox/DescBox";
import { JNotification } from "@components/JNotification/JNotification";
import {
  Button,
  Typography,
  Drawer,
  Form,
  Input,
  Spin,
  Transfer,
  Row,
  Col,
  Tag,
} from "antd";
import { PlusCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { CirclePicker } from "react-color";
import { PermissionTransfer } from "../../../component/PermissionTransfer/PermissionTrasfer";
import Helper from "../../../Common/Helper/Helper";
import { useStore } from "../../../store/mobx";
import {
  getRoleRbac,
  assignPermissionToRoleRbac,
  createRoleRbac,
  deleteRoleRbac,
  getPermissionRbac,
  updateRoleRbac,
} from "../../../services/rbac.service";

const Role = observer(() => {
  const { t, i18n } = useTranslation();
  const { Title } = Typography;
  const [reloadTable, setReloadTable] = useState(true);
  const { authStore } = useStore();
  const [registerDrawer, setRegisterDrawer] = useState(false);

  useEffect(() => {
    setReloadTable(false);
    return () => {
      setReloadTable(true);
    };
  }, [reloadTable]);

  const ChangePermission = ({ mode, key, close, saveHandler, getHandler }) => {
    const [
      permissionOfRoleDataSource,
      setPermissionOfRoleDataSource,
    ] = useState({
      role: "",
      perMissionOfRoleKeys: [],
      allPermission: [],
    });
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let record = await getHandler(key);
      let { data: webPermission } = await getPermissionRbac();
      webPermission = await webPermission.map((e) => {
        return {
          key: e.permission,
          title: e.name_locale[i18n.language],
          description: e.description_locale[i18n.language],
          permission_id: e.permission_id,
        };
      });

      setPermissionOfRoleDataSource({
        role: record.role,
        perMissionOfRoleKeys: record.permissions,
        allPermission: webPermission,
      });

      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    const onChange = (targetKeys, direction, moveKeys) => {
      setPermissionOfRoleDataSource({
        ...permissionOfRoleDataSource,
        perMissionOfRoleKeys: targetKeys,
      });
    };

    return isDone ? (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "200px",
            alignItems: "center",
            width: "auto",
          }}
        >
          <Transfer
            listStyle={{
              width: 350,
              height: 400,
            }}
            dataSource={permissionOfRoleDataSource.allPermission}
            titles={[t("Source"), t("Target")]}
            targetKeys={permissionOfRoleDataSource.perMissionOfRoleKeys}
            onChange={onChange}
            render={(item) => `${item.title} ( ${item.key} )`}
          />
        </div>
        <Row justify={"end"} align={"bottom"} style={{ paddingTop: "18px" }}>
          <Col style={{ marginRight: "18px" }}>
            <Button htmlType="button" onClick={close}>
              {" "}
              {t("Cancel")}
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                let result = permissionOfRoleDataSource.allPermission.filter(
                  (e) =>
                    permissionOfRoleDataSource.perMissionOfRoleKeys.includes(
                      e.key
                    )
                );
                result = result.map((e) => e.permission_id);
                saveHandler({
                  role: permissionOfRoleDataSource.role,
                  permissions: [...result],
                });
              }}
              icon={<SaveOutlined />}
            >
              {" "}
              {t("Save")}{" "}
            </Button>
          </Col>
        </Row>
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "200px",
          alignItems: "center",
        }}
      >
        <Spin />
      </div>
    );
  };

  const Edit = ({ mode, key, close, saveHandler, getHandler }) => {
    const [RegisterForm] = Form.useForm();
    const [recordUpdate, setRecordUpdate] = useState({
      form: {},
    });
    const [isDone, setIsDone] = useState(false);
    const [colorPicker, setColorPicker] = useState("#1d39c4");
    const [submitting, setSubmitting] = useState(false);

    const FetchData = useCallback(async () => {
      let data = await getHandler(key);
      let { updated_by, ..._record } = data;
      setRecordUpdate({
        ...recordUpdate,
        form: {
          name_locale_th: _record.name_locale.th,
          name_locale_en: _record.name_locale.en,
          description_locale_th: _record.description_locale.th,
          description_locale_en: _record.description_locale.en,
          updated_by: authStore.getUsername,
          color: _record.properties.color || "geekblue",
          ..._record,
        },
      });
      let defaultColor = await Helper.getRoleHex(_record.properties.color);
      setColorPicker(defaultColor);
      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
      return () => {
        setRecordUpdate({
          form: {},
        });
        setSubmitting(false);
        setIsDone(false);
      };
    }, [FetchData]);

    return isDone ? (
      <Form
        key={"editRolePermission"}
        form={RegisterForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        initialValues={recordUpdate.form}
        onFinish={(values) => {
          setSubmitting(true);
          setRecordUpdate({
            form: {},
          });
          setSubmitting(false);
          setIsDone(false);
          saveHandler({ role: recordUpdate.form.role, ...values });
        }}
      >
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label={t("name_default")}
          name={"name"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label={t("name_locale_th")}
          name={"name_locale_th"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label={t("name_locale_en")}
          name={"name_locale_en"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label={t("description_default")}
          name={"description"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label={t("description_locale_th")}
          name={"description_locale_th"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label={t("description_locale_en")}
          name={"description_locale_en"}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("updated_by")} name={"updated_by"}>
          <Input disabled />
        </Form.Item>
        <Form.Item label={t("color_role")} name={"color"}>
          <CirclePicker
            color={colorPicker}
            circleSize={16}
            circleSpaces={10}
            triangle={"hide"}
            width={"100%"}
            colors={Helper.roleColor}
            onChangeComplete={(color, event) => {
              setColorPicker(color.hex);
              RegisterForm.setFieldsValue({
                color: Helper.getRoleName(color.hex),
              });
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {t("Submit")}
          </Button>
          <Button
            style={{ marginLeft: "8px" }}
            htmlType="button"
            onClick={close}
          >
            {t("Cancel")}
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin />
      </div>
    );
  };

  const Delete = ({ mode, key, close, saveHandler, getHandler }) => {
    const [roleDelete, setRoleDelete] = useState({
      submitting: false,
      deleteRole: "",
      deleteRoleName: "",
    });
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);
      console.log(_record);
      setRoleDelete({
        ...roleDelete,
        deleteRole: _record.role,
        deleteRoleName: _record.name_locale[i18n.language],
      });
      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
      return () => {
        setIsDone(false);
        setRoleDelete({
          submitting: false,
          deleteRole: "",
          deleteRoleName: "",
        });
      };
    }, [FetchData]);

    return isDone ? (
      <div>
        <div>
          {t("deleteRoleText1")}
          {` ${roleDelete.deleteRoleName} `}
          {t("deleteRoleText2")}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={() => {
              setRoleDelete({ ...roleDelete, submitting: true });
              saveHandler(roleDelete.deleteRole);
            }}
            loading={roleDelete.submitting}
          >
            {t("Delete")}
          </Button>
          <Button
            style={{ marginLeft: "8px" }}
            htmlType="button"
            onClick={close}
          >
            {t("Cancel")}
          </Button>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin />
      </div>
    );
  };

  const column = [
    {
      title: t("role"),
      dataIndex: ["name_locale", i18n.language],
      render: (text, row) => {
        let props = {};
        if (row.properties) {
          props.color = row.properties.color || "blue";
        } else {
          props.color = "blue";
        }
        return (
          <Tag style={{ minWidth: "50%" }} key={row.role} {...props}>
            {text}
          </Tag>
        );
      },
      align: "center",
    },
    {
      title: t("description"),
      dataIndex: ["description_locale", i18n.language],
    },
    {
      title: t("permission"),
      dataIndex: "permission_details",
      key: "created_at",
      render: (text, row, index) => {
        if (!Array.isArray(text)) return "";
        if (text.length) {
          if (text.length == 1) {
            return text.map((e) => (
              <Tag
                key={e.permission + index}
                color={
                  e.properties
                    ? e.properties.color
                      ? e.properties.color
                      : "geekblue"
                    : "geekblue"
                }
              >
                {e.name_locale[i18n.language]} ( {e.permission} )
              </Tag>
            ));
          } else {
            return text.map((e) => (
              <Tag
                key={e.permission + index}
                color={
                  e.properties
                    ? e.properties.color
                      ? e.properties.color
                      : "geekblue"
                    : "geekblue"
                }
              >
                {e.name_locale[i18n.language]} ( {e.permission} )
              </Tag>
            ));
          }
        } else {
          return (
            <div key={index} style={{ color: "chocolate" }}>
              {t("not assigned permission")}
            </div>
          );
        }
      },
    },
    {
      title: t("Options"),
      width: "120px",
      action: [
        {
          type: "update-status",
          text: t("assignPermission"),
          view: "modal",
          component: <ChangePermission mode={"update-status"} />,
          title: t("assignPermission"),
          width: "60%",
        },
        {
          type: "edit",
          text: t("Edit"),
          view: "drawer",
          component: <Edit mode={"edit"} />,
          title: t("Edit"),
          width: "40%",
        },
        {
          type: "delete",
          text: t("Delete"),
          view: "modal",
          component: <Delete mode={"delete"} />,
          title: t("DeleteUser"),
        },
      ],
    },
  ];

  const fetchUserRequest = async (cur_page = 1, per_page = 10, params = {}) => {
    let data = await getRoleRbac(cur_page, per_page, params);

    return {
      total_items: data.page_items,
      total_pages: data.page_all,
      per_pages: data.per_page,
      cur_pages: data.cur_page,
      data: data.data,
    };
  };

  const CreateNewRoleDrawer = () => {
    const onClose = () => {
      setRegisterDrawer(false);
    };
    const [form] = Form.useForm();
    const [colorPicker, setColorPicker] = useState("#1d39c4");
    const [submitting, setSubmitting] = useState(false);
    const initForm = {
      created_by: authStore.getUsername,
      color: "geekblue",
      permission_default: [],
    };

    return (
      <Drawer
        title={t("newRole")}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={registerDrawer}
        width={"50%"}
        forceRender
      >
        <Form
          key={"createRoleForm"}
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          initialValues={initForm}
          onFinish={async (values) => {
            try {
              setSubmitting(true);

              let response = await createRoleRbac({
                domain: process.env.AUTH_DOMAIN || "obiwan_support",
                ...values,
              });

              if (response.status === 201) {
                JNotification(
                  t("save_success"),
                  t(`created_role`) + ` : ${response.data.name}`,
                  "success"
                );
                setReloadTable(true);
                setRegisterDrawer(false);
              }
            } catch (err) {
              setSubmitting(false);
              JNotification(t("Error"), t("WrongDataSubmit"), "error");
              console.error(err);
            }
          }}
        >
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("name_default")}
            name={"name"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("name_locale_th")}
            name={"name_locale_th"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("name_locale_en")}
            name={"name_locale_en"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("description_default")}
            name={"description"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("description_locale_th")}
            name={"description_locale_th"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("description_locale_en")}
            name={"description_locale_en"}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t("created_by")} name={"created_by"}>
            <Input disabled />
          </Form.Item>
          <Form.Item label={t("color_role")} name={"color"}>
            <CirclePicker
              color={colorPicker}
              circleSize={16}
              circleSpaces={10}
              triangle={"hide"}
              width={"100%"}
              colors={Helper.roleColor}
              onChangeComplete={(color, event) => {
                setColorPicker(color.hex);
                form.setFieldsValue({ color: Helper.getRoleName(color.hex) });
              }}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("permission_default")}
            name={"permissions"}
          >
            <PermissionTransfer
              selectedCallback={(val) =>
                form.setFieldsValue({ permissions: val })
              }
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {t("Submit")}
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              htmlType="button"
              onClick={() =>
                setRegisterDrawer(false)
              }
            >
              {t("Cancel")}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  const getRecordHandler = async (key) => {
    let { data } = await getRoleRbac(null, null, { role: key });
    return data[0];
  };

  const changeRoleHandler = async (record) => {
    try {
      let done= await assignPermissionToRoleRbac(record);
      if (done) {
        JNotification(t("Success"), t("updatedRole"), "success");
      }
      return record;
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  const updateRecordHandler = async (record) => {
    try {
      let response = await updateRoleRbac(record);
      if (response.status === 204) {
        JNotification(
          t("save_success"),
          t(`save_success`) + ` : ${record.name}`,
          "success"
        );
      }
      return record;
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  const deleteRecordHandler = async (record) => {
    try {
      let response = await deleteRoleRbac(record);
      if (response.status === 204) {
        JNotification(t("save_success"), t(`save_success`), "success");
      }
      return record;
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  return (
    <div>
      <DescBox>
        <Title level={4}>{t("RoleManagement")}</Title>
        <div>
          <Button
            type="dashed"
            size="middle"
            icon={<PlusCircleOutlined />}
            onClick={() => setRegisterDrawer(true)}
          >
            {t("newRole")}
          </Button>
        </div>
      </DescBox>
      <CreateNewRoleDrawer />
      <ContentBox key={"role"}>
        {!reloadTable && (
          <C3POTable
            c3poKey={"role"}
            lang={i18n.language}
            fetchData={fetchUserRequest}
            columns={column}
            perPage={10}
            rowKey={"role"}
            bordered
            centered
            actionComponent={"dropdown"}
            dropdownText={t("Actions")}
            primaryKey={(record) => {
              const { role } = record;
              return role;
            }}
            getRecord={getRecordHandler}
            statusRecord={changeRoleHandler}
            updateRecord={updateRecordHandler}
            deleteRecord={deleteRecordHandler}
          />
        )}
      </ContentBox>
    </div>
  );
});

export default Role;
