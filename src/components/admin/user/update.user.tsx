import { Modal, App as AntApp, Form, Input } from "antd";
import type { FormProps } from "antd";
import { updateUserAPI } from "@/services/api";
import { useEffect } from "react";
interface Iprops {
  isModalUpdateUser: boolean;
  setIsModalUpdateUser: (v: boolean) => void;
  refreshTable: () => void;
  dataView: IUserTable | null;
  setDataView: (v: IUserTable | null) => void;
}
type TFieldType = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

const UpdateUser = (props: Iprops) => {
  const { notification } = AntApp.useApp();
  const {
    isModalUpdateUser,
    setIsModalUpdateUser,
    refreshTable,
    dataView,
    setDataView,
  } = props;
  const [form] = Form.useForm();

  const handleCancel = () => {
    refreshTable();
    setIsModalUpdateUser(false);
    setDataView(null);
  };
  const onFinish: FormProps<TFieldType>["onFinish"] = async (values) => {
    console.log(">>> check values", values);
    const res = await updateUserAPI(
      dataView!._id,
      values.fullName,
      values.phone
    );
    if (res.data) {
      notification.success({
        message: "Update user Successful",
        description: `${res.message}`,
      });
    } else {
      notification.error({
        message: "Update user Error",
        description: `${res.message}`,
      });
    }
    handleCancel();
  };
  useEffect(() => {
    if (dataView && dataView._id) {
      form.setFieldsValue({
        fullName: dataView.fullName,
        email: dataView.email,
        phone: dataView.phone,
      });
    }
  }, [dataView]);
  return (
    <>
      <Modal
        title="Update User"
        open={isModalUpdateUser}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item<TFieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item<TFieldType>
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please input your fullName!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<TFieldType>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UpdateUser;
