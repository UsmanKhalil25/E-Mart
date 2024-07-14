import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { getAllPending } from "@/actions/sale/actions";
import { SaleAllType } from "@/lib/type";
import { TABLE_HEADER_SALES as TABLE_HEADER } from "@/constants/index";
import { formatPaymentStatus, formatPaymentOption } from "@/utils/string-utils";

const SalePendingTable = async () => {
  const response = await getAllPending();
  const sales = response.data;
  const getPreparedDataSales = (sales: SaleAllType[]) => {
    return sales.map((sale) => {
      return {
        id: sale.id,
        customerName: sale.customer.firstName + " " + sale.customer.lastName,
        customerPhoneNumber: sale.customer.phoneNumber,
        paymentOption: formatPaymentOption(sale.paymentOption),
        paymentStatus: formatPaymentStatus(sale.paymentStatus),
        totalAmount: sale.productSales.reduce(
          (total, item) => total + item.price,
          0
        ),
        numberOfProducts: sale.productSales.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };
    });
  };
  const getPaymentsPendingToday = (sales: SaleAllType[]) => {
    const installments = sales.map(
      (sale) => sale.installmentPlan?.installments
    );
    return getPreparedDataSales(
      sales.filter(
        (sale) =>
          sale.installmentPlan?.installments.at(installments?.length - 1)
            ?.dueDate === new Date()
      )
    );
  };
  return (
    <div>
      <div>
        <h2 className="text-sm text-gray-600">Payments due today</h2>
        <div className="mt-5 overflow-x-auto rounded-md">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <TableHeader columns={TABLE_HEADER} />
            <TableBody
              columns={TABLE_HEADER}
              data={getPaymentsPendingToday(sales)}
              redirectionUrl={{ pathname: "/sale" }}
            />
          </table>
        </div>
      </div>
      <div>
        <h2 className="mt-5 text-sm text-gray-600">All pending payments</h2>
        <div className="mt-5 overflow-x-auto rounded-md">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <TableHeader columns={TABLE_HEADER} />
            <TableBody
              columns={TABLE_HEADER}
              data={getPreparedDataSales(sales)}
              redirectionUrl={{ pathname: "/sale" }}
            />
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalePendingTable;
