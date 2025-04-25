import { PlusOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import { getUserAPI } from "@/services/api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const columns: ProColumns<IUserTable>[] = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "_id",
    dataIndex: "_id",
    render: (_, record) => {
      return <a href="#">{record._id}</a>;
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
  },
  {
    title: "Action",
    render: () => (
      <div style={{ display: "Flex", gap: "20px" }}>
        <EditOutlined style={{ cursor: "pointer", color: "orange" }} />
        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
      </div>
    ),
  },
];

const TableUser = () => {
  const actionRef = useRef<IUserTable>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  return (
    <>
      <ProTable<IUserTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log("check params", params); // const data = await (await fetch('https://proapi.azurewebsites.net/github/issues')).json()
          const res = await getUserAPI(
            params?.current ?? 1,
            params?.pageSize ?? 5
          );
          if (res.data) {
            setMeta(res.data.meta);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
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
              actionRef.current?.reload();
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
