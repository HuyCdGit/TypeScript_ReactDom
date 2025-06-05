import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import type { MenuProps } from "antd";
import { logoutAPI } from "@/services/api";
import { ItemType } from "antd/es/menu/interface";
type MenuItem = Required<MenuProps>["items"][number];

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { user, isAuthenticated, setUser, setIsAuthenticated } =
    useCurrentApp();
  const handleLogout = async () => {
    //todo
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  const items: MenuItem[] = [
    {
      label: <NavLink to="/admin">Dashboard</NavLink>,
      key: "/admin",
      icon: <AppstoreOutlined />,
    },
    {
      label: <NavLink to="/admin/user">Manage Users</NavLink>,
      key: "/admin/user",
      icon: <UserOutlined />,
      // children: [
      //   {
      //     label: <Link to="/admin/user">CRUD</Link>,
      //     key: "crud",
      //     icon: <TeamOutlined />,
      //   },
      // {
      //     label: 'Files1',
      //     key: 'file1',
      //     icon: <TeamOutlined />,
      // }
      // ],
    },
    {
      label: <NavLink to="/admin/book">Manage Books</NavLink>,
      key: "/admin/book",
      icon: <ExceptionOutlined />,
    },
    {
      label: <NavLink to="/admin/order">Manage Orders</NavLink>,
      key: "/admin/order",
      icon: <DollarCircleOutlined />,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }}>
          <Link to={"/account"}>Quản lý tài khoản</Link>
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  if (isAuthenticated === false) {
    return <Outlet />;
  }
  const isAdminRoute = location.pathname.includes("admin");
  if (isAuthenticated === true && isAdminRoute === true) {
    const role = user?.role;
    if (role === "USER") {
      return <Outlet />;
    }
  }
  useEffect(() => {
    const active: any =
      items.find((item) => location.pathname === (item!.key as any)) ??
      "/admin";
    setActiveMenu(active.key);
  }, [location]);
  console.log("check location", activeMenu);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16, textAlign: "center" }}>
            Admin
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
        <Layout>
          <div
            className="admin-header"
            style={{
              height: "50px",
              borderBottom: "1px solid #ebebeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 15px",
            }}
          >
            <span>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </span>
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={urlAvatar} />
                {user?.fullName}
              </Space>
            </Dropdown>
          </div>
          <Content style={{ padding: "15px" }}>
            <Outlet />
          </Content>
          <Footer style={{ padding: 0, textAlign: "center" }}>
            React Test Fresher &copy; Hỏi Dân IT - Made with <HeartTwoTone />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutAdmin;
