import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import ProductSelectionForm from "@/components/Forms/product-selection-form";
import { search as searchProduct } from "@/actions/product/actions";
import { getAll as getAllCompanies } from "@/actions/company/actions";
import { getAll as getAllCategories } from "@/actions/category/actions";
import { Company, Category, Product } from "@/lib/type";

interface QuantityAndPrice {
  quantity: number;
  price: number;
}
interface ProductsWithInfo {
  product: Product;
  quantity: number;
  price: number;
}
interface ProductSearchBarProps {
  onProductSelected: (productsWithInfo: ProductsWithInfo) => void;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  onProductSelected,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const companiesRes = await getAllCompanies();
      setCompanies(companiesRes);
      const categoriesRes = await getAllCategories();
      setCategories(categoriesRes);
    };
    fetchData();
  }, []);

  const handleCompanyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(event.target.value);
  };
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };
  const handleSelectProductLocal = (product: Product) => {
    if (product.stock > 0) {
      setSelectedProduct(product);
    }
  };
  const handleSelectProduct = (quantityAndPrice: QuantityAndPrice) => {
    if (selectedProduct) {
      setSelectedProduct(undefined);
      setProducts(undefined);
      setSearchQuery("");
      setSelectedCompany("");
      setSelectedCategory("");
      const productWithInfo = {
        product: selectedProduct,
        price: quantityAndPrice.price,
        quantity: quantityAndPrice.quantity,
      };
      onProductSelected(productWithInfo);
    }
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCompany || !selectedCategory || !searchQuery) {
      return;
    }
    try {
      const response = await searchProduct({
        company: parseInt(selectedCompany),
        category: parseInt(selectedCategory),
        query: searchQuery as string,
      });
      if (response.status === 200) {
        const productsData: Product[] = response.data;
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Error occurred searching for products:", error);
    }
  };
  return (
    <form onSubmit={handleSearch} className="max-w-xl mr-auto">
      <div className="flex items-center">
        <div className="relative w-1/3">
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            required
            className="block border-2 border-zinc-950 w-full py-2.5 px-4 text-sm font-semibold text-white bg-neutral-950 rounded-s-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-950"
          >
            <option value="" disabled>
              Company
            </option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-1/3">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            className="block border-2 border-zinc-950 w-full py-2.5 px-4 text-sm font-semibold text-white bg-neutral-950  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-950"
          >
            <option value="" disabled>
              Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-2/3">
          <input
            type="search"
            className="block border-0 w-full py-3 px-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950"
            placeholder="Search product"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 font-medium h-full text-white bg-neutral-950 rounded-e-lg hover:bg-neutral-900"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
      {products && products.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold mb-2">Products Found:</h2>
          <ul className="space-y-2 max-h-36 overflow-y-auto">
            {products.map((product) => (
              <li
                onClick={() => handleSelectProductLocal(product)}
                key={product.id}
                className={`bg-white ${selectedProduct === product ? "border-2 border-neutral-900" : ""} ${product.stock > 0 ? "hover:bg-white/10  cursor-pointer" : ""}  rounded-lg shadow-md py-2 px-4 flex items-center justify-between `}
              >
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    Model: {product.model}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Company: {product.company.name}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Category: {product.category.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">
                    Price: {product.price}
                  </p>
                  <p
                    className={`text-gray-700 text-sm font-semibold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    Stock: {product.stock}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!products ||
        (products.length === 0 && (
          <div className="mt-4">
            {
              <p className="text-red-500 text-sm font-semibold">
                No products found.
              </p>
            }
          </div>
        ))}
      {selectedProduct && (
        <ProductSelectionForm
          initialPrice={selectedProduct.price}
          stock={selectedProduct.stock}
          onProductAdd={handleSelectProduct}
        />
      )}
    </form>
  );
};
export default ProductSearchBar;
