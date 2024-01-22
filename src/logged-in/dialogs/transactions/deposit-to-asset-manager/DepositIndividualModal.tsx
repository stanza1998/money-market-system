import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import {
  IAssetManagerFlowLiability,
  defaultAssetManagerFlowLiability,
} from "../../../../shared/models/AssetManagerFlowLiabilityModel";
import { FormEvent, useState } from "react";
import NumberInput from "../../../shared/number-input/NumberInput";
import { currencyFormat } from "../../../../shared/functions/Directives";
import TransactionInflowModel, {
  ITransactionInflow,
} from "../../../../shared/models/TransactionInflowModel";
import { IAssetManagerFlowAsset } from "../../../../shared/models/AssetManagerFlowAssetModel";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import image from "./images/ijgheader.jpg";
import image1 from "./images/footer.png";



interface IProps {
  transactions: TransactionInflowModel[];
  inflows: number;
  outflows: number;
  netflow: number;
}
const DepositIndividualCorporateModal = observer((props: IProps) => {
  const { api } = useAppContext();
  const { transactions, inflows, outflows, netflow } = props;

  const [loading, setLoading] = useState(false);

  const [deposit, setDeposit] = useState<IAssetManagerFlowLiability>({
    ...defaultAssetManagerFlowLiability,
  });
 

  const onCancel = () => {
    hideModalFromId(
      MODAL_NAMES.BACK_OFFICE.DEPOSIT_TO_ASSET_MANAGER
        .INDIVIDUAL_CORPORATE_MODAL
    );
  };

  // Register fonts
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  // Import your image file

  // Function to get base64 image from URL
  const getBase64ImageFromURL = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  };


    async function generatePDF() {
     const dataURL = await getBase64ImageFromURL(image);
       const dataURL1 = await getBase64ImageFromURL(image1);

      const docDefinition: any = {
        content: [
          {
            columns: [
              {
                image: dataURL,
                fit: [500, 600],
              },
            ],
          },
          {
            text: "Prescient IJG Unit Trust Management Company\n P O Box 186 \n Windhoek\nNamibia",
            style: "header",
          },

          "Attention: Brent Petersen\nFax: +264 61 304 671",

          { text: "9/25/2023 ,", style: "subheader" },
          "Dear Brent,",
          { text: "REDEMPTION REQUEST", style: "subheader" },
          {
            style: "tableExample",
            table: {
              widths: ["50%", "50%"], // Adjust the widths as needed (e.g., 50% for each column)
              body: [
                // [{ text: "Client Number", bold: true }, `${de}`],
                [{ text: "Entity Name", bold: true }, `${deposit.toAccount}`],
                [{ text: "Registered Number", bold: true }, "T366/07"],
                [
                  { text: "From Unit Trust Fund", bold: true },
                  "IJG Income Provider Fund – B1",
                ],
                [
                  { text: "Value of Units", bold: true },
                  `N$ ${deposit.netflows}`,
                ],
              ],
            },
          },
          "Our banking details are as follows:",
          {
            style: "tableExample",
            table: {
              widths: ["50%", "50%"], // Adjust the widths as needed (e.g., 50% for each column)
              body: [
                [
                  { text: "Name of Account Holder", bold: true },
                  "IJG Securities Money Market Trust",
                ],
                [{ text: "Bank", bold: true }, "Standard Bank Namibia"],
                [{ text: "Branch Code", bold: true }, "082772"],
                [{ text: "Account Number", bold: true }, "042739330"],
                [{ text: "Account Type", bold: true }, "Current"],
              ],
            },
          },

          "Yours sincerely",
          {
            columns: [
              {
                width: "*",
                text: "H N Shikongo,",
                style: "subheader",
                margin: [0, 100, 0, 0], // Add a bottom margin
                background: "#f0f0f0", // Replace with your desired background color in hex or any CSS-compatible color value
              },
              {
                width: "*",
                text: `${deposit.toAccount}`,
                style: "subheader",
                margin: [0, 100, 0, 0], // Add a bottom margin
              },
            ],
          },
          {
            columns: [
              {
                image: dataURL1,
                fit: [500, 600],
              },
            ],
          },
        ],
        styles: {
          coloredText: {
            background: "#f0f0f0", // Replace with your desired background color in hex or any CSS-compatible color value
            color: "black", // Set the text color to black for better contrast
          },
          greyText: {
            color: "grey",
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          tableExample: {
            margin: [0, 5, 0, 15],
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: "black",
          },
        },
        defaultStyle: {
          // alignment: 'justify'
        },
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.download("Deposit-to-Asset-manager.pdf");
    }
    

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: ["Cancel", "Submit"],
        dangerMode: true,
    }).then(async (edit) => {
        if (edit) {
            //create date
            const _dailyFlowDayLiability: IAssetManagerFlowLiability = {
                id: '',
                productId: 'oU2sIjtXHAJnslqFqw8Y',
                // openingBalance: 0,
                toAccount: deposit.toAccount,
                netflows: netflow,
                depositAmount: 0,
                numberOfDepositUnits: deposit.numberOfDepositUnits || 0,
                withdrawalAmount: -netflow,
                numberOfWithdrawalUnits: deposit.numberOfWithdrawalUnits || 0,
                flowDate: Date.now()
            }

            const _dailyFlowDayAsset: IAssetManagerFlowAsset = {
                id: '',
                productId: 'oU2sIjtXHAJnslqFqw8Y',
                toFromAccount: deposit.toAccount,
                netflows: netflow,
                depositAmount: netflow,
                numberOfDepositUnits: deposit.numberOfDepositUnits || 0,
                withdrawalAmount: 0,
                numberOfWithdrawalUnits: deposit.numberOfWithdrawalUnits || 0,
                flowDate: Date.now(),
                openingUnits: 0,
                closingUnits: 0
            }

            try {
                await api.assetManager.asset.create(_dailyFlowDayAsset);
                await api.assetManager.liability.create(_dailyFlowDayLiability);

                for (let index = 0; index < transactions.length; index++) {
                    const transaction = transactions[index];
                    const _transaction: ITransactionInflow = {
                        ...transaction.asJson,
                        status: "deposited"
                    }
                    try {
                        await api.inflow.update(_transaction);
                    } catch (error) {

                    }
                }
            } catch (error) {

            }
            onCancel();
            window.location.reload();
        } else {
            swal({
                icon: "error",
                text: "Operation cancelled!"
            });
            onCancel();
        }
    })
  };

 
    //   async function generatePDF() {
    //     const dataURL = await getBase64ImageFromURL(image);

    //     const docDefinition: any = {
    //       content: [
    //         {
    //           columns: [
    //             {
    //               image: dataURL,
    //               fit: [100, 100],
    //             },
    //             {
    //               width: "*",
    //               text: "4th Floor,1@Steps \n C/O Grove and Chasie Street \n  Kleine Kuppe, Windhoek. ",
    //               style: "greyText",
    //             },
    //             {
    //               width: "*",
    //               text: "P O Box 186 \n Windhoek \n Namibia.",
    //               style: "greyText",
    //             },
    //             {
    //               width: "*",
    //               text: "Tel: +264 (81)9583500 \n Fax: +264 (61) 304 671 \n www.ijg.net",
    //               style: "greyText",
    //             },
    //           ],
    //         },
    //         {
    //           text: "Prescient IJG Unit Trust Management Company\n P O Box 186 \n Windhoek\nNamibia",
    //           style: "header",
    //         },

    //         "Attention: Brent Petersen\nFax: +264 61 304 671",

    //         { text: "9/25/2023 ,", style: "subheader" },
    //         "Dear Brent,",
    //         { text: "REDEMPTION REQUEST", style: "subheader" },
    //         {
    //           style: "tableExample",
    //           table: {
    //             widths: ["50%", "50%"], // Adjust the widths as needed (e.g., 50% for each column)
    //             body: [
    //               [{ text: "Client Number", bold: true }, "3569"],
    //               [
    //                 { text: "Entity Name", bold: true },
    //                 "IJG Money Market Nominee (Pty) Ltd",
    //               ],
    //               [{ text: "Registered Number", bold: true }, "2018/2985"],
    //               [
    //                 { text: "From Unit Trust Fund", bold: true },
    //                 "IJG Income Provider Fund – B1",
    //               ],
    //               [{ text: "Value of Units", bold: true }, "N$ 26,000,000.00"],
    //             ],
    //           },
    //         },
    //         "Our banking details are as follows:",
    //         {
    //           style: "tableExample",
    //           table: {
    //             widths: ["50%", "50%"], // Adjust the widths as needed (e.g., 50% for each column)
    //             body: [
    //               [{ text: "Name of Account Holder", bold: true }, "3569"],
    //               [
    //                 { text: "Bank", bold: true },
    //                 "IJG Money Market Nominee (Pty) Ltd",
    //               ],
    //               [{ text: "Branch Code", bold: true }, "2018/2985"],
    //               [
    //                 { text: "Account Number", bold: true },
    //                 "IJG Income Provider Fund – B1",
    //               ],
    //               [{ text: "Account Type", bold: true }, "N$ 26,000,000.00"],
    //             ],
    //           },
    //         },

    //         "Yours sincerely",
    //         {
    //           columns: [
    //             {
    //               width: "*",
    //               text: "H N Shikongo,",
    //               style: "subheader",
    //               margin: [0, 100, 0, 0], // Add a bottom margin
    //               background: "#f0f0f0", // Replace with your desired background color in hex or any CSS-compatible color value
    //             },
    //             {
    //               width: "*",
    //               text: "25 September 2023,",
    //               style: "subheader",
    //               margin: [0, 100, 0, 0], // Add a bottom margin
    //             },
    //           ],
    //         },
    //         {
    //           columns: [
    //             {
    //               width: "*",
    //               text: "Trustees: M Späth, R Gustav",
    //               margin: [0, 50, 0, 0], // Add a bottom margin
    //               style: "greyText",
    //             },
    //             {
    //               width: "*",
    //               text: "",
    //               margin: [0, 50, 0, 0], // Add a bottom margin
    //             },
    //             {
    //               width: "200",
    //               text: "Company Registration Number: 2018/2985.",
    //               margin: [0, 50, 0, 0], // Add a bottom margin
    //               style: "greyText",
    //             },
    //           ],
    //         },
    //       ],
    //       styles: {
    //         coloredText: {
    //           background: "#f0f0f0", // Replace with your desired background color in hex or any CSS-compatible color value
    //           color: "black", // Set the text color to black for better contrast
    //         },
    //         greyText: {
    //           color: "grey",
    //         },
    //         header: {
    //           fontSize: 18,
    //           bold: true,
    //           margin: [0, 20, 0, 10],
    //         },
    //         subheader: {
    //           fontSize: 16,
    //           bold: true,
    //           margin: [0, 10, 0, 5],
    //         },
    //         tableExample: {
    //           margin: [0, 5, 0, 15],
    //         },
    //         tableHeader: {
    //           bold: true,
    //           fontSize: 13,
    //           color: "black",
    //         },
    //       },
    //       defaultStyle: {
    //         // alignment: 'justify'
    //       },
    //     };

    //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    //     pdfDocGenerator.download("Deposit-to-Asset-manager.pdf");
    //   }

  return (
    <ErrorBoundary>
      <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-3">
        <button
          className="uk-modal-close-default"
          onClick={onCancel}
          type="button"
          data-uk-close></button>
        <h3 className="uk-modal-title">Deposit to Asset Manager</h3>
        <div className="dialog-content uk-position-relative uk-padding-small">
          <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
            <div className="uk-form-controls uk-width-1-1">
              <label className="uk-form-label required" htmlFor="">
                To Unit Trust Fund
              </label>
              <select
                className="uk-select uk-form-small"
                name=""
                id=""
                onChange={(e) =>
                  setDeposit({ ...deposit, toAccount: e.target.value })
                }
                required>
                <option value=""> -- select account --</option>
                <option value="IJG Income Provider Fund – B3">
                  IJG Income Provider Fund – B3
                </option>
                <option value="IJG Income Provider Fund – A2">
                  IJG Money Market Fund - A2
                </option>
              </select>
            </div>

            <div className="uk-form-controls uk-width-1-1">
              <label className="uk-form-label required" htmlFor="">
                Amount (NAD)
              </label>
              <NumberInput
                className="uk-input uk-form-small"
                value={netflow}
                onChange={(value) =>
                  setDeposit({ ...deposit, netflows: Number(value) })
                }
              />
              <small>Net Flow {currencyFormat(netflow)}</small>
            </div>

            <div>
              <button
                className="kit-dropdown-btn"
                onClick={() => generatePDF()}
                title="Export your as PDF.">
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="lg"
                  className="icon uk-margin-small-right"
                />
                Export PDF
              </button>
              <button className="btn btn-primary uk-margin-top">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default DepositIndividualCorporateModal;
