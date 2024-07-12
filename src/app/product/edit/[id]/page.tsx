import ProductForm from "@/components/Forms/ProductForm";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import DetailsNotFound from "@/components/DetailsNotFound";
import { Product as ProductType } from "@/lib/type";
import { getOne as getOneProduct } from "@/actions/product/actions";
const ProductEditPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOneProduct(parseInt(params.id));
  const product: ProductType | null = response.data;
  if (!product) {
    return <DetailsNotFound pageName="product" callbackUrl="/product" />;
  }

  return (
    <DetailWrapper
      title={"Product Information"}
      description={"Let's add a new product"}
    >
      <ProductForm existingProduct={product} />
    </DetailWrapper>
  );
};
export default ProductEditPage;
