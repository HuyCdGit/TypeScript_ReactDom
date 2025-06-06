import { Button, Steps, App as AntdApp, Result, Breadcrumb } from "antd";
import OrderIndex from "./order/index.order";
import { useState } from "react";
import PaymentOrder from "./order/payment.order";
import { Link, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

const OrderPage = () => {
  const { message } = AntdApp.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const description = "This is a description.";
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to={"/"}>Trang Chủ</Link>,
            },

            {
              title: "Chi Tiết Giỏ Hàng",
            },
          ]}
        />
        {!isMobile && (
          <div className="order-steps" style={{ marginTop: 10 }}>
            <Steps
              current={currentStep}
              items={[
                {
                  title: "Finished",
                  description,
                },
                {
                  title: "In Progress",
                  description,
                },
                {
                  title: "Waiting",
                  description,
                },
              ]}
            />
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          {currentStep === 0 && (
            <OrderIndex
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 1 && (
            <PaymentOrder
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 2 && (
            <Result
              status="success"
              title="Đặt hàng thành công"
              subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn"
              extra={[
                <Button type="primary" key="console">
                  Trang chủ
                </Button>,
                <Button onClick={() => navigate("/history")}>
                  Lịch sử đặt hàng
                </Button>,
              ]}
            />
          )}
          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderPage;
