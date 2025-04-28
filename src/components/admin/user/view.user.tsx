import { Drawer, Descriptions, Badge, Avatar } from "antd";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE } from "@/services/helper";
interface IProps {
  isViewUser: boolean;
  setIsViewUser: (v: boolean) => void;
  dataView?: IUserTable;
  setDataView: React.Dispatch<React.SetStateAction<IUserTable | undefined>>;
}
const ViewUser = (props: IProps) => {
  const { isViewUser, setIsViewUser, dataView } = props;

  const onClose = () => {
    setIsViewUser(false);
  };
  const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    dataView?.avatar
  }`;
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "UserName",
      children: dataView?.fullName,
    },
    {
      key: "2",
      label: "Telephone",
      children: dataView?.phone,
    },
    {
      key: "3",
      label: "Role",
      span: 3,
      children: <Badge status="processing" text={dataView?.role} />,
    },
    {
      key: "4",
      label: "Avatar",
      children: <Avatar size={64} src={avatarURL}></Avatar>,
    },
    {
      key: "5",
      label: "Update At",
      span: 3,
      children: dayjs(dataView?.updatedAt).format(FORMATE_DATE),
    },
    {
      key: "6",
      label: "Update At",
      children: dayjs(dataView?.updatedAt).format(FORMATE_DATE),
    },
  ];

  return (
    <>
      <Drawer
        width={"50vw"}
        title="Basic Drawer"
        onClose={onClose}
        open={isViewUser}
      >
        <Descriptions
          layout="vertical"
          title="User Info"
          bordered
          items={items}
        />
      </Drawer>
    </>
  );
};
export default ViewUser;
