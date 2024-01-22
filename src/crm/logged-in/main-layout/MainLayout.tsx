import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../nagivation/right-section/navbar/Navbar";
import Loading from "../../../shared/components/loading/Loading";

interface IProps {
  fetchingData?: boolean;
}
const MainLayout = (props: IProps) => {
  const { fetchingData } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/c") navigate("/c/dashboard");
  }, [navigate, pathname]);

  return (
    <div>
      {!fetchingData && <Outlet />}
      {fetchingData && <Loading fullHeight={true} />}
    </div>
  );
};

export default MainLayout;
