import React, {useEffect} from "react";
import {useStore} from "../../store/mobx";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react";
import {Layout, Menu, Drawer, Spin, Form, Col, Row, Input, Button, Modal} from 'antd';
import {
  LockOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const UserProfile = observer(({onClose}) => {
  const {userStore, authStore} = useStore();
  const {t} = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      await userStore.read(authStore.session.username);
      form.setFieldsValue(userStore.user);
    })();
  }, []);

  const onFinish = async values => {
    await userStore.update(values);
    if (userStore.state === 'error') {
      Modal.error({
        content: userStore.message,
        title: t("Update User Profile failed")
      });
    } else {
      onClose();
    }
  };


  return (
    <Spin spinning={userStore.state === 'pending'} size="large" tip={t("Saving")}>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{span: 16}}
      >
        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item label={t("Username")} name="user">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item label={t("Citizen ID")} name="citizen_id">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item
              label={t("name")}
              rules={[
                {
                  required: true,
                  message: t("Please input the name!"),
                },
              ]}
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item
              name="phone"
              label={t("Mobile No,")}
              rules={[
                {
                  required: true,
                  message: t("Please input Mobile number!"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item label={t("Email address")} name="email">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item
              name="pin"
              label={t("Pin")}
              rules={[
                {
                  required: true,
                  len: 6,
                  pattern: "^[0-9]{1,}$",
                  message: t("Please input Pin number!"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 24 }}>
            <Form.Item label={t("Password")}>
              <Input disabled value="*****************************" />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="end" gutter={[8,8]}>
          <Col>
            <Form.Item>
              <Button type="secondary" htmlType="reset" onClick={onClose}>
                {t('cancel')}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" danger htmlType="button" onClick={onClose} icon={<LockOutlined />}>
                {t('Change Password')}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              {t("Save User Profile")}
            </Button>
          </Form.Item>
          </Col>

        </Row>
      </Form>
    </Spin>
  );
});
export default UserProfile
