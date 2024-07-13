import { Product as ProductType } from "@/lib/type";
import RedirectButton from "@/components/Buttons/RedirectButton";
interface ProductDetailSectionProps {
  product: ProductType;
}
const ProductDetailSection: React.FC<ProductDetailSectionProps> = ({
  product,
}) => {
  return (
    <section className="mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-600">Customer Information</h2>
        <RedirectButton
          redirectionUrl={{
            pathname: `/product/edit/${product.id}`,
          }}
          label={"Edit Product"}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Company</p>
          <p className="text-lg font-semibold text-gray-900">
            {product.company.name}
          </p>
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Category</p>
          <p className="text-lg font-semibold text-gray-900">
            {product.category.name}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Model</p>
          <p className="text-lg font-semibold text-gray-900">{product.model}</p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Price</p>
          <p className="text-lg font-semibold text-gray-900">{product.price}</p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Stock</p>
          <p className="text-lg font-semibold text-gray-900">{product.stock}</p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Sales</p>
          <p className="text-lg font-semibold text-gray-900">
            {product.productSales.length}
          </p>
        </div>

        <div className="bg-white shadow rounded-md p-4 col-span-full">
          <p className="text-sm font-medium text-gray-500">Description</p>
          <p className="text-lg font-semibold text-gray-900">
            {product.description}
          </p>
        </div>
      </div>
    </section>
  );
};
export default ProductDetailSection;
