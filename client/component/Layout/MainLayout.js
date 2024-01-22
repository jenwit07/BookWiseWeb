import React, { useContext, useEffect } from "react";
import { Layout, Menu, Drawer, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { observer } from "mobx-react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { Context as MainDrawerContext } from "../../store/context/MainDrawerContext";
import { useStore } from "../../store/mobx";
import menuActions from "../../store/redux/actions/menuActions";
import LanguagePicker from "../LanguagePicker/LanguagePicker";
import UserMenu from "../UserMenu/UserMenu";
import SideNav from "./SideNav";
import MobileSideNav from "./MobileSideNav";

import { menuFiltered } from "../../menu";
import Responsive from "../../Common/Helper/Responsive";
import styled from "styled-components";
import Helper from "../../Common/Helper/Helper";
import WebLogo from "../../images/logo/wajito-backoffice.png";

const HoverHamburger = styled.div`
  height: 100%;
  padding-left: ${Helper.JMPixel(10)};
  padding-right: ${Helper.JMPixel(10)};
  :hover {
    background-color: #dee4e7;
    color: red;
    cursor: pointer;
`;

const SideBar = observer(() => {
  const { t } = useTranslation();
  const { authStore } = useStore();
  const menu = menuFiltered(t, authStore.permissions);
  const collapse = useSelector((state) => state.menuReducer.collapse);
  return (
    <Layout.Sider collapsible collapsed={collapse} trigger={null} width={260}>
      <div className={collapse ? "logo" : "logo-large"} />
      <SideNav menu={menu} theme={"dark"} />
    </Layout.Sider>
  );
});

const Header = observer(() => {
  const { layoutStore, authStore } = useStore();
  const collapse = useSelector((state) => state.menuReducer.collapse);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(menuActions.toggle(!collapse));
  };
  return (
    <Layout.Header
      style={{ background: "#fff", padding: 0, paddingLeft: 0, paddingTop: 0 }}
    >
      <Menu selectable={false} mode={"horizontal"}>
        <Menu.Item onClick={toggle} style={{ float: "left", fontSize: 16 }}>
          {React.createElement(
            collapse ? MenuUnfoldOutlined : MenuFoldOutlined
          )}
        </Menu.Item>
        <Menu.Item style={{ float: "right" }}>
          <UserMenu />
        </Menu.Item>
        <Menu.Item style={{ float: "right" }}>
          <LanguagePicker />
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
});

const HeaderSmallScreen = observer(() => {
  const { layoutStore } = useStore();

  const toggle = () => {
    layoutStore.setSiderSmallFlag(true);
  };

  return (
    <div
      className={"header-bar"}
      style={{
        overflow: "hidden",
        padding: 0,
        paddingLeft: 0,
        paddingTop: 0,
      }}
    >
      <div
        className={"header-bar"}
        style={{
          overflow: "hidden",
          padding: 0,
          paddingLeft: 0,
          paddingTop: 0,
        }}
      >
        <div
          className={"hamburger-font"}
          style={{
            float: "left",
            fontSize: Helper.JMPixel(16),
            height: "100%",
          }}
        >
          <HoverHamburger className={"hamburger"} onClick={toggle}>
            <MenuOutlined
              style={{
                cursor: "pointer",
              }}
            />
          </HoverHamburger>
        </div>
        <div
          style={{ float: "right", backgroundColor: "blue", height: "100%" }}
        >
          <UserMenu />
        </div>
      </div>
    </div>
  );
});

const MainDrawer = ({ Component, ...rest }) => {
  const { state, setVisibility } = useContext(MainDrawerContext);

  useEffect(() => {}, [state.component]);

  return (
    state.component && (
      <Drawer
        destroyOnClose
        visible={state.visibility}
        width={640}
        title={state.title}
        placement="right"
        closable={true}
        onClose={() => setVisibility(false)}
        {...rest}
      >
        {React.createElement(state.component)}
      </Drawer>
    )
  );
};

const SideBarSmall = observer(() => {
  const { t } = useTranslation();
  const { authStore, layoutStore } = useStore();
  const menu = menuFiltered(t, authStore.permissions);

  const hideMenu = () => {
    layoutStore.setSiderSmallFlag(false);
  };

  return (
    <Drawer
      placement={"left"}
      maskClosable={true}
      closable={false}
      onClose={hideMenu}
      visible={layoutStore.siderSmallFlag}
      key={"smallMenu"}
      width={Helper.JMPixel(200)}
      bodyStyle={{
        flexGrow: 1,
        padding: "0px",
        overflow: "auto",
        fontSize: "14px",
        lineHeight: 1.5715,
        wordWrap: "break-word",
        backgroundColor: "#001529",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: Helper.JMPixel(42),
          background: `rgb(255, 255, 255)`,
          backgroundSize: `auto ${Helper.JMPixel(90)}`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          alignItems: "center"
        }}
      >
        <img height={Helper.JMPixel(26)} alt="logo" src={WebLogo} />
      </div>
      <MobileSideNav menu={menu} theme={"dark"} />
    </Drawer>
  );
});

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ width: "auto", minHeight: "100vh" }}>
      <Responsive.Desktop>
        <SideBar />
      </Responsive.Desktop>
      <Layout>
        <Responsive.Desktop>
          <Header />
        </Responsive.Desktop>
        <Responsive.TabletOrMobile>
          <HeaderSmallScreen />
        </Responsive.TabletOrMobile>
        <Responsive.TabletOrMobile>
          <SideBarSmall />
        </Responsive.TabletOrMobile>
        <MainDrawer />
        {Array.isArray(children) ? (
          <Layout.Content
            style={{
              margin: Helper.JMPixel(16) + " " + Helper.JMPixel(16),
            }}
          >
            <div
              style={{ padding: Helper.JMPixel(8) + " " + Helper.JMPixel(8) }}
            >
              {children.map((e) => e)}
            </div>
          </Layout.Content>
        ) : (
          <Layout.Content
            style={{
              margin: Helper.JMPixel(16) + " " + Helper.JMPixel(16),
              background: "rgb(258,412,286)",
              minHeight: Helper.JMPixel(280),
            }}
          >
            <div
              style={{ padding: Helper.JMPixel(8) + " " + Helper.JMPixel(8) }}
            >
              {children}
            </div>
          </Layout.Content>
        )}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
