import { useCurrentApp } from "@/components/context/app.context";
import { Modal, Tabs, TabsProps } from "antd";
import { useState } from "react";
import UpdateAccount from "./updateInfo.account";
import ChangePassword from "./changePassword.account";

const ManageAccount = () => {
  const { user } = useCurrentApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: (
        <>
          <UpdateAccount />
        </>
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <>
          <ChangePassword />
        </>
      ),
    },
  ];
  return (
    <>
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"50vw"}
        footer={null}
        maskClosable={false}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};
export default ManageAccount;
