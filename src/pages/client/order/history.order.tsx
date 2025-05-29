import { fetchHistory } from "@/services/api";
import { FORMATE_DATE, toVND } from "@/services/helper";
import { Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ViewHistory from "./viewHistory.order";

const HistoryOrder = () => {
  const [viewHistory, setViewHistory] = useState<IHistory[] | []>([]);
  const [isHistory, setIsHistory] = useState<boolean>(false);
  const [dataHistory, setDataHistory] = useState<IHistory | null>(null);

  const columns: TableProps<IHistory>["columns"] = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, record, index) => {
        return (index = index + 1);
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (item, record, index) => {
        return dayjs(item).format(FORMATE_DATE);
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      render: (item, record, index) => {
        console.log(item);
        return toVND(item || 0);
      },
    },
    {
      title: "Trang thái",
      dataIndex: "type",
      key: "type",
      render: (_, record) => {
        const color = "green";
        // return console.log("check type", record);s
        return <Tag color={color}>Thành công</Tag>;
      },
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                setIsHistory(true);
                setDataHistory(record);
              }}
            >
              Xem chi tiết
            </a>
          </>
        );
      },
    },
  ];
  console.log("check record", dataHistory);
  useEffect(() => {
    const fetchHistoryAPI = async () => {
      const res = await fetchHistory();
      if (res && res.data) {
        setViewHistory(res.data);
      }
    };
    fetchHistoryAPI();
  }, []);
  return (
    <>
      <ViewHistory
        isHistory={isHistory}
        setIsHistory={setIsHistory}
        dataHistory={dataHistory}
        setDataHistory={setDataHistory}
      />
      <Table<IHistory>
        rowKey={"_id"}
        columns={columns}
        dataSource={viewHistory}
      />
    </>
  );
};
export default HistoryOrder;
