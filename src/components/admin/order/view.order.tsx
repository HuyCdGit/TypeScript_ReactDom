import { FORMATE_DATE, toVND } from "@/services/helper";
import { Badge, Descriptions, DescriptionsProps, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
  isOrderDetail: boolean;
  setIsOrderDetail: (v: boolean) => void;
  dataView: IOrderTable | null;
  setDataView: (v: IOrderTable | null) => void;
}
const OrderView = (props: IProps) => {
  const { isOrderDetail, setIsOrderDetail, dataView, setDataView } = props;
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: dataView?._id,
      span: 2,
    },
    {
      key: "2",
      label: "User name",
      children: dataView?.name,
    },

    {
      key: "3",
      label: "Giá tiền",
      children: <>{toVND(dataView?.totalPrice || 0)}</>,
      span: 2,
    },

    {
      key: "4",
      label: "Status",
      children: <Badge status="processing" text={dataView?.type} />,
    },
    {
      key: "5",
      label: "Create At",
      children: <>{dayjs(dataView?.createdAt).format(FORMATE_DATE)}</>,
    },
  ];
  return (
    <Drawer
      title="Order view"
      closable={{ "aria-label": "Close Button" }}
      //   style={{width: 60vw}}
      width={"60vw"}
      onClose={() => {
        setDataView(null);
        setIsOrderDetail(false);
      }}
      open={isOrderDetail}
    >
      <Descriptions title={"Book Detail"} bordered items={items} />
    </Drawer>
  );
};
export default OrderView;
