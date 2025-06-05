import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { App, Button, Divider, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
type FieldType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const navigate = useNavigate();
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
  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Nhập</h2>
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
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input placeholder="input your Email" />
              </Form.Item>
              <Form.Item<FieldType>
                hasFeedback
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password placeholder="input your Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal" style={{ textAlign: "center" }}>
                Chưa có tài khoản ?
                <span>
                  <Link to="/register"> Đăng Ký </Link>
                </span>
              </p>
              <br />
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};
export default LoginPage;
