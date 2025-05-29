import { useCurrentApp } from "@/components/context/app.context";
import { DeleteTwoTone } from "@ant-design/icons";
import {
  Col,
  Divider,
  InputNumber,
  Row,
  App as AntdApp,
  Empty,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import "@/styles/order.scss";
interface Iprops {
  currentStep: number;
  setCurrentStep: (v: number) => void;
}
const OrderIndex = (props: Iprops) => {
  const { message } = AntdApp.useApp();
  const { currentStep, setCurrentStep } = props;
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (carts) {
      let total = 0;
      let currentBookPrice = 0;
      carts.map((items) => {
        currentBookPrice = items?.detail?.price ?? 0;
        total += items?.quantity * currentBookPrice;
      });
      setTotalPrice(total);
    }
  }, [carts]);
  const handleOnChangeInput = (value: number, item: IBookTable) => {
    if (!value && value < 1) return;
    if (!isNaN(value)) {
      const cartStorage = localStorage.getItem("carts");
      if (cartStorage && item) {
        //update
        const carts = JSON.parse(cartStorage) as ICart[];
        //check Exist
        const isExistIndex = carts.findIndex((c) => c.id === item._id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = value;
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);
      }
    }
  };

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && _id) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((c) => c.id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCarts(newCarts);
    }
  };

  const handleNextStep = () => {
    if (!carts.length) {
      message.error("không có sản phẩm nào trong giỏ hàng");
      return;
    }
    const ckQuantity = carts.map((items: ICart) => items.quantity);
    if (ckQuantity[0] <= 0) {
      message.error("Số lượng sản phẩm không được âm");
      return;
    }
    setCurrentStep(1);
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
                    <div className="quantity">
                      <InputNumber
                        min={0}
                        onChange={(value) =>
                          handleOnChangeInput(value as number, item.detail)
                        }
                        value={item.quantity}
                      />
                    </div>
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
                onClick={() => handleNextStep()}
              >
                Mua Hàng ({carts?.length ?? 0})
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default OrderIndex;
