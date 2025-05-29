import { Drawer } from "antd";
interface Iprops {
  isHistory: boolean;
  setIsHistory: (v: boolean) => void;
  dataHistory: IHistory | null;
  setDataHistory: (v: IHistory | null) => void;
}
const ViewHistory = (props: Iprops) => {
  const { isHistory, setIsHistory, dataHistory, setDataHistory } = props;
  console.log("check detailHistory", dataHistory);
  return (
    <Drawer
      title="Basic Drawer"
      closable={{ "aria-label": "Close Button" }}
      onClose={() => {
        setIsHistory(false);
        setDataHistory(null);
      }}
      open={isHistory}
    >
      <>
        {dataHistory?.detail.map((item, index) => {
          return (
            <ul key={index}>
              <li>Tên Sách: {item.bookName}</li>
              <li>Số lượng: {item.quantity}</li>
            </ul>
          );
        })}
      </>
    </Drawer>
  );
};
export default ViewHistory;
