import { useCurrentApp } from "@/components/context/app.context";
import { createOrder } from "@/services/api";
import { DeleteTwoTone } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Radio,
  Row,
  Space,
  App as AntdApp,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
interface Iprops {
  currentStep: number;
  setCurrentStep: (v: number) => void;
}
type Tpayment = "COD" | "BANKING";

interface FieldType {
  method: Tpayment;
  fullName: string;
  phone: string;
  address: string;
  detail: any;
}
const PaymentOrder = (props: Iprops) => {
  const { setCurrentStep } = props;
  const { carts, user, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);
  const { notification } = AntdApp.useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = useForm();
  const handleNextStep = () => {
    setCurrentStep(2);
  };

  // const createOrderAPI = async (value: FieldType, carts: ICart[]) => {
  //   const res = await createOrder(
  //     value.fullName,
  //     value.address,
  //     value.phone,
  //     totalPrice,
  //     value.method,
  //     carts
  //   );
  // };

  const onFinish = async (values: FieldType) => {
    setIsLoading(true);

    if (carts) {
      const details = carts.map((items) => ({
        bookName: items.detail.mainText,
        quantity: items.detail.quantity,
        _id: items.detail._id,
      }));
      const res = await createOrder(
        values.fullName,
        values.address,
        values.phone,
        totalPrice,
        values.method,
        details
      );
      if (res.data) {
        notification.success({
          message: "Success",
          description: "Create an order is success",
        });
      } else {
        notification.error({
          message: "Error",
          description: "Create an order is error",
        });
      }
    }
    handleNextStep();
    setIsLoading(false);
  };

  useEffect(() => {
    let total = 0;
    let currentBookPrice = 0;
    if (carts) {
      carts.map((items) => {
        currentBookPrice = items?.detail?.price ?? 0;
        total += items?.quantity * currentBookPrice;
      });
      setTotalPrice(total);
    }
  }, [carts]);
  useEffect(() => {
    if (carts) {
      form.setFieldsValue({
        fullName: user?.fullName,
        phone: user?.phone,
        method: "COD",
      });
    }
  }, []);
  const handleRemoveBook = (id: string) => {
    if (carts) {
      const filter = carts.filter((c) => c.id !== id);
      setCarts(filter);
    }
  };
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((item, index) => {
              const currentBookPrice = item?.detail?.price ?? 0;
              return (
                <div className="order-book" key={`index-${index}`}>
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item?.detail?.thumbnail
                      }`}
                    />
                    <div className="title">{item?.detail?.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentBookPrice)}
                    </div>
                  </div>
                  <div className="action">
                    <div className="quantity">Số lượng: {item.quantity}</div>
                    <div className="sum">
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentBookPrice * (item?.quantity ?? 0))}
                    </div>
                    <DeleteTwoTone
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveBook(item.id)}
                      twoToneColor="#eb2f96"
                    />
                  </div>
                </div>
              );
            })}
            {carts.length === 0 && (
              <Empty description="Không có sản phẩm trong giỏ hàng" />
            )}
          </Col>
          <Col md={6} xs={24}>
            <div className="order-sum">
              <span>Phương thức thanh toán</span>
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item<FieldType>
                  label="Phương thức thành toán"
                  name="method"
                  rules={[
                    {
                      required: true,
                      message: "Please chooise your payment method!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                      <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                <Form.Item<FieldType>
                  label="Họ Tên"
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
                <Form.Item<FieldType>
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
                <Form.Item<FieldType>
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your address!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>

                <div className="calculate">
                  <span> Tạm tính</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice || 0)}
                  </span>
                </div>
                <Divider style={{ margin: "10px 0" }} />
                <div className="calculate">
                  <span>Tổng tiền</span>
                  <span className="sum-final">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice || 0)}
                  </span>
                </div>

                <Divider style={{ margin: "10px 0" }} />
                <Button
                  color="danger"
                  variant="solid"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Mua Hàng ({carts?.length ?? 0})
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default PaymentOrder;
