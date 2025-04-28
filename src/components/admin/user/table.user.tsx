import { PlusOutlined } from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import { getUserAPI } from "@/services/api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { dateRangeValidate } from "@/services/helper";
import ViewUser from "./view.user";
import dayjs from "dayjs";
import { FORMATE_DATE } from "@/services/helper";
import CreateUser from "./create.user";

type Tsearch = {
  fullName: string;
  email: string;
  createAtRange: string;
  updateAt: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [isModalCreateUser, setIsModalCreateUser] = useState(false);
  const [dataView, setDataView] = useState<IUserTable>();
  const [isViewUser, setIsViewUser] = useState(false);
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "_id",
      dataIndex: "_id",
      hideInSearch: true,
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              setIsViewUser(true);
              setDataView(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
      render: (_, record) => {
        return <>{dayjs(record.createdAt).format(FORMATE_DATE)}</>;
      },
      valueType: "dateRange",
    },
    {
      title: "Action",
      render: () => (
        <div style={{ display: "Flex", gap: "20px" }}>
          <EditOutlined style={{ cursor: "pointer", color: "orange" }} />
          <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
        </div>
      ),
      hideInSearch: true,
    },
  ];
  const refreshTable = () => {
    actionRef.current?.reload();
  };
  return (
    <>
      <CreateUser
        refreshTable={refreshTable}
        isModalCreateUser={isModalCreateUser}
        setIsModalCreateUser={setIsModalCreateUser}
      />
      <ViewUser
        isViewUser={isViewUser}
        setIsViewUser={setIsViewUser}
        dataView={dataView}
        setDataView={setDataView}
      />
      <ProTable<IUserTable, Tsearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          console.log("check sort", sort); // const data = await (await fetch('https://proapi.azurewebsites.net/github/issues')).json()
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            console.log("check 1", query);
            if (params.email) {
              query += `&email=/${params.email}/i`;
              console.log("check 2", query);
            }
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }
            const createDateRange = dateRangeValidate(params.createAtRange);
            if (createDateRange) {
              query += `&createAt>=${createDateRange[0]}&createAt<=${createDateRange[1]}`;
            }
          }
          // defaut
          query += `&sort=-createAt`;
          if (sort && sort.createAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createAt" : "-createAt"
            }`;
          }
          console.log("check final querystring", query);
          const res = await getUserAPI(query);
          console.log("check res", res);
          if (res.data) {
            setMeta(res.data.meta);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: 0,
          };
        }}
        rowKey="id"
        pagination={{
          total: meta.total,
          defaultCurrent: meta.current,
          defaultPageSize: meta.pageSize,
          showSizeChanger: true,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} of {total} items
              </div>
            );
          },
        }}
        dateFormatter="string"
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalCreateUser(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
    </>
  );
};

export default TableUser;
