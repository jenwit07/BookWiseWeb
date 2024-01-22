import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import { observer } from "mobx-react";
import i18n from "./i18n";
import { useStore } from "@stores";
import Routes from "@routers";
import { Message } from "@components/Notification/Messages";
import { Helmet } from "react-helmet";

export default observer(() => {
  const localeReducer = useSelector((state) => state.localeReducer);
  const { authStore, layoutStore } = useStore();
  const locale = i18n.Locales[localeReducer.locale];
  const [ready, setReady] = useState(false);

  //load session data if browser is reloaded
  useEffect(() => {
    // Using an IIFE
    (async () => {
      await authStore.getSession();
      setReady(true);
    })();
  }, []);

  //only render if session data are loaded
  return (
    ready && (
      <ConfigProvider locale={locale}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>WAJITO :: {layoutStore.pageTitle}</title>
        </Helmet>
        <Routes />
        <Message />
      </ConfigProvider>
    )
  );
});
