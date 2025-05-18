import { callUploadImg, createBookAPI, getCategoryAPI } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import {
  Input,
  Modal,
  Form,
  InputNumber,
  Select,
  App as AntdApp,
  message,
  Upload,
  Image,
} from "antd";
import type { FormProps, GetProp, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { UploadChangeParam } from "antd/es/upload";
interface Iprops {
  isCreateBookOpen: boolean;
  setIsCreateBookOpen: (v: boolean) => void;
  refreshTable: () => void;
}
type UserUploadType = "thumbnail" | "slider";

type TcreateFormBook = {
  mainText: string;
  author: string;
  price: string;
  category: string;
  quantity: string;
  slider: any;
  thumbnail: any;
};
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file: FileType) => {
  console.log("check file beforeupload", file);
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CreateBook = (props: Iprops) => {
  const { isCreateBookOpen, setIsCreateBookOpen, refreshTable } = props;
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  const [listCategory, setListCategory] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

  const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };
  const handleRemove = async (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setFileListThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
      setFileListSlider(newSlider);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: UserUploadType
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await callUploadImg(file, "book");

    if (res && res.data) {
      console.log("check res handleUploadFile", res);
      const uploadedFile: UploadFile = {
        uid: file.uid,
        name: res.data.fileUploaded,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          res.data.fileUploaded
        }`,
      };
      if (type === "thumbnail") {
        setFileListThumbnail([{ ...uploadedFile }]);
      } else {
        setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
      }
      if (onSuccess) onSuccess("ok");
    } else message.error(res.message);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileListSlider([]);
    setFileListThumbnail([]);
    setIsCreateBookOpen(false);
    refreshTable();
  };

  const onFinish: FormProps<TcreateFormBook>["onFinish"] = async (values) => {
    console.log("check values ", fileListThumbnail, fileListSlider);
    const thumbnail = fileListThumbnail?.[0]?.name ?? [];
    const slider = fileListSlider?.map((items) => items.name) ?? [];
    console.log("values.slider", values.slider);
    const res = await createBookAPI(
      thumbnail,
      slider,
      values.mainText,
      values.author,
      values.price,
      values.quantity ?? 1000,
      values.category
    );
    if (res.data) {
      message.success = res.message;
    } else {
      message.error = res.message;
    }
    handleCancel();
  };
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const d = res.data.map((items) => {
          return { value: items, label: items };
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);
  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <>
      <Modal
        title="Create book"
        open={isCreateBookOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item<TcreateFormBook>
            label="Tên sách"
            name="mainText"
            rules={[
              {
                required: true,
                message: "Please input your mainText!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<TcreateFormBook>
            label="Tác giả"
            name="author"
            rules={[
              {
                required: true,
                message: "Please input your author!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<TcreateFormBook>
            label="Giá tiền"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input your price!",
              },
            ]}
          >
            <InputNumber
              addonAfter="đ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
          <Form.Item<TcreateFormBook>
            label="Thể loại"
            name="category"
            rules={[
              {
                required: true,
                message: "Please input your category!",
              },
            ]}
          >
            <Select style={{ width: 120 }} options={listCategory} />
          </Form.Item>
          <Form.Item<TcreateFormBook>
            label="Ảnh thumbnail"
            name="thumbnail"
            rules={[
              {
                required: true,
                message: "Please input your thumbnail!",
              },
            ]}
            // convert value from upload -> form
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              multiple={false}
              customRequest={(options) =>
                handleUploadFile(options, "thumbnail")
              }
              beforeUpload={beforeUpload}
              onPreview={handlePreview}
              onChange={(info) => handleChange(info, "thumbnail")}
              onRemove={(file) => handleRemove(file, "thumbnail")}
              fileList={fileListThumbnail}
            >
              <div>
                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item<TcreateFormBook>
            label="Ảnh slider"
            name="slider"
            rules={[
              {
                required: true,
                message: "Please input your slider!",
              },
            ]}
            // convert value from upload -> form
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              multiple={true}
              customRequest={(options) => handleUploadFile(options, "slider")}
              beforeUpload={beforeUpload}
              onPreview={handlePreview}
              onChange={(info) => handleChange(info, "slider")}
              onRemove={(file) => handleRemove(file, "slider")}
              fileList={fileListSlider}
            >
              <div>
                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Modal>
    </>
  );
};
export default CreateBook;
