import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import ProductForm from "@/components/Forms/ProductForm";

const ProductNew = () => {
  return (
    <DetailWrapper
      title={"Product Information"}
      description={"Be careful while adding product information."}
    >
      <ProductForm />
    </DetailWrapper>
  );
};
export default ProductNew;
