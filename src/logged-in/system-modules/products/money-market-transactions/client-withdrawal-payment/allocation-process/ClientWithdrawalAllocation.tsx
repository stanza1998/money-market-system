import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { runInAction } from "mobx";
import { useAppContext } from "../../../../../../shared/functions/Context";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./ClientWithdrawal.scss"; // Import your styles

import swal from "sweetalert";
import {
  ClientWithdrawalPaymentColumnNames,
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
  defaultClientWithdrawalPaymentColumnVisibility,
} from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { ClientWithdrawalSheetItem } from "./ClientWithdrawalSheetItem";
import React from "react";
import ErrorBoundary from "../../../../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../../../../shared/toolbar/Toolbar";

const ClientWithdrawalAllocation = () => {
  const { api } = useAppContext();

  const [clientWithdrawalSheet, setClientWithdrawalSheet] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IClientWithdrawalPayment;
    direction: string;
  } | null>(null);

  const [columnVisibility, setColumnVisibility] = useState<{
    [key in keyof IClientWithdrawalPayment]: boolean;
  }>({
    ...defaultClientWithdrawalPaymentColumnVisibility,
  });

  const onAddItem = () => {
    const newItem: IClientWithdrawalPayment = {
      ...defaultClientWithdrawalPayment,
    };
    const data = [...clientWithdrawalSheet];
    data.push(newItem);
    setClientWithdrawalSheet(data);
  };

  const onItemChange =
    (index: number) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      runInAction(() => {
        const data = [...clientWithdrawalSheet];
        const name = e.target.name;
        const value = e.target.value;
        data[index] = { ...data[index], [name]: value };
        setClientWithdrawalSheet(data);
      });
    };

  const onItemRemove = (index: number) => {
    const data = [...clientWithdrawalSheet];
    data.splice(index, 1);
    setClientWithdrawalSheet(data);
  };

  const onClientChange = (value: string, index: number) => {
    runInAction(() => {
      const data = [...clientWithdrawalSheet];
      const clientId = value;
      data[index] = {
        ...data[index],
        clientName: value,
        clientId: clientId, // Assign the clientId to clientId
      };
      setClientWithdrawalSheet(data);
    });
  };

  const onNumberChange = (
    value: string | number,
    index: number,
    fieldName: string
  ) => {
    runInAction(() => {
      const data = [...clientWithdrawalSheet];
      data[index] = {
        ...data[index],
        [fieldName]: Number(value),
      };
      setClientWithdrawalSheet(data);
    });
  };

  const handleSort = (key: keyof IClientWithdrawalPayment) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleColumnVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedColumn = event.target.value as keyof IClientWithdrawalPayment;
    setColumnVisibility((prevColumnVisibility) => ({
      ...prevColumnVisibility,
      [selectedColumn]: !event.target.checked,
    }));
  };

  const sortedData = [...clientWithdrawalSheet];

  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig?.key] && b[sortConfig?.key]) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
  }

  const getSortIndicator = (key: keyof IClientWithdrawalPayment): string => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = clientWithdrawalSheet.filter((item) => {
    const values = Object.values(item);
    const searchValue = searchQuery.toLowerCase();
    return values.some((value) =>
      String(value).toLowerCase().includes(searchValue)
    );
  });

  const onNavigate = useNavigate();

  const onSave = async () => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Process"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        try {
          clientWithdrawalSheet.forEach(
            async (client: IClientWithdrawalPayment) => {
              await api.clientWithdrawalPayment.create(client);
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        swal({
          text: "File has not been processed, because the user has cancelled the action!",
          icon: "error",
        });
      }
    });
  };

  const handleBack = () => {
    onNavigate(`/c/client-withdrawal-payment`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await api.client.legalEntity.getAll();
        await api.client.naturalPerson.getAll();
        await api.mma.getAll();
      } catch (error) {}
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.mma]);

  return (
    <div className="uk-section uk-section-small">
      <div className="uk-container uk-container-expand">
        <div className="sticky-top">
          <Toolbar
            title="Client Withdrawal and Payment Sheet"
            rightControls={
              <button className="btn btn-danger" onClick={handleBack}>
                <FontAwesomeIcon
                  className="uk-margin-small-right"
                  icon={faArrowLeft}
                />
                Back
              </button>
            }
          />
          <hr />
        </div>

        <ErrorBoundary>
          <div className="page-main-card uk-card uk-padding-small">
            <div className="uk-margin">
              <div className="purchase-page-table">
                <div className="uk-width-1-1 uk-padding-small">
                  <Toolbar
                    rightControls={
                      <form className="uk-form">
                        <div
                          className="uk-form-controls"
                          style={{ marginBottom: "50px" }}>
                          <input
                            type="text"
                            className="uk-input uk-form-small"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </form>
                    }
                  />
                  <div className="table-container">
                    <table className="kit-table uk-table uk-table-small uk-table-responsive">
                      <colgroup>
                        <col style={{ width: '200px' }} />
                      </colgroup>
                      <thead className="header">
                        <tr>
                          {Object.keys(columnVisibility).map(
                            (key) =>
                              columnVisibility[key as keyof IClientWithdrawalPayment] && (
                                <th key={key} onClick={() => handleSort(key as keyof IClientWithdrawalPayment)}>
                                  {ClientWithdrawalPaymentColumnNames[key as keyof IClientWithdrawalPayment]} {getSortIndicator(key as keyof IClientWithdrawalPayment)}
                                </th>
                              )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <Fragment key={index}>
                            <ClientWithdrawalSheetItem
                              index={index}
                              onItemChange={onItemChange}
                              onItemRemove={onItemRemove}
                              onNumberChange={onNumberChange}
                              onClientChange={onClientChange}
                              clientName={item.clientName}
                              moneyMarketAccountNumber={item.allocation}
                              withdrawalAmount={item.amount}
                              reference={item.reference}
                              bank={item.bank}
                              valueDate={item.transactionDate}
                              handleColumnVisibilityChange={handleColumnVisibilityChange}
                              ClientWithdrawalPaymentColumnNames={ClientWithdrawalPaymentColumnNames}
                              columnVisibility={columnVisibility}
                            />
                          </Fragment>
                        ))}

                      </tbody>
                    </table> 

                    <table
                      className="kit-table uk-table uk-table-small uk-table-middle uk-table-responsive"
                      style={{
                        height: "200px",
                        width: "100%",
                        tableLayout: "fixed",
                      }}>
                      <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        {/* Add more col elements with appropriate widths */}
                      </colgroup>
                      <thead className="header">
                        <tr>
                          {Object.keys(columnVisibility).map(
                            (key) =>
                              columnVisibility[
                                key as keyof IClientWithdrawalPayment
                              ] && (
                                <th
                                  key={key}
                                  onClick={() =>
                                    handleSort(
                                      key as keyof IClientWithdrawalPayment
                                    )
                                  }>
                                  {
                                    ClientWithdrawalPaymentColumnNames[
                                      key as keyof IClientWithdrawalPayment
                                    ]
                                  }{" "}
                                  {getSortIndicator(
                                    key as keyof IClientWithdrawalPayment
                                  )}
                                </th>
                              )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <Fragment key={index}>
                            <ClientWithdrawalSheetItem
                              index={index}
                              onItemChange={onItemChange}
                              onItemRemove={onItemRemove}
                              onNumberChange={onNumberChange}
                              onClientChange={onClientChange}
                              clientName={item.clientName}
                              moneyMarketAccountNumber={item.allocation}
                              withdrawalAmount={item.amount}
                              reference={item.reference}
                              bank={item.bank}
                              valueDate={item.transactionDate}
                              handleColumnVisibilityChange={
                                handleColumnVisibilityChange
                              }
                              ClientWithdrawalPaymentColumnNames={
                                ClientWithdrawalPaymentColumnNames
                              }
                              columnVisibility={columnVisibility}
                            />
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    className="uk-grid uk-child-width-1-2 uk-margin-top"
                    data-uk-grid>
                    <div>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={onAddItem}>
                        <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                        Client
                      </button>
                    </div>
                    {clientWithdrawalSheet.length !== 0 && (
                      <div className="uk-text-right">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={onSave}>
                          Save
                        </button>
                        <br />
                      </div>
                    )}
                    {clientWithdrawalSheet.length === 0 && (
                      <div className="uk-text-right">
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled={true}>
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ClientWithdrawalAllocation;
