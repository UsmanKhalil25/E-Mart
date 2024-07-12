import MainWrapper from "@/components/Wrappers/MainWrapper";
import SaleTable from "@/containers/sale-page/SaleTable";
import SaleSearchBar from "@/components/Searchbars/SaleSearchBar";

const SalePage = () => {
  return (
    <MainWrapper pageName="Sale" redirectionUrl="/sale/new">
      <div className="flex flex-col gap-4">
        <SaleSearchBar />
        <SaleTable />
      </div>
    </MainWrapper>
  );
};
export default SalePage;
