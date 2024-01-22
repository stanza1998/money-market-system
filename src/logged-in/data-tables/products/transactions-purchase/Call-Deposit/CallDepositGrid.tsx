import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useNavigate } from "react-router-dom";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { IBond } from "../../../../../shared/models/instruments/BondModel";
import { dateFormat_YY_MM_DD } from "../../../../../shared/utils/utils";
import { ICallDeposit } from "../../../../../shared/models/instruments/CallDepositModel";

interface IProps {
  data: ICallDeposit[];
}

export const CallDepositGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const user = store.auth.meJson;
  const onNavigate = useNavigate();

  //onContinue next
  const onContinue = (instrumentId: string) => {
    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);
    console.log(selectedInstrument);

    if (selectedInstrument) {
      store.instruments.treasuryBill.select(selectedInstrument.asJson);
      onNavigate(`/c/purchases/submitted/${selectedInstrument.asJson.id}`);
    }
  };

  const onTender = (instrumentId: string) => {
    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);

    if (selectedInstrument) {
      store.instruments.treasuryBill.select(selectedInstrument.asJson);
      onNavigate(`/c/purchases/allocation-bonds/${selectedInstrument.asJson.id}`);
    }
  };

  const hasAllocations = (instrumentId: string) => {
    console.log("Has Allocations: " + instrumentId);

    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);

    if (selectedInstrument) {
      if (
        selectedInstrument.asJson.instrumentStatus === "allocated" ||
        selectedInstrument.asJson.instrumentStatus === "tendered"
      ) {
        return true;
      }
      return false;
    }
  };

  const canTender = (instrumentId: string) => {
    console.log("Can Tender: " + instrumentId);
    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);
    const today = Date.now();
    if (selectedInstrument) {
      if (selectedInstrument.asJson.maturityDate) {
        const difference = selectedInstrument?.asJson.maturityDate - today;
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const dtm = Math.floor(difference / millisecondsPerDay);

        if (dtm >= 0 && dtm <= 14) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  const hasInstrumentTenderingPurchaseSalesPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Instrument Tendering/Purchase/Sales" &&
      feature.read === true
  );
  const hasEditPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Instrument Tendering/Purchase/Sales" &&
      feature.update === true
  );
 
  const columns: GridColDef[] = [
    {
      field: "instrumentName",
      headerName: "Description",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "maturityDate",
      headerName: "Maturity Date",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => {
        const formattedDate = dateFormat_YY_MM_DD(params.row.maturityDate);
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "issuer",
      headerName: "Issuer",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "interestRate",
      headerName: "Interest Rate",
      flex: 1,
      headerClassName: "grid",
    },
    {
        field: "instrumentStatus",
        headerName: "status",
        flex: 1,
        headerClassName: "grid",
      },
    {
      field: "instrumentStatus",
      headerName: "Status",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    hasInstrumentTenderingPurchaseSalesPermission
      ? {
          field: "Options",
          headerName: "Options",
          flex: 1,
          headerClassName: "grid",
          renderCell: (params) => (
            <div>
              {hasEditPermission && (
                <>
                  {canTender(params.row.key) && (
                    <>
                      <IconButton
                        data-uk-tooltip="Tender"
                        onClick={() => onTender(params.row.key)}
                      >
                        <ViewCompactIcon />
                      </IconButton>
                    </>
                  )}
                  {hasAllocations(params.row.key) && (
                    <>
                      <IconButton
                        data-uk-tooltip="Continue"
                        onClick={() => onContinue(params.row.key)}
                      >
                        <AssignmentReturnIcon />
                      </IconButton>
                    </>
                  )}
                  {!hasAllocations(params.row.key) && (
                    <>
                      <IconButton
                        data-uk-tooltip="Tender"
                        onClick={() => onTender(params.row.key)}
                      >
                        <ViewCompactIcon />
                      </IconButton>
                    </>
                  )}
                </>
              )}
            </div>
          ),
        }
      : ({} as GridColDef),
  ];

  return (
    <div className="grid">
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
    </div>
  );
});
