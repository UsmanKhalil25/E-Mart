import MainWrapper from "@/components/Wrappers/MainWrapper";
import SaleTable from "@/containers/sale-page/SaleTable";

const SalePage = () => {
  return (
    <MainWrapper pageName="Sale" redirectionUrl="/sale/new">
      <SaleTable />
    </MainWrapper>
  );
};
export default SalePage;
