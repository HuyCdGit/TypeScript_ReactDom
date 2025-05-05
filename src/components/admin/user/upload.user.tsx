import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload, Modal, Table, App as AtndApp } from "antd";
import Exceljs from "exceljs";
import { Buffer } from "buffer";
import { useState } from "react";
import { bulkCreateUserAPI } from "@/services/api";
import templateFile from "assets/template/user.xlsx?url";
interface IProps {
  isOpenImport: boolean;
  setIsOpenImport: (v: boolean) => void;
  refreshTable: () => void;
}
interface DataType {
  fullName: string;
  email: string;
  phone: string;
}

const UploadUser = (props: IProps) => {
  const { isOpenImport, setIsOpenImport, refreshTable } = props;
  const { Dragger } = Upload;
  const { Column } = Table;
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);
  const { message, notification } = AtndApp.useApp();
  const handleOk = async (dataImport: IDataImport[]) => {
    if (!dataImport) {
      return;
    }
    const res = await bulkCreateUserAPI(dataImport);
    if (res.data) {
      notification.success({
        message: "Create user bulk successful",
        description: `Success: ${res.data.countSuccess} Error: ${res.data.countError}`,
      });
    } else {
      notification.error({
        message: "Create user bulk error",
        description: `Success: ${res.data.countSuccess} Error: ${res.data.countError}`,
      });
    }
  };
  const handleCancel = () => {
    setIsOpenImport(false);
    setDataImport([]);
  };
  const propsUploads: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },

    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("file name: ", info.file, info.fileList);
      }
      if (status === "done") {
        console.log("check filelist", info.fileList);
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj!;

          //load file to buffer
          const workbook = new Exceljs.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const res = await workbook.xlsx.load(buffer);

          console.log("check res ", res);

          //load file to Json
          const jsonData: IDataImport[] = [];
          workbook.worksheets.forEach(function (sheet) {
            // read first row as data keys
            const firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;
            const keys = firstRow.values as any[];
            sheet.eachRow((row, rowNumber) => {
              if (rowNumber == 1) return;
              const values = row.values as any;
              const obj: any = {};
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i];
              }
              jsonData.push(obj);
            });
          });
          setDataImport(jsonData);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal
        title="Upload File"
        open={isOpenImport}
        okButtonProps={{
          disabled: dataImport.length > 0 ? false : true,
        }}
        maskClosable={false}
        destroyOnClose={true}
        okText="Import Data"
        onOk={() => {
          handleOk(dataImport);
          refreshTable();
          handleCancel();
        }}
        onCancel={() => {
          handleCancel();
        }}
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
            uploading company data or other banned files.{" "}
            <a
              onClick={(e) => e.stopPropagation()}
              href={templateFile}
              download
              id="download"
            >
              Download sample file
            </a>
          </p>
        </Dragger>
        <br />
        <Table<DataType> rowKey={"id"} dataSource={dataImport}>
          <Column title="Full Name" dataIndex="fullName" key="fullName" />
          <Column title="Email" dataIndex="email" key="email" />
          <Column title="Phone" dataIndex="phone" key="phone" />
        </Table>
      </Modal>
    </>
  );
};

export default UploadUser;
