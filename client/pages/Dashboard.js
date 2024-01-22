import React, { useEffect } from "react";
import { Button } from "antd";
import { C3POTable } from "r2d2";
import { anakinApi } from "@api";
import { useStore } from "../store/mobx";
import { observer } from "mobx-react";

const Dashboard = observer(() => {
  const { authStore } = useStore();
  const fetchAllBook = async () => {
    const { data } = await anakinApi().get("/books");
    console.log(data)
  };

  return (
    <div>
      <Button onClick={() => fetchAllBook()}>Click</Button>
      <C3POTable />
    </div>
  );
});
export default Dashboard;
