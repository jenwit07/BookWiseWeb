import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Modal,
  Spin,
  Card,
  Typography,
  Col,
  Tag,
  Image,
  Divider,
} from "antd";
import Icon, { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { useStore } from "@stores";
import { useTranslation } from "react-i18next";
import {
  TwitterOutlined,
  GoogleOutlined,
  FacebookOutlined,
  LineOutlined,
} from "@ant-design/icons";
import { JNotification } from "../component/JNotification/JNotification";
import Helper from "../Common/Helper/Helper";
import Responsive from "../Common/Helper/Responsive";

/* Logo */
import WebsiteLogo from "../images/logo/wajito-backoffice.png";
import LineLogo from "../images/logo/LINE_APP.png";
import FacebookLogo from "../images/logo/facebook.png";

/* Social Sign In Libs */
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const { Title } = Typography;

const LoginForm = observer(() => {
  const { authStore } = useStore();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const lineLoginUrl = `${process.env.BASE_PATH}/server/line/login`;

  const onFinish = async (values) => {
    try {
      let credential = {};
      if (values.username && values.password) {
        credential.type = "web_support";
        credential.username = values.username;
        credential.password = values.password;
        credential.remember = values.remember;
      }

      if (values.googleId) {
        credential.type = "google";
        credential.token = values.tokenId;
      }

      if (values.graphDomain == "facebook") {
        credential.type = "facebook";
        credential.token = values.accessToken;
      }

      await authStore.login(credential);
    } catch (error) {
      console.error(error?.response?.data?.message);
      JNotification(
        "เกิดข้อผิดพลาด",
        error?.response?.data?.message
          ? error.response.data.message
          : "ไม่สามารถเข้าสู่ระบบได้ โปรดติดต่อผู้ดูแล"
      );
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Col span={24}>
        <Row gutter={[0, 0]} justify="center" style={{ display: "none" }}>
          <Col span={6}>
            <div className={"logo-large"}></div>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={6}>
            <Card
              className="login-form"
              style={{ backgroundColor: "rgb(255 255 255 / 100%)" }}
            >
              <Spin
                tip={t("Loading")}
                spinning={
                  authStore.state === "pending"
                  // || masterStore.state === "pending"
                }
              >
                <div className="logo-login" />
                <Form
                  name="normal_login"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  form={form}
                >
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: t("Please input your Username!"),
                      },
                    ]}
                  >
                    <Input
                      className={"login-page"}
                      prefix={<UserOutlined />}
                      placeholder={t("Username")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: t("Please input your Password!"),
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder={t("Password")}
                    />
                  </Form.Item>

                  <Row justify={"end"} style={{ height: "30px" }}>
                    <Form.Item style={{ width: "100%" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                      >
                        {t("LogIn")}
                      </Button>
                    </Form.Item>
                  </Row>
                  <Divider
                    plain
                    style={{
                      color: "gray",
                      fontSize: "small",
                      fontStyle: "bold",
                    }}
                  >
                    {t("OrContinueWith")}
                  </Divider>
                  <Row gutter={[0, 24]}>
                    <Col
                      span={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        render={(renderProps) => (
                          <Tag
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            icon={<GoogleOutlined />}
                            color="#DC4A38"
                            style={{
                              width: "120px",
                              cursor: "pointer",
                              height: "26px",
                              padding: "1px 0px 0px 23px",
                              fontSize: "medium",
                            }}
                          >
                            Google
                          </Tag>
                        )}
                        buttonText="Login"
                        onSuccess={onFinish}
                        onFailure={(err) => {
                          console.error(err);
                          JNotification("เกิดข้อผิดพลาด", "โปรดติดต่อทีมพัฒนา");
                        }}
                        cookiePolicy={"single_host_origin"}
                      />
                    </Col>
                    <Col
                      span={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                        callback={onFinish}
                        render={(renderProps) => (
                          <Tag
                            onClick={renderProps.onClick}
                            icon={
                              <img
                                src={FacebookLogo}
                                style={{
                                  marginBottom: "4px",
                                  marginRight: "4px",
                                }}
                                height={16}
                              />
                            }
                            color="#3b5999"
                            style={{
                              width: "120px",
                              cursor: "pointer",
                              height: "26px",
                              padding: "1px 0px 0px 12px",
                              fontSize: "medium",
                            }}
                          >
                            Facebook
                          </Tag>
                        )}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[0, 24]} style={{ marginTop: "16px" }}>
                    <Col
                      span={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Tag
                        icon={<TwitterOutlined />}
                        color="#55acee"
                        style={{
                          width: "120px",
                          cursor: "pointer",
                          height: "26px",
                          padding: "1px 0px 0px 23px",
                          fontSize: "medium",
                        }}
                      >
                        Twitter
                      </Tag>
                    </Col>
                    <Col
                      span={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Tag
                        onClick={() => (window.location.href = lineLoginUrl)}
                        icon={
                          <img
                            width={22}
                            src={LineLogo}
                            style={{
                              marginBottom: "4px",
                              marginRight: "4px",
                            }}
                          />
                        }
                        color="#00B900"
                        style={{
                          width: "120px",
                          cursor: "pointer",
                          height: "26px",
                          padding: "1px 0px 0px 22px",
                          fontSize: "medium",
                        }}
                      >
                        Line
                      </Tag>
                    </Col>
                  </Row>
                </Form>
              </Spin>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
});

const LoginMobile = observer(() => {
  const { authStore } = useStore();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const lineLoginUrl = `${process.env.BASE_PATH}/server/line/login`;

  const onFinish = async (values) => {
    try {
      let credential = {};
      if (values.username && values.password) {
        credential.type = "web_support";
        credential.username = values.username;
        credential.password = values.password;
        credential.remember = values.remember;
      }

      if (values.googleId) {
        credential.type = "google";
        credential.token = values.tokenId;
      }

      if (values.graphDomain == "facebook") {
        credential.type = "facebook";
        credential.token = values.accessToken;
      }

      await authStore.login(credential);
    } catch (error) {
      console.error(error.response.data.message);
      JNotification(
        "เกิดข้อผิดพลาด",
        error.response.data.message
          ? error.response.data.message
          : "โปรดติดต่อผู้ดูแล"
      );
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <img
          src={WebsiteLogo}
          alt="logo-web"
          width={"440px"}
          height={"120px"}
        />
      </div>
      <Row justify="center" style={{ marginTop: "60px" }}>
        <Col span={24}>
          <Row justify={"center"}>
            <Col span={24}>
              <Card
                className="login-form"
                style={{ backgroundColor: "rgb(255 255 255 / 0%)" }}
              >
                <Spin
                  tip={t("Loading")}
                  spinning={
                    authStore.state === "pending"
                    // || masterStore.state === "pending"
                  }
                >
                  <Form
                    name="normal_login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    form={form}
                  >
                    <Row gutter={[0, 24]}>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Form.Item
                          name="username"
                          style={{ width: "90%" }}
                          rules={[
                            {
                              required: true,
                              message: t("Please input your Username!"),
                            },
                          ]}
                        >
                          <Input
                            className={"login-page"}
                            placeholder={t("Username")}
                            style={{
                              height: `80px`,
                              fontSize: "26px",
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Form.Item
                          name="password"
                          style={{ width: "90%" }}
                          rules={[
                            {
                              required: true,
                              message: t("Please input your Password!"),
                            },
                          ]}
                        >
                          <Input
                            type="password"
                            style={{
                              height: `80px`,
                              fontSize: "26px",
                            }}
                            placeholder={t("Password")}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Form.Item style={{ width: "90%" }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                              height: `80px`,
                              fontSize: `${Helper.JMPixel(16)}`,
                              fontStyle: "bold",
                              width: "100%",
                            }}
                          >
                            {t("LogIn")}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider
                      plain
                      style={{
                        color: "gray",
                        fontSize: `${Helper.JMPixel(12)}`,
                        fontStyle: "bold",
                      }}
                    >
                      {t("OrContinueWith")}
                    </Divider>
                    <Row gutter={[0, 24]}>
                      <Col
                        span={12}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <GoogleLogin
                          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                          render={(renderProps) => (
                            <Tag
                              onClick={renderProps.onClick}
                              disabled={renderProps.disabled}
                              color="#DC4A38"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: `${Helper.JMPixel(12)}`,
                                width: `${Helper.JMPixel(120)}`,
                                cursor: "pointer",
                                height: `${Helper.JMPixel(26)}`,
                              }}
                            >
                              Google
                            </Tag>
                          )}
                          buttonText="Login"
                          onSuccess={onFinish}
                          onFailure={(err) => {
                            console.error(err);
                            JNotification(
                              "เกิดข้อผิดพลาด",
                              "โปรดติดต่อทีมพัฒนา"
                            );
                          }}
                          cookiePolicy={"single_host_origin"}
                        />
                      </Col>
                      <Col
                        span={12}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FacebookLogin
                          appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                          callback={onFinish}
                          isMobile={false}
                          render={(renderProps) => (
                            <Tag
                              onClick={renderProps.onClick}
                              color="#3b5999"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: `${Helper.JMPixel(12)}`,
                                width: `${Helper.JMPixel(120)}`,
                                cursor: "pointer",
                                height: `${Helper.JMPixel(26)}`,
                              }}
                            >
                              Facebook
                            </Tag>
                          )}
                        />
                      </Col>
                    </Row>
                    <Row
                      gutter={[0, 24]}
                      style={{ marginTop: `${Helper.JMPixel(16)}` }}
                    >
                      <Col
                        span={12}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Tag
                          color="#55acee"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: `${Helper.JMPixel(120)}`,
                            cursor: "not-allowed",
                            height: `${Helper.JMPixel(26)}`,
                            fontSize: `${Helper.JMPixel(12)}`,
                          }}
                        >
                          Twitter
                        </Tag>
                      </Col>
                      <Col
                        span={12}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Tag
                          onClick={() => (window.location.href = lineLoginUrl)}
                          color="#00B900"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: `${Helper.JMPixel(120)}`,
                            cursor: "pointer",
                            height: `${Helper.JMPixel(26)}`,
                            fontSize: `${Helper.JMPixel(12)}`,
                          }}
                        >
                          Line
                        </Tag>
                      </Col>
                    </Row>
                  </Form>
                </Spin>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
});

const LoginPage = () => {
  return (
    <>
      <Responsive.Desktop>
        <LoginForm />
      </Responsive.Desktop>
      <Responsive.TabletOrMobile>
        <LoginMobile />
      </Responsive.TabletOrMobile>
    </>
  );
};

export default LoginPage;
