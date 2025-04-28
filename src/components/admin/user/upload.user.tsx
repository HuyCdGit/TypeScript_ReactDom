import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Modal, Table, Button } from "antd";
interface IProps {
  isOpenImport: boolean;
  setIsOpenImport: (v: boolean) => void;
}
interface DataType {
  fullName: string;
  email: string;
  phone: string;
}
const UploadUser = (props: IProps) => {
  const { isOpenImport, setIsOpenImport } = props;
  const { Dragger } = Upload;
  const { Column } = Table;

  const handleOk = () => {
    setIsOpenImport(false);
  };
  const handleCancel = () => {
    setIsOpenImport(false);
  };
  const propsUploads: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    accept:
      ".doc,.docx,.xml,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("file name: ", info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const data: DataType[] = [
    {
      fullName: "John",
      email: "lala@gmail.com",
      phone: "2313124",
    },
    {
      fullName: "jack",
      email: "lala1@gmail.com",
      phone: "23131244",
    },
    {
      fullName: "DeeDee",
      email: "lala3@gmail.com",
      phone: "231312454",
    },
  ];
  return (
    <>
      <Modal
        title="Upload File"
        open={isOpenImport}
        footer={[
          <Button key="cancel" type="default" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Upload
          </Button>,
        ]}
      >
        <Dragger {...propsUploads}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
        <br />
        <Table<DataType> dataSource={data}>
          <Column title="Full Name" dataIndex="fullName" key="fullName" />
          <Column title="Email" dataIndex="email" key="email" />
          <Column title="Phone" dataIndex="phone" key="phone" />
        </Table>
      </Modal>
    </>
  );
};

export default UploadUser;
