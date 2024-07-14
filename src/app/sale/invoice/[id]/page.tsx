import { getOne as getOneSale } from "@/actions/sale/actions";
import DetailsNotFound from "@/components/DetailsNotFound";
import InvoiceView from "@/containers/sale-page/InvoiceView";
import { Sale as SaleType } from "@/lib/type";

const InvoicePage = async ({ params }: { params: { id: string } }) => {
  const response = await getOneSale(parseInt(params.id));
  const sale: SaleType | null = response.data;

  if (!sale) {
    return <DetailsNotFound pageName="sale" callbackUrl="/sale" />;
  }
  return <InvoiceView sale={sale} />;
};
export default InvoicePage;
