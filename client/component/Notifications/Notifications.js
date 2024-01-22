import React from "react";
import { observer } from "mobx-react";
import { useStores } from "@store";
import { Modal } from "antd";

export const Message = observer(() => {
  const { notificationStore } = useStores();
  return (
    <Modal
      zIndex={5000}
      title={notificationStore.messageTitle}
      visible={notificationStore.visible}
      closable
      destroyOnClose
      footer={null}
      onCancel={() => {
        notificationStore.setVisible(false);
      }}
    >
      {notificationStore.message}
    </Modal>
  );
});
