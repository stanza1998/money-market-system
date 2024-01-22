import { observer } from "mobx-react-lite";
import MainLayout from "./main-layout/MainLayout";
import Drawer from "./nagivation/Drawer";
import { useState, useCallback, useEffect } from "react";
import { useAppContext } from "../shared/functions/Context";
import React from "react";

const LoggedIn = observer(() => {

  const { api, store } = useAppContext();
  const [fetchingData, setFetchingData] = useState(true);

  const loadData = useCallback(async () => {
    setFetchingData(true);
    try {
      // await api.docfox.kycApplications.getKYCApplicationsFromDocFox();
    } catch (error) { }
    setFetchingData(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="application-layout">
      <Drawer />
      <MainLayout fetchingData={fetchingData} />
    </div>
  );
});

export default LoggedIn;
