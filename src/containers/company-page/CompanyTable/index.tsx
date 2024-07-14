import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { TABLE_HEADER_COMPANIES as TABLE_HEADER } from "@/constants/index";
import { getAllWithInfo as getAllCompanies } from "@/actions/company/actions";
interface CompanyData {
  id: number;
  companyName: string;
  numberOfProducts: number;
  totalSaleAmount: number;
  totalPurchaseAmount: number;
  totalStock: number;
}
const ProductTable = async () => {
  const response = await getAllCompanies();
  const companies: CompanyData[] = response.data;
  return (
    <div className="overflow-x-auto rounded-md">
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <TableHeader columns={TABLE_HEADER} />
        <TableBody columns={TABLE_HEADER} data={companies} />
      </table>
    </div>
  );
};

export default ProductTable;
