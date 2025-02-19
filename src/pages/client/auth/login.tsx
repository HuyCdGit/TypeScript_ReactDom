import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { App, Button, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username: string;
  password: string;
};
type LayoutType = Parameters<typeof Form>[0]["layout"];

const LoginPage = () => {
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
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const navigate = useNavigate();
  const [formLayout, setFormLayout] = useState<LayoutType>("vertical");
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const onFinish = async (v: FieldType) => {
    const res = await loginAPI(v.username, v.password);
    if (!res.error) {
      // console.log(res.data);
      setIsAuthenticated(true);
      setUser(res.data!.user);
      localStorage.setItem("access_token", res.data!.access_token);
      notification.success({
        message: "Successed",
        description: `đăng nhập thành công`,
      });
      navigate("/");
    } else {
      notification.error({ message: "Failed", description: `${res.message}` });
    }
  };
  const onFinishFailed = () => {
    notification.warning({ message: "warning" });
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
        label="Email"
        name="username"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input placeholder="input your Email" />
      </Form.Item>
      <Form.Item<FieldType>
        hasFeedback
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password placeholder="input your Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginPage;
