import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import {useStore} from "../../store/mobx/";
import { Spin } from "antd";

export const LoadingMaster = observer(() => {
  const { masterStore } = useStore();
  const Loading = styled.div`
    display: ${masterStore.isLoading ? "table" : "none"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  return (
    <Loading>
      <Spin size="large" />
    </Loading>
  );
});
