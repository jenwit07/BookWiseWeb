import React, { useState } from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import Helper from "../../Common/Helper/Helper";
import Icon, { CaretRightOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { useStore } from "@stores";
const { SubMenu } = Menu;

const SideNav = observer((props) => {
  const { layoutStore } = useStore();
  const history = useHistory();
  const openKeys = history.location.pathname.split("/").filter((i) => i);
  const selectedKeys = [openKeys[openKeys.length - 1]];

  return (
    <Menu
      theme={props.theme}
      mode="inline"
      defaultOpenKeys={openKeys}
      defaultSelectedKeys={selectedKeys}
      expandIcon={<div />}
      {...props}
    >
      {props.menu.map((item) => {
        if (item.items) {
          return (
            <SubMenu
              style={{
                marginTop: Helper.JMPixel(8),
                fontSize: Helper.JMPixel(12),
                height: Helper.JMPixel(30),
                lineHeight: Helper.JMPixel(30),
              }}
              key={item.name}
              title={<span>{item.label}</span>}
            >
              {item.items ? (
                item.items.map((sub_item, i) => (
                  <Menu.Item
                    style={{
                      fontSize: Helper.JMPixel(12),
                      height: Helper.JMPixel(30),
                      lineHeight: Helper.JMPixel(30),
                    }}
                    key={sub_item.name}
                    onClick={() => {
                      layoutStore.setSiderSmallFlag(false);
                      history.push(sub_item.path);
                    }}
                  >
                    <span>{sub_item.label}</span>
                  </Menu.Item>
                ))
              ) : (
                <></>
              )}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={item.key}
              style={{
                fontSize: Helper.JMPixel(12),
                height: Helper.JMPixel(40),
                lineHeight: Helper.JMPixel(40),
              }}
              onClick={() => {
                layoutStore.setSiderSmallFlag(false);
                history.push(item.path);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );
});

export default SideNav;
