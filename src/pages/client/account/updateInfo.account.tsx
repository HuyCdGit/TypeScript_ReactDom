import { useCurrentApp } from "@/components/context/app.context";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  Row,
  Upload,
  UploadFile,
  App as AntdApp,
  Avatar,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { callUploadImg, updateInfo } from "@/services/api";
import { UploadChangeParam } from "antd/es/upload";
interface UpdateInfo {
  email: string;
  fullName: string;
  phone: string;
}

const UpdateAccount = () => {
  const { user, setUser } = useCurrentApp();
  const [form] = useForm();
  const { message, notification } = AntdApp.useApp();
  const [fileList, setFileList] = useState<string | null>(null);
  const urlAvatar = `${
    import.meta.env.VITE_BACKEND_URL
  }/images/avatar/${fileList}`;

  const onFinish: FormProps<UpdateInfo>["onFinish"] = async (values) => {
    const { fullName, phone } = values;
    const res = await updateInfo(
      values.fullName,
      values.phone,
      fileList!,
      user!.id
    );
    if (res && res.data) {
      setUser({ ...user!, avatar: fileList!, fullName, phone });
      console.log("check res", user);
      message.success("Cập nhật thông tin user thành công");
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const handleUploadFile = async (options: RcCustomRequestOptions) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await callUploadImg(file, "avatar");
    if (res && res.data) {
      setFileList(res.data.fileUploaded);
    }
    if (onSuccess) onSuccess("ok");
    else message.error(res.message);
  };
  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadFile,
    onChange(info: UploadChangeParam) {
      if (info.file.status !== "uploading") {
        message.success(`Uploading.....`);
      }
      if (info.file.status === "done") {
        message.success(`Upload file thành công`);
      } else if (info.file.status === "error") {
        message.error(`Upload file thất bại`);
      }
    },
  };
  useEffect(() => {
    console.log("check urlAvatar", urlAvatar);
    if (user) {
      setFileList(user.avatar);
      form.setFieldsValue({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      });
    }
  }, [user]);
  return (
    <>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Avatar
            size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
            icon={<AntDesignOutlined />}
            src={urlAvatar}
            shape="circle"
          />
        </Col>
        <Col span={24}>
          <Upload {...propsUpload}>
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
        </Col>
        <Col flex={2}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item<UpdateInfo>
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item<UpdateInfo>
              label="Tên hiển thị"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Please input your fullName!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<UpdateInfo>
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Click to Upload
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default UpdateAccount;
