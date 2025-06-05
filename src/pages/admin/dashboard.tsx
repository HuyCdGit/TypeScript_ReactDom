import { fetchDashBoard } from "@/services/api";
import { Card, Col, Row, Statistic, StatisticProps } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
const DashBoardPage = () => {
  const [dataDashBoard, setDataDashBoard] = useState<IDashBoard | null>(null);
  useEffect(() => {
    const fetchDashBoardAPI = async () => {
      const res = await fetchDashBoard();
      if (res && res.data) {
        setDataDashBoard(res.data);
      }
    };
    fetchDashBoardAPI();
  }, []);

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," />
  );
  console.log("check dataDashBoard", dataDashBoard);
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Count Order"
            value={dataDashBoard?.countOrder}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Count User"
            value={dataDashBoard?.countUser}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Count Book"
            value={dataDashBoard?.countBook}
            formatter={formatter}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashBoardPage;
