import { Modal, App as AntApp, Form, Input } from "antd";
import type { FormProps } from "antd";
import { createUserAPI } from "@/services/api";
interface Iprops {
  isModalCreateUser: boolean;
  setIsModalCreateUser: (v: boolean) => void;
  refreshTable: () => void;
}
type TFieldType = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

const CreateUser = (props: Iprops) => {
  const { notification } = AntApp.useApp();
  const { isModalCreateUser, setIsModalCreateUser, refreshTable } = props;
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    refreshTable();
    setIsModalCreateUser(false);
  };

  const onFinish: FormProps<TFieldType>["onFinish"] = async (values) => {
    const res = await createUserAPI(
      values.fullName,
      values.email,
      values.phone,
      values.password
    );
    if (res.data) {
      notification.success({
        message: "Create user Successful",
        description: `${res.message}`,
      });
    } else {
      notification.error({
        message: "Create user Error",
        description: `${res.message}`,
      });
    }
    handleCancel();
  };
  return (
    <>
      <Modal
        title="Create User"
        open={isModalCreateUser}
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
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please input your fullName!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<TFieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<TFieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
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
export default CreateUser;
