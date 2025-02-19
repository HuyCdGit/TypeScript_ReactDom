import { useState } from "react";
import { Button, Form, Input, App } from "antd";
import { registerAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: number;
};
type LayoutType = Parameters<typeof Form>[0]["layout"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("vertical");
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (v: FieldType) => {
    setIsSubmit(true);
    const res = await registerAPI(v.fullName, v.email, v.password, v.phone);
    if (!res.error) {
      message.success(res.message);
      navigate("/login");
    } else {
      message.error(res.message);
    }
    setIsSubmit(false);
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };
  return (
    <Form
      {...formItemLayout}
      layout={formLayout}
      form={form}
      initialValues={{ layout: formLayout }}
      onValuesChange={onFormLayoutChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        hasFeedback
        label="FullName"
        name="fullName"
        rules={[{ required: true, message: "please input Username" }]}
      >
        <Input placeholder="input Username" />
      </Form.Item>
      <Form.Item<FieldType>
        hasFeedback
        label="Email"
        name="email"
        rules={[
          { type: "email", required: true, message: "please input Email" },
        ]}
      >
        <Input placeholder="input Email" />
      </Form.Item>
      <Form.Item<FieldType>
        hasFeedback
        label="Password"
        name="password"
        rules={[{ required: true, message: "please input Password" }]}
      >
        <Input.Password placeholder="input Password" />
      </Form.Item>
      <Form.Item<FieldType>
        hasFeedback
        label="Phone"
        name="phone"
        rules={[
          { min: 10, max: 11 },
          { required: true, message: "please input Phone" },
        ]}
      >
        <Input placeholder="input Phone" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default RegisterPage;
