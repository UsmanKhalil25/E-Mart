import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import PurchaseForm from "@/components/Forms/PurchaseForm";
const PurchaseNewPage = () => {
  return (
    <DetailWrapper
      title={"Purchase Information"}
      description={"Add a new Purchase record here."}
    >
      <PurchaseForm />
    </DetailWrapper>
  );
};
export default PurchaseNewPage;
