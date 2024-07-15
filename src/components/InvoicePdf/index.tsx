import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  Sale as SaleType,
  ProductSale as ProductSaleType,
  Installment as InstallmentType,
} from "@/lib/type";
import {
  formatPrice,
  formatPaymentStatus,
  formatPaymentOption,
  formatDate,
} from "@/utils/string-utils";
import {
  EMART_INFO,
  TABLE_HEADER_SALE_PRODUCT,
  TABLE_HEADER_INSTALLMENTS,
} from "@/constants/index";

interface InvoicePdfProps {
  sale: SaleType;
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1 solid black",
    paddingBottom: 8,
    fontSize: 24,
    marginBottom: 10,
  },
  main: {
    marginTop: 10,
  },
  section: {
    marginVertical: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    width: "100%",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderColor: "black",
    borderBottomWidth: 1,
    padding: 8,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    width: "100%",
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "black",
    borderBottomWidth: 1,
    padding: 8,
    width: "100%",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderStyle: "solid",
    paddingTop: 8,
  },
});

const InvoicePdf: React.FC<InvoicePdfProps> = ({ sale }) => {
  const getPreparedDataProducts = (sale: SaleType) => {
    return sale.productSales.map((item, key) => {
      const quantity = item.quantity;
      const price = formatPrice(item.price);
      const company = item.product.company.name;
      const category = item.product.category.name;
      const model = item.product.model;
      return {
        key: key + 1,
        quantity,
        price,
        company,
        category,
        model,
      };
    });
  };

  const getPreparedDataInstallments = (installments?: InstallmentType[]) => {
    return installments?.map((item, key) => {
      const expectedPayment = formatPrice(item.expectedPayment);
      const actualPayment = item.actualPayment
        ? formatPrice(item.actualPayment)
        : 0;
      const dueDate = item.dueDate;
      const paidAt = item.paidAt;
      return {
        id: item.id,
        key: key + 1,
        expectedPayment,
        actualPayment: actualPayment ? actualPayment : 0,
        dueDate: formatDate(dueDate),
        paidAt: paidAt ? formatDate(paidAt) : "Not paid yet",
      };
    });
  };

  const getTotalSale = (productSale: ProductSaleType[]) => {
    const totalAmount = productSale.reduce(
      (total, item) => total + item.price,
      0
    );
    return totalAmount;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>E-MART</Text>
          <Text style={styles.title}>Invoice</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.section}>
            <Text style={[styles.boldText, styles.title]}>E-Mart Dinga</Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Contact Info: </Text>
              {EMART_INFO.phoneNumber}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Address: </Text>
              {EMART_INFO.address}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Sale date: </Text>
              {sale.date.toDateString()}
            </Text>
          </View>
          <View
            style={[
              styles.section,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <View>
              <Text style={styles.subtitle}>Customer Information</Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Firstname: </Text>
                <Text>{sale.customer.firstName}</Text>
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Lastname: </Text>
                <Text>{sale.customer.lastName}</Text>
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Phone number: </Text>
                <Text>{sale.customer.phoneNumber}</Text>
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>CNIC: </Text>
                <Text>{sale.customer.CNIC}</Text>
              </Text>
            </View>
            <View>
              <Text style={styles.subtitle}>Address Information</Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>City: </Text>
                {sale.customer.address?.city}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Tehsil: </Text>
                {sale.customer.address?.tehsil}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>District: </Text>
                {sale.customer.address?.district}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Address Details: </Text>
                {sale.customer.address?.detail}
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {TABLE_HEADER_SALE_PRODUCT.map((header) => (
                <Text key={header.key} style={styles.tableColHeader}>
                  {header.label}
                </Text>
              ))}
            </View>
            {getPreparedDataProducts(sale).map((item) => (
              <View style={styles.tableRow} key={item.key}>
                <Text style={styles.tableCol}>{item.key}</Text>
                <Text style={styles.tableCol}>{item.company}</Text>
                <Text style={styles.tableCol}>{item.category}</Text>
                <Text style={styles.tableCol}>{item.model}</Text>
                <Text style={styles.tableCol}>{item.price}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={[styles.boldText, styles.title]}>
              Payment Information
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Payment status: </Text>
              {formatPaymentStatus(sale.paymentStatus)}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Payment Option: </Text>
              {formatPaymentOption(sale.paymentOption)}
            </Text>
            {sale.fullPayment && (
              <>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Total price: </Text>
                  {formatPrice(getTotalSale(sale.productSales))}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Discount: </Text>
                  {sale.fullPayment.discount}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Purchase Amount: </Text>
                  {formatPrice(sale.fullPayment.purchaseAmount)}
                </Text>
              </>
            )}
            {sale.installmentPlan && (
              <>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Down payment: </Text>
                  {formatPrice(sale.installmentPlan.downPayment)}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Installment period: </Text>
                  {sale.installmentPlan.installmentPeriod}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Total Price: </Text>
                  {sale.installmentPlan.totalPrice}
                </Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    {TABLE_HEADER_INSTALLMENTS.map((header) => (
                      <Text key={header.key} style={styles.tableColHeader}>
                        {header.label}
                      </Text>
                    ))}
                  </View>
                  {getPreparedDataInstallments(
                    sale.installmentPlan.installments
                  )?.map((item) => (
                    <View style={styles.tableRow} key={item.key}>
                      <Text style={styles.tableCol}>{item.key}</Text>
                      <Text style={styles.tableCol}>
                        {item.expectedPayment}
                      </Text>
                      <Text style={styles.tableCol}>{item.actualPayment}</Text>
                      <Text style={styles.tableCol}>{item.dueDate}</Text>
                      <Text style={styles.tableCol}>{item.paidAt}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.footer}>
          <Text>Signature: _________________</Text>
          <Text>Date: _________________</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
