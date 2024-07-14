import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { getAllNoStock } from "@/actions/product/actions";
import { Product as ProductType } from "@/lib/type";
import { TABLE_HEADER_PRODUCT as TABLE_HEADER } from "@/constants/index";

const ProductNoStockTable = async () => {
  const response = await getAllNoStock();
  const products: ProductType[] = response.data;
  const getPreparedDataProducts = (products: ProductType[]) => {
    return products.map((product) => {
      return {
        ...product,
        company: product.company.name,
        category: product.category.name,
        sales: product.productSales.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };
    });
  };

  return (
    <div>
      <h2 className="text-sm text-gray-600">Products with no stock</h2>
      <div className="mt-5 overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER} />
          <TableBody
            columns={TABLE_HEADER}
            redirectionUrl={{
              pathname: "/product",
            }}
            data={getPreparedDataProducts(products)}
          />
        </table>
      </div>
    </div>
  );
};

export default ProductNoStockTable;
