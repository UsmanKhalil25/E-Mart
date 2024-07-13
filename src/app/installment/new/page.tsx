import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import InstallmentNewForm from "@/components/Forms/InstallmentNewForm";
const ProductNew = () => {
  return (
    <DetailWrapper
      title={"Product Information"}
      description={"Be careful while adding product information."}
    >
      <InstallmentNewForm />
    </DetailWrapper>
  );
};
export default ProductNew;
