import MainWrapper from "@/components/Wrappers/MainWrapper";
import ProductTable from "@/containers/product-page/ProductTable";
import ProductSearchBar from "@/components/Searchbars/ProductSearchBar";
const ProductPage = () => {
  return (
    <MainWrapper pageName="Product" redirectionUrl="/product/new">
      <div className="flex flex-col gap-4">
        <ProductSearchBar />
        <ProductTable />
      </div>
    </MainWrapper>
  );
};

export default ProductPage;
