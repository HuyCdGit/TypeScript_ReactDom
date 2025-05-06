import { FORMATE_DATE, toVND } from "@/services/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import type { PopconfirmProps } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { getBookAPI } from "@/services/api";
import ViewBookDetail from "./view.book";
type Tsearch = {
  mainText: string;
  author: string;
};
const TableBook = () => {
  const [openViewBookDetail, setOpenViewBookDetail] = useState(false);
  const [viewBook, setViewBook] = useState<IBookTable | null>(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const actionRef = useRef<ActionType>();
  const cancel: PopconfirmProps["onCancel"] = () => {};

  const columns: ProColumns<IBookTable>[] = [
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
              setOpenViewBookDetail(true);
              setViewBook(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      render: (_, record) => {
        return <>{toVND(record.price)}</>;
      },
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
          <EditOutlined
            style={{ cursor: "pointer", color: "orange" }}
            onClick={() => {
              //   setIsModalUpdateUser(true);
              //   setDataView(record);
            }}
          />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={async () => {
              //   await deleteUser(record._id);
            }}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{ cursor: "pointer", color: "red" }}
              onClick={async () => {}}
            />
          </Popconfirm>
        </div>
      ),
      hideInSearch: true,
    },
  ];
  return (
    <>
      <ViewBookDetail
        openViewBookDetail={openViewBookDetail}
        setOpenViewBookDetail={setOpenViewBookDetail}
        viewBook={viewBook}
        setViewBook={setViewBook}
      />
      <ProTable<IBookTable, Tsearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.mainText) {
              query += `&mainText=/${params.mainText}/i`;
            }
            if (params.author) {
              query += `&author=/${params.author}/i`;
            }
            // const createDateRange = dateRangeValidate(params.createAtRange);
            // if (createDateRange) {
            //   query += `&createAt>=${createDateRange[0]}&createAt<=${createDateRange[1]}`;
            // }
          }
          // defaut

          if (sort && sort.createAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createAt" : "-createAt"
            }`;
          } else {
            query += `&sort=-createAt`;
          }
          const res = await getBookAPI(query);
          if (res.data) {
            setMeta(res.data.meta);
            // setDataExport(res.data?.result ?? []);
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
          //   <CSVLink
          //     data={dataExport}
          //     filename={"my-file.csv"}
          //     className="btn btn-primary"
          //     target="_blank"
          //   >
          //     <Button key="button" icon={<PlusOutlined />} type="primary">
          //       Export
          //     </Button>
          //   </CSVLink>,

          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              //   setIsOpenImport(true);
            }}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              //   setIsModalCreateUser(true);
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

export default TableBook;
