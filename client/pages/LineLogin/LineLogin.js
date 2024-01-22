import React, { useCallback, useEffect } from "react";
import { Row, Spin, Card, Col } from "antd";
import { useTranslation } from "react-i18next";
import { JNotification } from "../../component/JNotification/JNotification";
import axios from "axios";
import { useStore } from "@stores";
import { observer } from "mobx-react";

const LineLoginPage = observer(() => {
  const { authStore } = useStore();

  const FetchData = useCallback(async () => {
    try {
      let { data } = await axios.get(
        `${process.env.BASE_PATH}/server/line/success`
      );

      let { email, token, pictureUrl, ...rest } = data;
      let credential = {
        type: "line",
        email: email,
        token: token,
        picture: pictureUrl,
      };

      await authStore.login(credential);
      console.log("%c⧭", "color: #030505", credential);
    } catch (error) {
      console.error(error.response.data.message);
      JNotification(
        "เกิดข้อผิดพลาด",
        error.response.data.message ? error.response.data.message : "โปรดติดต่อผู้ดูแล"
      );
    }
  }, []);

  useEffect(() => {
    FetchData();
  }, [FetchData]);
  const { t } = useTranslation();

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Col span={24}>
        <Row gutter={[0, 0]} justify="center" style={{ display: "flex" }}>
          <Col span={6}>
            <div className={"logo-large"}></div>
          </Col>
        </Row>
        <Row gutter={[0, 0]} justify="center" style={{ display: "flex" }}>
          <Col span={6}>
            <Card
              className="login-form"
              style={{ backgroundColor: "rgb(255 255 255 / 100%)" }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spin tip={t("Loading")} spinning={true}></Spin>
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
});

export default LineLoginPage;
