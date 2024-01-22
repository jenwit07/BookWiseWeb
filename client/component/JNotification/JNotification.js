import { notification } from "antd";

export const JNotification = (
  title = "title",
  desc = "desc",
  type = "error"
) => {
  notification[type]({
    placement: "topLeft",
    duration: 4.5,
    message: title,
    description: desc,
  });
};
