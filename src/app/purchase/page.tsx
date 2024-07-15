import MainWrapper from "@/components/Wrappers/MainWrapper";
import PurchaseTable from "@/containers/purchase-page/PurchaseTable";
const PurchasePage = () => {
  return (
    <MainWrapper pageName="Purchase" redirectionUrl="/purchase/new">
      <PurchaseTable />
    </MainWrapper>
  );
};
export default PurchasePage;
