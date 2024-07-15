import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import SaleForm from "@/components/Forms/SaleForm";
const SaleNewPage = () => {
  return (
    <DetailWrapper
      title={"Sale Information"}
      description={"Add a new Sale record here."}
    >
      <SaleForm />
    </DetailWrapper>
  );
};
export default SaleNewPage;
