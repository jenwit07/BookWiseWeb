import React, { useState, useEffect, useCallback } from "react";
import { C3POTable } from "r2d2";
// import { C3POTable } from "@components/proveTable";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import {
  getUserRbac,
  createUserRbac,
  getRoleRbac,
  updateUserPermissionRbac,
  updateUserRbac,
  deleteUserRbac,
} from "@services/rbac.service.js";
import { ContentBox } from "@components/ContentBox/ContentBox";
import { DescBox } from "@components/ContentBox/DescBox";
import { UserTypesTag } from "@components/UserTypesTag/UserTypesTag";
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
  Select,
} from "antd";
import { PlusCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useStore } from "@stores";
import _ from "lodash";

const { Option } = Select;

const User = observer(() => {
  const { authStore } = useStore();
  const { t, i18n } = useTranslation();
  const { Title } = Typography;
  const [reloadTable, setReloadTable] = useState(true);
  const [registerDrawer, setRegisterDrawer] = useState(false);

  useEffect(() => {
    setReloadTable(false);
    return () => {
      setReloadTable(true);
    };
  }, [reloadTable]);

  const ChangeRoles = ({ mode, key, close, saveHandler, getHandler }) => {
    const [userRoleDataSource, setUserRoleDataSource] = useState({
      type: "",
      email: "",
      userPermissionKeys: [],
      webPermission: [],
      selectedKeys: [],
    });
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let record = await getHandler(key);
      let { data: webPermission } = await getRoleRbac();
      webPermission = await webPermission.map((e) => {
        return {
          key: e.role,
          title: e.name,
          description: e.description_locale[i18n.language],
        };
      });

      let userPermission = record.role.map((e) => e.role);

      setUserRoleDataSource({
        userPermissionKeys: userPermission,
        webPermission: webPermission,
        selectedKeys: [],
        type: record.type,
        email: record.email
      });

      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    const onChange = (targetKeys, direction, moveKeys) => {
      setUserRoleDataSource({
        ...userRoleDataSource,
        userPermissionKeys: targetKeys,
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
          }}
        >
          <Transfer
            dataSource={userRoleDataSource.webPermission}
            titles={[t("Source"), t("Target")]}
            targetKeys={userRoleDataSource.userPermissionKeys}
            onChange={onChange}
            render={(item) => item.description}
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
              onClick={() =>
                saveHandler({
                  email: userRoleDataSource.email,
                  type: userRoleDataSource.type,
                  roles: [...userRoleDataSource.userPermissionKeys],
                })
              }
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
      submitting: false,
      form: {},
    });
    const [isDone, setIsDone] = useState(false);

    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);
      setRecordUpdate({
        ...recordUpdate,
        form: { name: _record.first_name, ..._record },
      });
      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
      return () => {
        setRecordUpdate({
          submitting: false,
          form: {},
        });
      };
    }, [FetchData]);

    return isDone ? (
      <Form
        key={"EditUserForm"}
        form={RegisterForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        initialValues={recordUpdate.form}
        onFinish={(values) => {
          setRecordUpdate({ ...recordUpdate, submitting: true });
          saveHandler({ type: recordUpdate.form.type, ...values });
        }}
      >
        <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ paddingRight: "16px", marginLeft: "12px" }}>
              ประเภท :{" "}
            </div>
            <UserTypesTag type={recordUpdate.form.type} />
          </div>
        </Form.Item>
        <Form.Item
          hidden={recordUpdate.form.type !== "web_support"}
          label={t("user")}
          name={"user"}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item label={t("email")} name={"email"}>
          <Input type="email" disabled />
        </Form.Item>
        <Form.Item label={t("citizen_id")} name={"citizen_id"}>
          <Input />
        </Form.Item>
        <Form.Item label={t("name")} name={"name"}>
          <Input />
        </Form.Item>
        <Form.Item label={t("last_name")} name={"last_name"}>
          <Input />
        </Form.Item>
        <Form.Item label={t("phone")} name={"phone"}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={recordUpdate.submitting}
          >
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
    const [userDelete, setUserDelete] = useState({
      submitting: false,
      deleteKey: "",
      deleteType: "",
    });
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);
      setUserDelete({
        ...userDelete,
        deleteKey: _record.email,
        deleteType: _record.type,
      });
      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    return isDone ? (
      <div>
        <div>
          {t("deleteUserText1")}
          {` ${userDelete.deleteKey} (${userDelete.deleteType})`}
          {t("deleteUserText2")}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={() => {
              setUserDelete({ ...userDelete, submitting: true });
              saveHandler({
                type: userDelete.deleteType,
                email: userDelete.deleteKey,
              });
            }}
            loading={userDelete.submitting}
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
      title: t("user_type"),
      dataIndex: "type",
      key: "type",
      render: (text, rows) => <UserTypesTag type={text} />,
      align: "center",
    },
    {
      title: t("user"),
      dataIndex: "user",
      key: "user",
      search_params: "user",
    },
    {
      title: t("first_name"),
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: t("last_name"),
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("role"),
      dataIndex: "role",
      render: (text, row, index) => {
        if (!Array.isArray(text)) return "";
        if (text.length) {
          if (text.length == 1) {
            return text.map((e) => (
              <Tag
                key={e.role + index}
                color={
                  e.properties
                    ? e.properties.color
                      ? e.properties.color
                      : "geekblue"
                    : "geekblue"
                }
              >
                {e.name_locale[i18n.language]}
              </Tag>
            ));
          } else {
            return text.map((e) => (
              <Tag
                key={e.role + index}
                color={
                  e.properties
                    ? e.properties.color
                      ? e.properties.color
                      : "geekblue"
                    : "geekblue"
                }
              >
                {e.name_locale[i18n.language]}
              </Tag>
            ));
          }
        } else {
          return <div style={{ color: "chocolate" }}>{t("unassigned")}</div>;
        }
      },
    },
    {
      title: t("Options"),
      width: "120px",
      action: [
        {
          type: "update-status",
          text: t("Change_Roles"),
          view: "modal",
          component: <ChangeRoles mode={"update-status"} />,
          title: t("Change_Roles"),
          width: "30%",
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
    let data = await getUserRbac(cur_page, per_page, params);

    return {
      total_items: data.page_items,
      total_pages: data.page_all,
      per_pages: data.per_page,
      cur_pages: data.cur_page,
      data: data.data,
    };
  };

  const CreateNewUserDrawer = () => {
    const [form] = Form.useForm();
    const [createSubmitting, setCreateSubmitting] = useState(false);
    const [typeUser, setTypeUser] = useState("web_support");
    const onClose = () => {
      setRegisterDrawer(false);
    };
    return (
      <Drawer
        title={t("newUser")}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={registerDrawer}
        width={"40%"}
      >
        <Form
          key={"CreateUserForm"}
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          initialValues={{
            type: "web_support",
            user: "",
            password: "",
            email: "",
            citizen_id: "",
            name: "",
            last_name: "",
            phone: "",
          }}
          onFinish={async (values) => {
            try {
              setCreateSubmitting(true);
              let response = await createUserRbac({
                domain: process.env.AUTH_DOMAIN || "obiwan_support",
                created_by: authStore.getUsername,
                ...values,
              });
              if (response.status === 201) {
                JNotification(
                  t("save_success"),
                  t(`created_user`) + ` : ${values.email} (${email.type})`,
                  "success"
                );
                setReloadTable(true);
                setRegisterDrawer(false);
              }
            } catch (err) {
              JNotification(
                t("Error"),
                err.response.data.message
                  ? err.response.data.message
                  : t("WrongDataSubmit"),
                "error"
              );
            } finally {
              setCreateSubmitting(false);
            }
          }}
        >
          <Form.Item label={t("user_type")} name={"type"}>
            <Select
              onChange={(v) => {
                setTypeUser(v);
                if (v !== "web_support") {
                  form.setFieldsValue({
                    user: "",
                    password: "",
                  });
                }
              }}
            >
              <Option value="web_support">Web Support</Option>
              <Option value="google">Google Account</Option>
              <Option value="facebook">Facebook Account</Option>
              <Option value="line">Line Account</Option>
              <Option value="twitter" disabled>
                Twitter Account
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            hidden={typeUser !== "web_support"}
            label={t("user")}
            name={"user"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hidden={typeUser !== "web_support"}
            label={t("password")}
            name={"password"}
          >
            <Input type="password" autoComplete="on" />
          </Form.Item>
          <Form.Item label={t("email")} name={"email"}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label={t("citizen_id")} name={"citizen_id"}>
            <Input />
          </Form.Item>
          <Form.Item label={t("name")} name={"name"}>
            <Input />
          </Form.Item>
          <Form.Item label={t("last_name")} name={"last_name"}>
            <Input />
          </Form.Item>
          <Form.Item label={t("phone")} name={"phone"}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={createSubmitting}>
              {t("Submit")}
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              htmlType="button"
              onClick={() => setRegisterDrawer(false)}
            >
              {t("Cancel")}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  const getRecordHandler = async (key) => {
    let params = JSON.parse(key);
    let { data } = await getUserRbac(null, null, { ...params });
    return data[0];
  };

  const changeRoleHandler = async (record) => {
    try {
      let { status } = await updateUserPermissionRbac(record);
      if (status === 200) {
        JNotification(t("Success"), t("updatedUserRole"), "success");
      }
      return record;
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  const updateRecordHandler = async (record) => {
    try {
      let response = await updateUserRbac(record);
      if (response.status === 204) {
        JNotification(
          t("save_success"),
          t(`Save`) + ` : ${record.email} (${record.type})`,
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
      let response = await deleteUserRbac(record);
      if (response.status === 204) {
        JNotification(
          t("save_success"),
          t(`Delete`) + ` : ${record.email} (${record.type})`,
          "success"
        );
      }
      return record;
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  return (
    <div>
      <DescBox>
        <Title level={4}>{t("UserManagement")}</Title>
        <div>
          <Button
            type="dashed"
            size="middle"
            icon={<PlusCircleOutlined />}
            onClick={() => setRegisterDrawer(true)}
          >
            {t("newUser")}
          </Button>
        </div>
      </DescBox>
      <CreateNewUserDrawer />
      <ContentBox key={"User"}>
        {!reloadTable && (
          <C3POTable
            tableLayout={"auto"}
            c3poKey={"User"}
            lang={i18n.language}
            fetchData={fetchUserRequest}
            columns={column}
            perPage={10}
            rowKey={(record) => {
              const { type, email } = record;
              return JSON.stringify({ type, email });
            }}
            bordered
            centered
            actionComponent={"dropdown"}
            dropdownText={t("Actions")}
            primaryKey={(record) => {
              const { type, email } = record;
              return JSON.stringify({ type, email });
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

export default User;
