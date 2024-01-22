import React, { useState, useEffect, useCallback } from "react";
import { C3POTable } from "r2d2";
// import { C3POTable } from "@components/proveTable";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { ContentBox } from "@components/ContentBox/ContentBox";
import { DescBox } from "@components/ContentBox/DescBox";
import { JNotification } from "@components/JNotification/JNotification";
import { MapModal } from "@components/MapModal/MapModal";
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
  Divider
} from "antd";
import { PlusCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { CirclePicker } from "react-color";
import Helper from "@helper";
import { useStore } from "@stores";
import {
  createAddress,
    createStore,
    deleteAddress,
    deleteStore,
    getStore,
    updateAddress,
    updateStore,
} from "./store.service";
import MyMapWithAutocomplete from "../../component/MapModal/MapWithASearchBox";
import { MapForm } from "../../component/MapModal/MapModal";

const Store = observer(() => {
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

  const ViewMap = ({ mode, key, close, saveHandler, getHandler }) => {
    const [isDone, setIsDone] = useState(false);
    const [initData, setInitData] = useState({});

    const FetchData = useCallback(async () => {
      let data = await getHandler()
      // console.log('%c⧭', 'color: #408059', "data");
      // console.log('%c⧭', 'color: #408059', data);
      setInitData({
          lat: data?.address?.lat_long?.x,
          lng: data?.address?.lat_long?.y
      })
      setIsDone(true)
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    return isDone ? (
      <div>
        {Object.entries(initData).length && <MyMapWithAutocomplete initData={initData} onlyView={true} />}
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
    const [submitting, setSubmitting] = useState(false);

    const FetchData = useCallback(async () => {
      let data = await getHandler(key);
      
      console.log('%c%s', 'color: #eeff00', "Edit");
      console.log('%c⧭', 'color: #73998c', data);
      console.log('%c⧭', 'color: #73998c', data.address?.zipcode);

      setRecordUpdate({
        ...recordUpdate,
        form: {
          stores_id: data.stores_id, 
          address_id: data.address_id, 
          name: data.stores_name,
          detail: data.stores_details,
          location: { 
            location: {
                lat: data.address?.lat_long?.x,
                lng: data.address?.lat_long?.y
            }
          },
          addressLine1: data.address.addressLine1,
          addressLine2: data.address?.addressLine2,
          zipCode: data.address?.zipcode,
          university: data.address?.university,
        },
      });
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
        key={"createStoreForm"}
        form={RegisterForm}
        initialValues={recordUpdate.form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        onValuesChange={(changedValues, allValues) => {
          if(changedValues?.location) {
            if(changedValues?.location.type == 'search') {
              let autoFieldValue = {};
              if(changedValues?.location?.address) autoFieldValue.addressLine1 = changedValues?.location?.address;
              if(changedValues?.location?.postalCode) autoFieldValue.zipCode = changedValues?.location?.postalCode;
              if(changedValues?.location?.name) autoFieldValue.name = changedValues?.location?.name;

              RegisterForm.setFieldsValue(autoFieldValue)
            }
          }
        }}
        onFinish={async (values) => {
          try {
            setSubmitting(true);
            let isUpdatedStoreFlag = false 
            let isUpdatedAddressFlag = false 

            if(
              values.name !== recordUpdate.form.name ||
              values.detail !== recordUpdate.form.detail
            ) {
              isUpdatedStoreFlag = true
            }

            if(
              JSON.stringify(values.location) !== JSON.stringify(recordUpdate?.form?.location) ||
              values.addressLine1 !== recordUpdate?.form?.addressLine1 ||
              values.addressLine2 !== recordUpdate?.form?.addressLine2 ||
              values.zipCode !== recordUpdate?.form?.zipCode ||
              values.university !== recordUpdate?.form?.university
            ) {
              isUpdatedAddressFlag = true
            }
            if(isUpdatedStoreFlag) {
              /* Call Update Store */
              await updateStore({
                stores_id: String(recordUpdate.form.stores_id),
                name: values.name,
                detail: values.detail || "",
                address_id: String(recordUpdate.form.address_id)
              });
            }

            if(isUpdatedAddressFlag) {
              /* Call Update Address */
              await updateAddress({address_id: String(recordUpdate.form.address_id),...values});
            }

            if(isUpdatedAddressFlag && isUpdatedStoreFlag) {
              JNotification(
                t("save_success"),
                t(`store:updated_store`) + ` : ${values.stores_name}`,
                t("success")
              );
            }
            setSubmitting(true);
            setRecordUpdate({
              form: {},
            });
            setSubmitting(false);
            setIsDone(false);
            saveHandler({ stores_id: recordUpdate.form.stores_id, ...values });
          } catch (err) {
            setSubmitting(false);
            JNotification(t("Error"), t("WrongDataSubmit"), "error");
            console.error(err);
          } finally {
            
          }
        }}
      >
          <Divider orientation="left">{t('store:StoreInfo')}</Divider>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("store:name")}
            name={"name"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:detail")}
            name={"detail"}
          >
            <Input />
          </Form.Item>
          <Divider orientation="left">{t('store:StoreAddress')}</Divider>
          <Form.Item
            label={t("store:Map")}
            name={"location"}
          >
            <MapForm />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("store:addressLine1")}
            name={"addressLine1"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:addressLine2")}
            name={"addressLine2"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:zipCode")}
            name={"zipCode"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:university")}
            name={"university"}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {t("Submit")}
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              htmlType="button"
              onClick={() =>
                close()
              }
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
    const [StoreDelete, setStoreDelete] = useState({
      submitting: false,
      stores_id: "",
      stores_name: "",
      address_id: "",
      address_name: "",
    });
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let data = await getHandler(key);
      setStoreDelete({
        submitting: false,
        stores_id: data.stores_id,
        stores_name: data.stores_name,
        address_id: data.address_id,
        address_name: data.address_name
      })
      setIsDone(true);
    }, [getHandler, key]);

    useEffect(() => {
      FetchData();
      return () => {
        setIsDone(false);
        setStoreDelete({
          submitting: false,
          deleteStore: "",
          deleteStoreName: "",
        });
      };
    }, [FetchData]);

    return isDone ? (
      <div>
        <div>
          {t("store:deleteStoreText1")}
          {` ${StoreDelete.stores_name} `}
          {t("store:deleteStoreText2")}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={async () => {
              setStoreDelete({ ...StoreDelete, submitting: true });
              await deleteStore({stores_id: StoreDelete.stores_id})
              await deleteAddress({address_id: StoreDelete.address_id})
              saveHandler(StoreDelete.deleteStore);
            }}
            loading={StoreDelete.submitting}
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
      title: t("store:stores_name"),
      dataIndex: "stores_name",
    },
    {
      title: t("store:stores_details"),
      dataIndex: "stores_details",
    },
    {
      title: t("store:address"),
      dataIndex: ["address","addressLine1"],
    },
    {
      title: t("store:university"),
      dataIndex: ["address","university"],
    },
    {
      title: t("store:active_flag"),
      dataIndex: "active_flag",
      render: (text, record) => {
        return (
            <Tag color={text ? "blue": "red"}>{t(`store:${text ? "active" : "disable"}`)}</Tag>
        )
      }
    },
    {
      title: t("Options"),
      width: "120px",
      action: [
        {
          type: "view",
          text: t("store:viewMap"),
          view: "modal",
          component: <ViewMap mode={"view"} />,
          title: t("store:viewMap"),
          width: "850px",
        },
        {
          type: "edit",
          text: t("edit"),
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
          title: t("store:DeleteStore"),
        },
      ],
    },
  ];

  const fetchStoreRequest = async (cur_page = 1, per_page = 10, params = {}) => {
    let data = await getStore(cur_page, per_page, params);

    return {
      total_items: data.page_items,
      total_pages: data.page_all,
      per_pages: data.per_page,
      cur_pages: data.cur_page,
      data: data.data,
    };
  };

  const CreateNewStoreDrawer = () => {
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
        title={t("store:newStore")}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={registerDrawer}
        width={"50%"}
        forceRender
      >
        {/* <MapModal onSelect={(placeData) => console.log('%c⧭', 'color: #006dcc', placeData)} /> */}
        <Form
          key={"createStoreForm"}
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          initialValues={initForm}
          onFinish={async (values) => {
            console.log('%c⧭', 'color: #731d6d', values);
          }}
          onValuesChange={(changedValues, allValues) => {
            console.log(changedValues)
            console.log(allValues)
            if(changedValues?.location) {
              if(changedValues?.location.type == 'search') {
                let autoFieldValue = {};
                if(changedValues?.location?.address) autoFieldValue.addressLine1 = changedValues?.location?.address;
                if(changedValues?.location?.postalCode) autoFieldValue.zipCode = changedValues?.location?.postalCode;
                if(changedValues?.location?.name) autoFieldValue.name = changedValues?.location?.name;
  
                form.setFieldsValue(autoFieldValue)
              }
            }
          }}
          onFinish={async (values) => {
            try {
              setSubmitting(true);

              /* 1.Create Address */
              let responseCreateAddress = await createAddress(values);

              if (responseCreateAddress.address_id) {
                /* 2.Create Store */
                let responseCreateStore = await createStore({
                  name: values.name,
                  detail: values.detail || "",
                  addressId: responseCreateAddress.address_id
                });

                JNotification(
                  t("save_success"),
                  t(`store:created_store`) + ` : ${responseCreateStore.stores_name}`,
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
          <Divider orientation="left">{t('store:StoreInfo')}</Divider>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("store:name")}
            name={"name"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:detail")}
            name={"detail"}
          >
            <Input />
          </Form.Item>
          <Divider orientation="left">{t('store:StoreAddress')}</Divider>
          <Form.Item
            label={t("store:Map")}
            name={"location"}
          >
            <MapForm />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            label={t("store:addressLine1")}
            name={"addressLine1"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:addressLine2")}
            name={"addressLine2"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:zipCode")}
            name={"zipCode"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("store:university")}
            name={"university"}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item label={t("created_by")} name={"created_by"}>
            <Input disabled />
          </Form.Item> */}
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
    console.log(key)
    let { data } = await getStore(null, null, { stores_id: key });
    return data[0];
  };

  const changeStoreHandler = async (record) => {
    try {
    //   let done= await assignPermissionToStoreRbac(record);
    //   if (done) {
    //     JNotification(t("Success"), t("updatedStore"), "success");
    //   }
    //   return record;
    return true
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  const updateRecordHandler = async (record) => {
    try {
    //   let response = await updateStoreRbac(record);
    //   if (response.status === 204) {
    //     JNotification(
    //       t("save_success"),
    //       t(`save_success`) + ` : ${record.name}`,
    //       "success"
    //     );
    //   }
    //   return record;
    return true
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  const deleteRecordHandler = async (record) => {
    try {
    //   let response = await deleteStoreRbac(record);
    //   if (response.status === 204) {
    //     JNotification(t("save_success"), t(`save_success`), "success");
    //   }
    //   return record;
    return true
    } catch (err) {
      JNotification(t("Error"), err.message);
    }
  };

  return (
    <div>
      <DescBox>
        <Title level={4}>{t("store:StoreManagement")}</Title>
        <div>
          <Button
            type="dashed"
            size="middle"
            icon={<PlusCircleOutlined />}
            onClick={() => setRegisterDrawer(true)}
          >
            {t("store:newStore")}
          </Button>
        </div>
      </DescBox>
      <CreateNewStoreDrawer />
      <ContentBox key={"Store"}>
        {!reloadTable && (
          <C3POTable
            c3poKey={"Store"}
            lang={i18n.language}
            fetchData={fetchStoreRequest}
            columns={column}
            perPage={10}
            rowKey={"stores_id"}
            bordered
            centered
            actionComponent={"dropdown"}
            dropdownText={t("Actions")}
            primaryKey={(record) => {
              const { stores_id } = record;
              return stores_id;
            }}
            getRecord={getRecordHandler}
            statusRecord={changeStoreHandler}
            updateRecord={updateRecordHandler}
            deleteRecord={deleteRecordHandler}
          />
        )}
      </ContentBox>
    </div>
  );
});

export default Store;
