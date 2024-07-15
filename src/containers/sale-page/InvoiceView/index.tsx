"use client";
import React from "react";
import {
  TABLE_HEADER_SALE_PRODUCT,
  TABLE_HEADER_INSTALLMENTS,
} from "@/constants/index";
import dynamic from "next/dynamic";
import InvoicePdf from "@/components/InvoicePdf";
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
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
import { EMART_INFO } from "@/constants/index";
interface InvoiceViewProps {
  sale: SaleType;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ sale }) => {
  const getPreparedDataProducts = (sale: SaleType) => {
    return sale.productSales.map((item, key) => {
      const quantity = item.quantity;
      const price = item.price;
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
      const expectedPayment = item.expectedPayment;
      const actualPayment = item.actualPayment;
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
    <>
      <PDFDownloadLink
        document={<InvoicePdf sale={sale} />}
        fileName={`Sale_Details_${sale.id}.pdf`}
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink>
      <div
        style={{
          padding: "16px",
          backgroundColor: "white",
          border: "1px solid black",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "90vh",
          marginTop: "20px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "32px" }}>E-MART</h1>
          <h1 style={{ fontSize: "32px" }}>Invoice</h1>
        </header>
        <hr />
        <main style={{ marginTop: "20px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              E-Mart Dinga
            </h1>
            <div>
              <p style={{ fontWeight: "600", fontSize: "12px" }}>
                Contact Info:
                <span style={{ fontWeight: "300" }}>
                  {" "}
                  {EMART_INFO.phoneNumber}
                </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: "600", fontSize: "12px" }}>
                Address:{" "}
                <span style={{ fontWeight: "300" }}>{EMART_INFO.address}</span>
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <label style={{ fontWeight: "bold", fontSize: "20px" }}>
                Customer information
              </label>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  Firstname:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.firstName}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  Lastname:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.lastName}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  Phone number:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.phoneNumber}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  CNIC:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.CNIC}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: "bold", fontSize: "20px" }}>
                Address information
              </label>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  City:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.address?.city}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  Tehsil:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.address?.tehsil}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  District:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.address?.district}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  Address Details:{" "}
                  <span style={{ fontWeight: "300" }}>
                    {sale.customer.address?.detail}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid gray",
              }}
            >
              <thead>
                <tr>
                  {TABLE_HEADER_SALE_PRODUCT.map((header) => (
                    <th
                      key={header.key}
                      style={{ border: "1px solid gray", padding: "8px" }}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getPreparedDataProducts(sale).map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid gray",
                        padding: "8px",
                      }}
                    >
                      {item.key}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid gray",
                        padding: "8px",
                      }}
                    >
                      {item.company}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid gray",
                        padding: "8px",
                      }}
                    >
                      {item.category}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid gray",
                        padding: "8px",
                      }}
                    >
                      {item.model}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid gray",
                        padding: "8px",
                      }}
                    >
                      {item.price}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid gray",
                        padding: "8px",
                      }}
                    >
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
              Payment Information
            </h1>
            <div>
              <p style={{ fontWeight: "600", fontSize: "12px" }}>
                Payment status:{" "}
                <span style={{ fontWeight: "300" }}>
                  {formatPaymentStatus(sale.paymentStatus)}
                </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: "600", fontSize: "12px" }}>
                Payment Option:{" "}
                <span style={{ fontWeight: "300" }}>
                  {formatPaymentOption(sale.paymentOption)}
                </span>
              </p>
            </div>
            {sale.fullPayment && (
              <>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "12px" }}>
                    Total price:{" "}
                    <span style={{ fontWeight: "300" }}>
                      {getTotalSale(sale.productSales)}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "12px" }}>
                    Discount:{" "}
                    <span style={{ fontWeight: "300" }}>
                      {sale.fullPayment.discount}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "12px" }}>
                    Purchase Amount:{" "}
                    <span>{sale.fullPayment.purchaseAmount}</span>
                  </p>
                </div>
              </>
            )}
            {sale.installmentPlan && (
              <>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "12px" }}>
                    Down payment:{" "}
                    <span style={{ fontWeight: "300" }}>
                      {formatPrice(sale.installmentPlan.downPayment)}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "12px" }}>
                    Installment period:{" "}
                    <span style={{ fontWeight: "300" }}>
                      {sale.installmentPlan.installmentPeriod}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "12px" }}>
                    Total Price: <span>{sale.installmentPlan.totalPrice}</span>
                  </p>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid gray",
                    }}
                  >
                    <thead>
                      <tr>
                        {TABLE_HEADER_INSTALLMENTS.map((header) => (
                          <th
                            key={header.key}
                            style={{ border: "1px solid gray", padding: "8px" }}
                          >
                            {header.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getPreparedDataInstallments(
                        sale.installmentPlan.installments
                      )?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              textAlign: "center",
                              border: "1px solid gray",
                              padding: "8px",
                            }}
                          >
                            {item.key}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              border: "1px solid gray",
                              padding: "8px",
                            }}
                          >
                            {item.expectedPayment}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              border: "1px solid gray",
                              padding: "8px",
                            }}
                          >
                            {item.actualPayment}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              border: "1px solid gray",
                              padding: "8px",
                            }}
                          >
                            {item.dueDate}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              border: "1px solid gray",
                              padding: "8px",
                            }}
                          >
                            {item.paidAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
        <footer
          style={{
            marginBlock: "20px",
            marginBottom: "80px",
            paddingInline: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "16px" }}>Customer Signature</h1>
          <h1 style={{ fontSize: "16px" }}>Stamp</h1>
        </footer>
      </div>
    </>
  );
};

export default InvoiceView;
