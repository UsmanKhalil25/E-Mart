import { getOne as getOneProduct } from "@/actions/product/actions";
import { Product as ProductType } from "@/lib/type";
import DetailsNotFound from "@/components/DetailsNotFound";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import ProductDetailSection from "@/containers/product-page/ProductDetailSection";
const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOneProduct(parseInt(params.id));
  const product: ProductType | null = response.data;
  if (!product) {
    return <DetailsNotFound pageName="customer" callbackUrl="/customer" />;
  }

  return (
    <DetailWrapper
      title={"Product Information"}
      description={"Here is the complete information about the product"}
    >
      <ProductDetailSection product={product} />
    </DetailWrapper>
  );
};
export default ProductDetailPage;
