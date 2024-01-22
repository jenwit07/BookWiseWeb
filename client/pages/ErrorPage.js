import React, { useState, useEffect } from "react";
import { Button, Result } from "antd";
import { useTranslation, Trans } from "react-i18next";
import { useHistory, Redirect } from "react-router-dom";
import { useStore } from "@stores";
import { serverApi } from "@api";

const ErrorPage = (props) => {
  // const { authStore } = useStore();
  const history = useHistory();
  // const [isLogout, setIsLogout] = useState(false);
  const [renderButton, setRenderButton] = useState([]);
  const { t } = useTranslation();

  let subTitle;
  let status;

  switch (props.status) {
    case 403:
      subTitle = t(
        "Sorry, Please contact admin for assign role, you are not authorized to access this page"
      );
      status = props.status;
      break;
    case 404:
      subTitle = t("Sorry, the page you visited does not exist.");
      status = props.status;
      break;
    default:
      subTitle = t("Sorry, the server is wrong.");
      status = 500;
  }

  return (
    <Result
      status={status}
      title={status}
      subTitle={subTitle}
      extra={
        <div>
          <Button
            onClick={() => history.push("/")}
            type="primary"
            style={{ display: props.status == 403 ? "none" : "inline" }}
          >
            {t("Back to Home")}
          </Button>
          <Button
            style={{
              marginLeft: "12px",
              display: props.status == 404 ? "none" : "inline",
            }}
            onClick={async () => {
              //clear session on server
              await serverApi().post("/logout");
              //reload browser window
              window.location.href = "/";
            }}
            type="primary"
          >
            {t("Logout")}
          </Button>
        </div>
      }
    />
  );
};
export default ErrorPage;
