import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Menu } from "antd";
import {
  LogoutOutlined,
  SmileTwoTone,
  UserOutlined,
  LogoutTwoTone,
} from "@ant-design/icons";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { green } from "@ant-design/colors";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { serverApi } from "@api";
import { useStore } from "../../store/mobx";
import { Context as MainDrawerContext } from "../../store/context/MainDrawerContext";
import UserProfile from "../UserProfile/UserProfile";
import "./UserMenu.less";
import Avatar from "antd/lib/avatar/avatar";
import Helper from "../../Common/Helper/Helper";
import UserIcon from "../../images/default-avatar.png";

const { SubMenu } = Menu;

const UserMenu = observer(() => {
  const { t } = useTranslation();
  const { authStore } = useStore();
  const history = useHistory();
  const { setVisibility, setComponent, setTitle } = useContext(
    MainDrawerContext
  );

  const handleClick = async (data) => {
    if (data.key === "logout") {
      //clear session on server
      await serverApi().post("/logout");
      //reload browser window
      window.location.href = "/";
    } else if (data.key === "profile") {
      setComponent(() => <UserProfile onClose={() => setVisibility(false)} />);
      setTitle(t("User Profile"));
      setVisibility(true);
    }
  };

  const UserIdentify = () => {
    if (authStore.session.type == "google") {
      return (
        <>
          {t("email")} : {authStore.session.email}
        </>
      );
    }
    if (authStore.session.type == "facebook") {
      return (
        <>
          {t("email")} : {authStore.session.email}
        </>
      );
    }
    if (authStore.session.type == "line") {
      return (
        <>
          {t("email")} : {authStore.session.email}
        </>
      );
    }

    return (
      <>
        {t("user")} : {authStore.session.username}
      </>
    );
  };

  return (
    <Menu
      key="user_profile"
      onClick={handleClick}
      mode="horizontal"
      style={{ border: "none", height: "100%" }}
      className={"user-menu"}
      selectable={false}
    >
      <SubMenu
        className={"user-icon-padding"}
        style={{ border: "none" }}
        title={
          <span>
            {authStore.session.picture ? (
              <Avatar
                className={"jen-user-icon"}
                src={authStore.session.picture}
              />
            ) : (
              <Avatar className={"jen-user-icon"} src={UserIcon} />
            )}
          </span>
        }
      >
        <Menu.Item
          style={{
            display: "flex",
            verticalAlign: "middle",
            justifyContent: "center",
            fontSize: Helper.JMPixel(10),
            cursor: "default",
            height: Helper.JMPixel(30),
            lineHeight: Helper.JMPixel(30),
          }}
          key={"logout"}
        >
          <div>{t("Logout")}</div>
        </Menu.Item>
        <Menu.Item
          style={{
            textAlign: "center",
            fontSize: Helper.JMPixel(10),
            color: "gray",
            borderTop: Helper.JMPixel(1) + ` dashed rgb(212, 212, 212)`,
            cursor: "default",
            height: Helper.JMPixel(30),
            lineHeight: Helper.JMPixel(30),
          }}
          key={"username"}
        >
          <UserIdentify />
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
});

export default UserMenu;
