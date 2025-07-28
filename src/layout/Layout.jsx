import { Sidebar } from "../globalComponents/Sidebar";
import { Outlet } from "react-router-dom";
export const LayoutDefault = () => {
  return (
    <div className="container">
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
