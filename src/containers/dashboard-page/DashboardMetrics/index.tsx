import { SaleAllType, PAYMENT_STATUS } from "@/lib/type";
import { formatPrice } from "@/utils/string-utils";
interface CompanyData {
  id: number;
  companyName: string;
  numberOfProducts: number;
  totalSaleAmount: number;
  totalPurchaseAmount: number;
  totalStock: number;
}

interface DashboardMetricsProps {
  sales: SaleAllType[];
  companies: CompanyData[];
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = async ({
  sales,
  companies,
}) => {
  const totalRevenue = sales.reduce((totalSale, sale) => {
    const saleTotal = sale.productSales.reduce(
      (totalProductSale, productSale) => totalProductSale + productSale.price,
      0
    );
    return totalSale + saleTotal;
  }, 0);

  const pendingPayments = sales.reduce((count, sale) => {
    return sale.paymentStatus === PAYMENT_STATUS.PENDING ? count + 1 : count;
  }, 0);

  const totalCompanies = companies.length;

  return (
    <>
      <div className="flex flex-col h-80 w-1/3 justify-between gap-5">
        <div className="bg-white border rounded-lg shadow p-5 w-full">
          <h2 className="text-xl font-bold mb-4">Total Revenue</h2>
          <p>{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 w-full">
          <h2 className="text-xl font-bold mb-4">Pending Payments</h2>
          <p>{pendingPayments}</p>
        </div>
        <div className="bg-white border rounded-lg shadow p-5 w-full">
          <h2 className="text-xl font-bold mb-4">Total Companies</h2>
          <p>{totalCompanies}</p>
        </div>
      </div>
    </>
  );
};
export default DashboardMetrics;
