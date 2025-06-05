import { fetchOrder } from "@/services/api";
import { FORMATE_DATE } from "@/services/helper";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import OrderView from "./view.order";

type Tsearch = {
  name: string;
  address: string;
};

const TableOrder = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [isOrderDetail, setIsOrderDetail] = useState<boolean>(false);
  const [dataView, setDataView] = useState<IOrderTable | null>(null);
  const columns: ProColumns<IOrderTable>[] = [
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
              setIsOrderDetail(true);
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
      dataIndex: "name",
    },
    {
      title: "address",
      dataIndex: "address",
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
  ];
  return (
    <>
      <OrderView
        isOrderDetail={isOrderDetail}
        setIsOrderDetail={setIsOrderDetail}
        dataView={dataView}
        setDataView={setDataView}
      />
      <ProTable<IOrderTable, Tsearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.name) {
              query += `&name=/${params.name}/i`;
            }
            if (params.address) {
              query += `&address=/${params.address}/i`;
            }
          }

          // defaut
          const res = await fetchOrder(query);
          if (res && res.data) {
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
        headerTitle="Table Order"
      />
    </>
  );
};
export default TableOrder;
