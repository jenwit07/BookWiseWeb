import React from "react";
import { TwitterOutlined } from "@ant-design/icons";
import { Tag } from "antd";

export const UserTypesTag = (props) => {
  switch (props.type) {
    case "web_support":
      return (
        <Tag
          color="#AA7B6F"
          style={{
            width: "100px",
            height: "22px",
            fontSize: "small",
            textAlign: "center",
          }}
          {...props}
        >
          Web
        </Tag>
      );
    case "google":
      return (
        <Tag
          color="#DC4A38"
          style={{
            width: "100px",
            height: "22px",
            fontSize: "small",
            textAlign: "center",
          }}
          {...props}
        >
          Google
        </Tag>
      );
    case "facebook":
      return (
        <Tag
          color="#3b5999"
          style={{
            width: "100px",
            height: "22px",
            fontSize: "small",
            textAlign: "center",
          }}
          {...props}
        >
          Facebook
        </Tag>
      );
    case "twitter":
      return (
        <Tag
          icon={<TwitterOutlined />}
          color="#55acee"
          style={{
            width: "100px",
            height: "22px",
            fontSize: "small",
            textAlign: "center",
          }}
          {...props}
        >
          Twitter
        </Tag>
      );
    case "line":
      return (
        <Tag
          color="#00B900"
          style={{
            width: "100px",
            height: "22px",
            fontSize: "small",
            textAlign: "center",
          }}
          {...props}
        >
          Line
        </Tag>
      );

    default:
      return "web_support";
  }
  return <></>;
};
