import { useState } from "react";
import { Button, Form, Input, App, Divider } from "antd";
import { registerAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import "./register.scss";

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: number;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
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
  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
              <Divider />
            </div>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
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
                  {
                    type: "email",
                    required: true,
                    message: "please input Email",
                  },
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
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};
export default RegisterPage;
