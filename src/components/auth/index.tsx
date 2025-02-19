import { ReactNode } from "react";
import { useCurrentApp } from "../context/app.context";
import { Button, Result } from "antd";
import { Link, useLocation } from "react-router-dom";

interface IProps {
  children: ReactNode;
}
const ProtectedRoute = (props: IProps) => {
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();
  console.log(location.pathname);
  if (isAuthenticated === false) {
    return (
      <>
        <Result
          status="404"
          title="Not Login"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button type="primary">
              <Link to="/login">Login</Link>
            </Button>
          }
        />
      </>
    );
  }
  const isAdminRoute = location.pathname.includes("admin");
  if (isAuthenticated === true && isAdminRoute === true) {
    const role = user?.role;
    if (role === "USER") {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={<Button type="primary">Back Home</Button>}
        />
      );
    }
  }
  return <>{props.children}</>;
};

export default ProtectedRoute;
