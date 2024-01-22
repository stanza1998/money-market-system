import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { currencyFormat } from "../../../../../shared/functions/Directives";
import { calculateCurrentBalance } from "../../../../../shared/functions/MyFunctions";

interface TableData {
  heading: string;
  summary: string;
  openingBalance: string;
  closingBalance: string;
  data: any[];
}

interface ClientStatmentProps {
  mainHeading: string;
  tablesData: TableData[];
  exportTimestamp: number;
}

const MoneyMarketStatement = (props: ClientStatmentProps) => {
  const { mainHeading, tablesData, exportTimestamp } = props;
  const formattedTimestamp = new Date(exportTimestamp).toLocaleString();
  // Define styles for the table
  // Define styles for the report
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      padding: 20,
      justifyContent: "center", // Center the content horizontally
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    logo: {
      width: 150,
      height: 80,
      marginBottom: 10,
      alignSelf: "center", // Center the logo horizontally
    },
    mainHeading: {
      marginTop: 15,
      fontWeight: 900,
      fontSize: 12,
      marginBottom: 10,
      alignSelf: "center", // Center the heading horizontally
      color: "#094FA3", // Remove the semicolon here
      textAlign: "center", // Center the text within the heading

      // Add any additional styles to ensure visibility
      overflow: "hidden", // Prevent overflow if needed
    },

    heading: {
      marginTop: 13,
      fontSize: 8,
      marginBottom: 10,
    },
    summary: {
      fontSize: 8,
      marginBottom: 10,
    },
    table: {
      marginTop: 15,
      display: "flex",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 0.5,
      borderBottomWidth: 0.5, // Add bottom border to the whole table
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5, // Add bottom border to every row
    },
    tableCell: {
      width: 152,
      fontSize: 8,
      padding: 5,
      borderStyle: "solid",
      borderWidth: 0, // Remove cell borders
      paddingLeft: 10, // Add some left padding
    },
    timestamp: {
      marginTop: 15,
      fontSize: 12,
    },
  });

  return (
    <Document>
      {tablesData.map((table, index) => (
        <Page key={index} size="A4" style={styles.page} orientation="portrait">
          <View style={styles.section}>
            <Image
              source={require("../../../../../assets/IJG.png")}
              style={styles.logo}
            />
            <Text style={styles.mainHeading}>{mainHeading}</Text>

            {/* Render the table heading */}
            <Text style={styles.heading}>{table.heading}</Text>

            {/* Render the summary */}
            <Text style={styles.summary}>{table.summary}</Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                {/* Render table header */}
                <View style={styles.tableCell}>
                  <Text>Opening Balance</Text>
                </View>
              </View>
              {/* Render table data */}

              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{currencyFormat(table.openingBalance)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                {/* Render table header */}
                <View style={styles.tableCell}>
                  <Text>Transaction Date</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Value Date</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Transaction</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Running Balance</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Amount</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Balance</Text>
                </View>
                {/* Add more columns as needed */}
              </View>
              {/* Render table data */}
              {table.data
                .filter((item: any) => item.transaction !== "Cancelled")
                .map((item: any, rowIndex: number) => {
                  const balance = calculateCurrentBalance(
                    item.pBalance,
                    item.amount,
                    item.transaction
                  );
                  return (
                    <View key={rowIndex} style={styles.tableRow}>
                      <View style={styles.tableCell}>
                        <Text>{item.transactionDate}</Text>
                      </View>

                      <View style={styles.tableCell}>
                        <Text>{item.valueDate}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{item.transaction}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{currencyFormat(item.pBalance)}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{currencyFormat(item.amount)}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{currencyFormat(balance)}</Text>
                      </View>
                      {/* Add more columns as needed */}
                    </View>
                  );
                })}
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                {/* Render table header */}
                <View style={styles.tableCell}>
                  <Text>Closing Balance</Text>
                </View>
              </View>
              {/* Render table data */}

              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{currencyFormat(table.closingBalance)}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.timestamp}>
              Exported at: {formattedTimestamp}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default MoneyMarketStatement;
