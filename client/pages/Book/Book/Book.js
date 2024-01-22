import React, { useEffect, useState, useCallback } from "react";
import { C3POTable } from "r2d2";
import { useStore } from "@stores"; // using store for i18n
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Descriptions, Row, Col, Button, Select } from "antd";
import axios from "axios";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import ApprovalCIschema from "./JSONforms/CIapprovalSchema.json";
import ApprovalUIschema from "./JSONforms/UIapprovalSchema.json";
import ChangeStatusSchema from "./JSONforms/UichangeStatus.json";
import { statusTester, StatusForm } from "./JSONForms/StatusRender.js";
import {
  SaveOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { toJS } from "mobx";
import dayjs from "dayjs";

const statusItems = [
  {
    status: "PENDING",
    key: "PENDING2",
    color: "#FFF2CC",
  },
  {
    status: "APPROVED",
    key: "APPROVED2",
    color: "#C6E0B4",
  },
  {
    status: "REJECTED",
    key: "REJECTED2",
    color: "#F4B084",
  },
  {
    status: "RECHECK",
    key: "RECHECK2",
    color: "orange",
  },
  {
    status: "ERROR",
    key: "ERROR2",
    color: "#D9D9D9",
  },
];

const mapColorWithStatus = (_status) => {
  let result = statusItems.find(({ status }) => status === _status);
  return result.color;
};

const ApprovalPage = observer(() => {
  const { localeStore } = useStore();
  const { t } = useTranslation();

  const ChangeStatus = ({ mode, key, close, saveHandler, getHandler }) => {
    const [recordUpdate, setRecordUpdate] = useState({});
    const [recordShow, setRecordShow] = useState({});
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);

      let { book_title, author_signatures, ...rest } = _record[0];

      console.log(_record[0])
      console.log(rest)

      setRecordShow({
        book_title,
        author_signatures,
      });

      setRecordUpdate({ ...rest });
      setIsDone(true);
    }, [getHandler, key]);

    const renderers = [
      ...materialRenderers,
      { tester: statusTester, renderer: StatusForm },
    ];

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    return (
      isDone && (
        <div>
          <Descriptions
            bordered
            key={"isbn"}
            column={2}
            size={"small"}
            style={{ paddingBlock: "18px" }}
          >
            <Descriptions.Item
              bordered
              label={t("book_title")}
              key={key}
              labelStyle={{ fontWeight: "600" }}
              span={1}
              style={{
                border: "1px solid lightgray",
                borderSpacing: "1px 1px",
              }}
            >
              {t(recordShow["book_title"])}
            </Descriptions.Item>
            <Descriptions.Item
              bordered
              label={t("author_signatures")}
              key={key}
              labelStyle={{ fontWeight: "600" }}
              span={1}
              style={{
                border: "1px solid lightgray",
                borderSpacing: "1px 1px",
              }}
            >
              {t(recordShow["author_signatures"])}
            </Descriptions.Item>
          </Descriptions>
          <JsonForms
            schema={ApprovalCIschema}
            uischema={ChangeStatusSchema}
            data={recordUpdate}
            renderers={renderers}
            cells={materialCells}
            onChange={({ errors, data }) => setRecordUpdate(data)}
          />
          <Row justify={"end"} style={{ paddingTop: "18px" }}>
            <Col style={{ marginRight: "18px" }}>
              <Button htmlType="button" onClick={close}>
                {" "}
                {t("Cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => console.log({ ...recordShow, ...recordUpdate })}
                icon={<SaveOutlined />}
              >
                {" "}
                {t("Save")}{" "}
              </Button>
            </Col>
          </Row>
        </div>
      )
    );
  };

  const Edit = ({ mode, key, close, saveHandler, getHandler }) => {
    const [recordUpdate, setRecordUpdate] = useState({});
    const [recordShow, setRecordShow] = useState({});
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);

      let {
        book_title,
        book_desc,
        author_prices_request,
        status,
        book_payload,
        active_flag,
        ...rest
      } = _record[0];

      author_prices_request = parseFloat(author_prices_request)

      setRecordUpdate({
        book_title,
        book_desc,
        author_prices_request,
        status,
      });

      setRecordShow({ ...rest });
      setIsDone(true);
    }, [getHandler, key]);

    const renderers = [
      ...materialRenderers,
      //register custom renderers
      { tester: statusTester, renderer: StatusForm },
    ];

    const ShowData = React.useMemo(
      () => (
        <Descriptions
          bordered
          key={"isbn"}
          column={2}
          size={"small"}
          style={{ paddingBlock: "18px" }}
        >
          {Object.keys(recordShow).map(function (key) {
            return (
              <Descriptions.Item
                bordered
                label={t(key)}
                key={key}
                labelStyle={{ fontWeight: "600" }}
                span={1}
                style={{
                  border: "1px solid lightgray",
                  borderSpacing: "1px 1px",
                }}
              >
                {t(recordShow[key].toString())}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      ),
      [recordShow]
    );

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    return (
      isDone && (
        <div>
          {ShowData}
          <JsonForms
            schema={ApprovalCIschema}
            uischema={ApprovalUIschema}
            data={recordUpdate}
            renderers={renderers}
            cells={materialCells}
            onChange={({ errors, data }) => setRecordUpdate(data)}
          />
          <Row justify={"end"} align={"bottom"} style={{ paddingTop: "18px" }}>
            <Col style={{ marginRight: "18px" }}>
              <Button htmlType="button" onClick={close}>
                {" "}
                {t("Cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => saveHandler({ ...recordUpdate, ...recordShow })}
                icon={<SaveOutlined />}
              >
                {" "}
                {t("Save")}{" "}
              </Button>
            </Col>
          </Row>
        </div>
      )
    );
  };

  const Delete = ({ mode, key, close, saveHandler, getHandler }) => {
    const [recordUpdate, setRecordUpdate] = useState({});
    const [isDone, setIsDone] = useState(false);
    const FetchData = useCallback(async () => {
      let _record = await getHandler(key);

      let { active_flag, ...rest } = _record[0];

      // Set Active Flag to "N"
      setRecordUpdate({ active_flag: "N", ...rest });
      setIsDone(true);
    }, [getHandler, key]);

    const ShowData = () => (
      <Descriptions
        bordered
        key={"isbn"}
        column={2}
        size={"small"}
        style={{ paddingBlock: "18px" }}
      >
        <Descriptions.Item
          bordered
          label={t("book_title")}
          key={key}
          labelStyle={{ fontWeight: "600" }}
          span={1}
          style={{
            border: "1px solid lightgray",
            borderSpacing: "1px 1px",
          }}
        >
          {t(recordUpdate["book_title"])}
        </Descriptions.Item>
        <Descriptions.Item
          bordered
          label={t("author_signatures")}
          key={key}
          labelStyle={{ fontWeight: "600" }}
          span={1}
          style={{
            border: "1px solid lightgray",
            borderSpacing: "1px 1px",
          }}
        >
          {t(recordUpdate["author_signatures"])}
        </Descriptions.Item>
      </Descriptions>
    );

    useEffect(() => {
      FetchData();
    }, [FetchData]);

    return (
      isDone && (
        <div>
          <Row justify={"center"}>
            <Col>
              <h2>{t("Would you like really delete this record ?")}</h2>
            </Col>
          </Row>
          <ShowData />
          <Row justify={"end"} align={"bottom"}>
            <Col style={{ marginRight: "18px" }}>
              <Button htmlType="button" onClick={close}>
                {" "}
                {t("Cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                type="danger"
                onClick={() => saveHandler({ ...recordUpdate })}
                icon={<DeleteOutlined />}
              >
                {" "}
                {t("Delete")}{" "}
              </Button>
            </Col>
          </Row>
        </div>
      )
    );
  };

  const approvalBooksColumn = [
    {
      title: t("ISBN"),
      dataIndex: "isbn",
      key: "isbn",
      search_params: "isbn",
    },
    {
      title: t("Author ID"),
      dataIndex: "author_id",
      key: "author_id",
      search_params: "author_id",
    },
    {
      title: t("Author Signature"),
      dataIndex: "author_signatures",
      key: "author_signature",
      search_params: "author_signature",
    },
    {
      title: t("Book Title"),
      dataIndex: "book_title",
      key: "book_title",
      search_params: "book_title",
    },
    {
      title: t("Date of Request"),
      dataIndex: "date_of_request",
      key: "date_of_request",
      search_params: "date_of_request",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontWeight: "400",
              backgroundColor: mapColorWithStatus(record),
              width: "90%",
              paddingInline: "20px",
              display: "flex",
              justifySelf: "center",
              justifyContent: "center",
              border: "1px dashed black",
              borderRadius: "8px",
            }}
          >
            {t(record)}
          </div>
        </div>
      ),
    },
    {
      title: t("Options"),
      width: "120px",
      action: [
        {
          type: "read",
          text: t("Read"),
          view: "modal",
          title: "Read Book",
          width: "70%",
        },
        {
          type: "update-status",
          text: t("Change Status"),
          view: "modal",
          component: <ChangeStatus mode={"update-status"} />,
          title: t("Update Book Status"),
          width: "40%",
        },
        {
          type: "edit",
          text: t("Edit"),
          view: "modal",
          component: <Edit mode={"edit"} />,
          title: t("Edit Book Information"),
          width: "70%",
        },
        {
          type: "delete",
          text: t("Delete"),
          view: "modal",
          component: <Delete mode={"delete"} />,
          title: t("Delete Book Record"),
        },
      ],
    },
  ];

  const approvalBooksExpandable = [
    {
      title: t("Book Description"),
      dataIndex: "book_desc",
      key: "book_desc",
      span: 4,
    },
    {
      title: t("Author Name"),
      dataIndex: ["author", "author_name"],
      key: "author_name",
    },
    {
      title: t("Customer ID"),
      dataIndex: ["author", "customer_id"],
      key: "customer_id",
    },
    {
      title: t("Create Date"),
      dataIndex: "create_date",
      key: "create_date",
    },
    {
      title: t("Create By"),
      dataIndex: "create_by",
      key: "create_by",
    },
    {
      title: t("Update Date"),
      dataIndex: "update_date",
      key: "update_date",
    },
    {
      title: t("Update By"),
      dataIndex: "update_by",
      key: "update_by",
    },
  ];

  const fetchBookRequest = async (cur_page = 1, per_page = 10, params = {}) => {
    let totalPage;
    let totalItems;

    let { data } = await axios.get(`http://34.87.107.88:3306/v1/books`, {
      params: {
        cur_page: cur_page,
        per_page: per_page,
        ...params,
      },
    });

    console.log(data)

    let items = data.data.map((e) => {
      let { author, ...rest } = e;
      return { ...rest, ...author };
    });

    return {
      total_items: items,
      total_pages: data.page_all,
      per_pages: data.per_page,
      cur_pages: data.cur_page,
      data: items,
    };
  };

  const getRecordHandler = async (key) => {
    let { data } = await axios.get(`http://34.87.107.88:3306/v1/books`, {
      params: {
        isbn: key,
      },
    });

    console.log(data)

    let items = data.data.map((e) => {
      let { author, ...rest } = e;
      return { ...rest, ...author };
    });

    return items;
  };

  const changeStatusHandler = async (record) => {
    console.log("changeStatusHandler");
    console.log(record);
    return record;
  };

  const updateRecordHandler = async (record) => {
    console.log("updateRecordHandler");
    console.log(record);
    return record;
  };

  const deleteRecordHandler = async (record) => {
    console.log("updateRecordHandler");
    console.log(record);
    return record;
  };

  const bulkActionHandler = async (records, action) => {
    console.log("bulkActionHandler");
    console.log(action);
    console.log(toJS(records));
    return records;
  };

  const StatusPicker = ({ saveHandler, onUpdateValue = null, onClear }) => {
    return (
      <Select
        key={"SelectStatus"}
        style={{ width: "180px" }}
        value={onUpdateValue}
        onChange={(val) => saveHandler(val)}
        placeholder={t("Select a Status")}
        onClear={onClear}
        allowClear
      >
        {statusItems.map((e, i) => (
          <Select.Option value={e.status} key={e.status + i}>
            {t(e.status)}
          </Select.Option>
        ))}
      </Select>
    );
  };

  // ###
  return (
    <div>
      <C3POTable
        fetchData={fetchBookRequest}
        columns={approvalBooksColumn}
        expandableRows={approvalBooksExpandable}
        perPage={10}
        rowKey={"isbn"}
        // scrollAuto
        bordered
        rowSelect={true}
        // tableLayout={"fixed"}
        actionComponent={"dropdown"}
        dropdownText={"Actions"}
        primaryKey={(record) => {
          const { isbn } = record;
          return isbn;
        }}
        bulkAction={{
          ButtonName: t("Bulk Action"),
          options: [
            {
              value: "update-status",
              label: t("Change Status"),
              icon: SaveOutlined,
              disabled: false,
            },
            {
              value: "delete",
              label: t("Delete"),
              icon: DeleteOutlined,
              disabled: false,
            },
          ],
        }}
        // queryHeader type: options / datepicker / button
        queryHeader={[
          {
            type: "button",
            label: t("Today Request"),
            queryParams: { date_of_request: dayjs().format("YYYY-MM-DD") },
            icon: CalendarOutlined,
          },
          {
            type: "options",
            component: StatusPicker,
            label: t("book_status"),
            params: "status",
            key: "status",
          },
        ]}
        statusRecord={changeStatusHandler}
        getRecord={getRecordHandler}
        updateRecord={updateRecordHandler}
        readRecord={changeStatusHandler}
        deleteRecord={deleteRecordHandler}
        bulkActionRecord={bulkActionHandler}
      />
    </div>
  );
});

export default ApprovalPage;
