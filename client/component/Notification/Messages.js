import React from "react";
import {observer} from 'mobx-react'
import {useStore} from "../../store/mobx/";
import { Modal} from 'antd';
import {useTranslation} from "react-i18next";

export const Message = observer(() => {
    const {notificationStore} = useStore();
    const {t} = useTranslation();
    return (
        <Modal
            zIndex={5000}
            title={t(notificationStore.messageTitle)}
            visible={notificationStore.visible}
            closable
            destroyOnClose
            footer={null}
            onCancel={() => {
                notificationStore.setVisible(false)
            }}
        >
            {notificationStore.message}
        </Modal>)
});
