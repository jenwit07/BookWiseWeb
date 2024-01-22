import React, { useState, useEffect, useCallback } from "react";
import { C3POTable } from "r2d2";
// import { C3POTable } from "@components/ProveTable";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { ContentBox } from "@components/ContentBox/ContentBox";
import { DescBox } from "@components/ContentBox/DescBox";
import { JNotification } from "@components/JNotification/JNotification";
import { Button, Typography, Drawer, Form, Input, Spin, Tag } from "antd";
import { PlusCircleOutlined, SaveOutlined } from "@ant-design/icons";
import {
  getPermissionRbac,
  createPermissionRbac,
  deletePermissionRbac,
  updatePermissionRbac,
} from "../../../services/rbac.service";
import { useStore } from "../../../store/mobx";
import Helper from "../../../Common/Helper/Helper";
import { CirclePicker } from "react-color";

const Permission = observer(() => {
  const { t, i18n } = useTranslation();
  const { Title } = Typography;
  const [reloadTable, setReloadTable] = useState(true);
  const [registerDrawer, setRegisterDrawer] = useState({
    submitting: false,
    show: false,
    form: {},
  });
  const { authStore } = useStore();

  useEffect(() => {
    setReloadTable(false);
    return () => {
      setReloadTable(true);
    };
  }, [reloadTable]);

  const Edit = ({ mode, key, close, saveHandler, getHandler }) => {
    const [RegisterForm] = Form.useForm();
    const [recordUpdate, setRecordUpdate] = useState({
      permission_id: "",
      form: {},
    });
    const [isDone, setIsDone] = useState(false);
    const [colorPicker, setColorPicker] = useState("#1d39c4");
    const [submitting, setSubmitting] = useState(false);

    const FetchData = useCallback(async () => {
      let data = await getHandler(key);
      let { updated_by, ..._record } = data;
      setRecordUpdate({
        permission_id: _record.permission_id,
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
        key={"PermissionUpdateForm"}
        form={RegisterForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        initialValues={recordUpdate.form}
        onFinish={(values) => {
          setSubmitting(true);
          setSubmitting(false);
          setIsDone(false);
          saveHandler({ permission_id: recordUpdate.permission_id, ...values });
          setRecordUpdate({
            form: {},
          });
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
        <Form.Item label={t("color_permission")} name={"color"}>
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
    const [permissionDelete, setPermissionDelete] = useState({
      submitting: false,
      deletePermission: "",
      name: "",
    });
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);
      setPermissionDelete({
        ...permissionDelete,
        deletePermission: _record.permission_id,
        name: _record.name,
      });
      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    return isDone ? (
      <div>
        <div>
          {t("deletePermissionText1")}
          {` ${permissionDelete.name} `}
          {t("deletePermissionText2")}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={() => {
              setPermissionDelete({ ...permissionDelete, submitting: true });
              saveHandler(permissionDelete.deletePermission);
            }}
            loading={permissionDelete.submitting}
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
      title: t("permission_name"),
      dataIndex: ["name_locale", i18n.language],
      render: (text, row) => {
        let props = {};
        if (row.properties) {
          props.color = row.properties.color || "blue";
        } else {
          props.color = "blue";
        }
        return (
          <Tag style={{ minWidth: "50%" }} key={row.permission_id} {...props}>
            {text}
          </Tag>
        );
      },
      align: "center",
    },
    {
      title: t("permission_value"),
      dataIndex: "permission",
      key: "permission",
    },
    {
      title: t("description"),
      dataIndex: ["description_locale", i18n.language],
      key: ["description_locale", i18n.language],
    },
    {
      title: t("Options"),
      width: "120px",
      action: [
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
          title: t("Delete"),
        },
      ],
    },
  ];

  const fetchPermissionRequest = async (
    cur_page = 1,
    per_page = 10,
    params = {}
  ) => {
    let data = await getPermissionRbac(cur_page, per_page, params);
    return {
      total_items: data.page_items,
      total_pages: data.page_all,
      per_pages: data.per_page,
      cur_pages: data.cur_page,
      data: data.data,
    };
  };

  const CreateNewPermissionDrawer = () => {
    const [form] = Form.useForm();
    const onClose = () => {
      setRegisterDrawer({ ...registerDrawer, show: false });
    };
    const [colorPicker, setColorPicker] = useState("#1d39c4");
    const [submitting, setSubmitting] = useState(false);
    const initForm = {
      created_by: authStore.getUsername,
      color: "geekblue",
    };

    return (
      <Drawer
        title={t("newPermission")}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={registerDrawer.show}
        width={"40%"}
      >
        <Form
          key={"newPermission"}
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          initialValues={initForm}
          onFinish={async (values) => {
            try {
              setSubmitting(true);
              let response = await createPermissionRbac({
                ...values,
              });

              if (response.status === 201) {
                JNotification(
                  t("save_success"),
                  t(`created_permission`) + ` : ${response.data.name}`,
                  "success"
                );
                setReloadTable(true);
                setRegisterDrawer({
                  show: false,
                });
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
            label={t("permission_value")}
            name={"permission"}
          >
            <Input />
          </Form.Item>
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
          <Form.Item label={t("color_permission")} name={"color"}>
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
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {t("Submit")}
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              htmlType="button"
              onClick={() =>
                setRegisterDrawer({ ...registerDrawer, show: false })
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
    let { data } = await getPermissionRbac(null, null, { name: key });
    return data[0];
  };

  const updateRecordHandler = async (record) => {
    try {
      let response = await updatePermissionRbac(record);
      if (response.status === 204) {
        JNotification(t("save_success"), t(`save_success`), "success");
      }
      return record;
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  const deleteRecordHandler = async (record) => {
    try {
      let response = await deletePermissionRbac(record);
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
        <Title level={4}>{t("PermissionManagement")}</Title>
        <div>
          <Button
            type="dashed"
            size="middle"
            icon={<PlusCircleOutlined />}
            onClick={() => setRegisterDrawer({ ...registerDrawer, show: true })}
          >
            {t("newPermission")}
          </Button>
        </div>
      </DescBox>
      <CreateNewPermissionDrawer />
      <ContentBox key={"permission"}>
        {!reloadTable && (
          <C3POTable
            c3poKey={"permission"}
            lang={i18n.language}
            fetchData={fetchPermissionRequest}
            columns={column}
            perPage={10}
            rowKey={"name"}
            bordered
            centered
            actionComponent={"dropdown"}
            dropdownText={t("Actions")}
            primaryKey={(record) => {
              const { name } = record;
              return name;
            }}
            getRecord={getRecordHandler}
            updateRecord={updateRecordHandler}
            deleteRecord={deleteRecordHandler}
          />
        )}
      </ContentBox>
    </div>
  );
});

export default Permission;
