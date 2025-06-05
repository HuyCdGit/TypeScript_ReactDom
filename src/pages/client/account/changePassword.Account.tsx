import { useCurrentApp } from "@/components/context/app.context";
import { changePassword } from "@/services/api";
import { Button, Col, Form, Input, message, notification, Row } from "antd";
import { FormProps, useForm } from "antd/es/form/Form";
import { useEffect } from "react";
interface ChangePassword {
  email: string;
  oldpass: string;
  newpass: string;
}
const ChangePassword = () => {
  const [form] = useForm();
  const { user } = useCurrentApp();
  const onFinish: FormProps<ChangePassword>["onFinish"] = async (values) => {
    console.log("Success:", values);
    const { email, oldpass, newpass } = values;
    const res = await changePassword(email, oldpass, newpass);
    if (res && res.data) {
      message.success("cập nhật password thành công");
      form.setFieldValue(oldpass, "");
      form.setFieldValue(newpass, "");
    } else {
      notification.error({
        message: "cập nhật password error",
        description: res.message,
      });
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ email: user?.email });
    }
  }, [user]);

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item<ChangePassword>
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your fullName!",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item<ChangePassword>
              label="Mật khẩu hiện tại"
              name="oldpass"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<ChangePassword>
              label="Mật khẩu mới"
              name="newpass"
              rules={[
                {
                  required: true,
                  message: "Please input your newPassword!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default ChangePassword;
