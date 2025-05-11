import React, { useEffect, useState } from "react";
import {
  Badge,
  Descriptions,
  DescriptionsProps,
  Drawer,
  DrawerProps,
  GetProp,
  Upload,
  UploadFile,
  UploadProps,
  Image,
  Divider,
} from "antd";
import { v1 as uuidv1 } from "uuid";
import { FORMATE_DATE, toVND } from "@/services/helper";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
interface Iprops {
  openViewBookDetail: boolean;
  setOpenViewBookDetail: (v: boolean) => void;
  viewBook: IBookTable | null;
  setViewBook: (v: IBookTable | null) => void;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ViewBookDetail = (props: Iprops) => {
  const { openViewBookDetail, setOpenViewBookDetail, viewBook, setViewBook } =
    props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [size] = useState<DrawerProps["size"]>("large");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onClose = () => {
    setOpenViewBookDetail(false);
    setViewBook(null);
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: viewBook?._id,
      span: 2,
    },
    {
      key: "2",
      label: "Tên sách",
      children: viewBook?.mainText,
    },
    {
      key: "3",
      label: "Tác giả",
      children: viewBook?.author,
      span: 2,
    },
    {
      key: "4",
      label: "Giá tiền",
      children: <>{toVND(viewBook?.price || 0)}</>,
    },

    {
      key: "5",
      label: "Status",
      children: <Badge status="processing" text={viewBook?.category} />,
      span: 3,
    },
    {
      key: "6",
      label: "Create At",
      children: <>{dayjs(viewBook?.createdAt).format(FORMATE_DATE)}</>,
      span: 2,
    },
    {
      key: "7",
      label: "Update At",
      children: <>{dayjs(viewBook?.updatedAt).format(FORMATE_DATE)}</>,
    },
  ];
  // preview image
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (viewBook) {
      let imgThumbNail: any = {};
      const imgSlider: UploadFile[] = [];
      if (viewBook.thumbnail) {
        imgThumbNail = {
          uid: uuidv1(),
          name: viewBook.mainText,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            viewBook.thumbnail
          }`,
        };
      }
      if (viewBook.slider && viewBook.slider.length > 0) {
        viewBook.slider.map((items) => {
          imgSlider.push({
            uid: uuidv1(),
            name: items,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${items}`,
          });
        });
      }
      setFileList([imgThumbNail, ...imgSlider]);
    }
  }, [viewBook]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <Drawer
        title="Chức năng xem thông tin sách"
        size={size}
        onClose={onClose}
        open={openViewBookDetail}
      >
        <Descriptions title={"Book Detail"} bordered items={items} />
        <Divider orientation="left">Ảnh books</Divider>
        <Upload
          listType="picture-card"
          showUploadList={{ showRemoveIcon: false }}
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
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
      </Drawer>
    </>
  );
};
export default ViewBookDetail;
