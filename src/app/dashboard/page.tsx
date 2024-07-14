import dynamic from "next/dynamic";
import { getAll as getAllSales } from "@/actions/sale/actions";
import { getAllWithInfo as getAllCompanies } from "@/actions/company/actions";
import { PAYMENT_STATUS, SaleAllType } from "@/lib/type";
import DashboardMetrics from "@/containers/dashboard-page/DashboardMetrics";
import ProductNoStockTable from "@/containers/dashboard-page/ProductNoStockTable";
import SalePendingTable from "@/containers/dashboard-page/SalePendingTable";
const SaleChart = dynamic(() => import("@/components/Charts/SalesChart"), {
  ssr: false,
});
const CompanyChart = dynamic(() => import("@/components/Charts/CompanyChart"), {
  ssr: false,
});

interface CompanyData {
  id: number;
  companyName: string;
  numberOfProducts: number;
  totalSaleAmount: number;
  totalPurchaseAmount: number;
  totalStock: number;
}

export default async function Dashboard() {
  const responseSales = await getAllSales();
  const sales: SaleAllType[] = responseSales.sales;

  const responseCompanies = await getAllCompanies();
  const companies: CompanyData[] = responseCompanies.data;

  const totalRevenue = 0;
  const pendingPayments = sales.filter(
    (sale) => sale.paymentStatus === PAYMENT_STATUS.PENDING
  ).length;

  const totalCompanies = companies.length;

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <DashboardMetrics sales={sales} companies={companies} />
          <CompanyChart companies={companies} />
        </div>
        <SaleChart sales={sales} />
        <ProductNoStockTable />
        <SalePendingTable />
      </div>
    </>
  );
}
