import React, { useState, useEffect } from "react";
import { formatPrice } from "@/utils/string-utils";
interface QuantityAndPrice {
  quantity: number;
  price: number;
}

interface ProductInputFormProps {
  initialPrice: number;
  stock: number;
  onProductAdd: (quantityAndPrice: QuantityAndPrice) => void;
}

const ProductInputForm: React.FC<ProductInputFormProps> = ({
  initialPrice,
  stock,
  onProductAdd,
}) => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string>("");

  useEffect(() => {
    if (price) {
      setFormattedPrice(formatPrice(price));
    } else {
      setFormattedPrice("");
    }
  }, [price]);

  const handleAddProduct = () => {
    if (price && quantity && quantity <= stock) {
      onProductAdd({ price, quantity });
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(event.target.value);
    setPrice(newPrice);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(newQuantity);

    if (newQuantity > stock) {
      setQuantityError(`Quantity cannot exceed stock of ${stock}`);
    } else {
      setQuantityError("");
      setPrice(initialPrice * newQuantity);
    }
  };

  return (
    <div className="w-100">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Price
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => handlePriceChange(e)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {formattedPrice && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedPrice}
            </div>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Quantity
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => handleQuantityChange(e)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
            {quantityError && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {quantityError}
              </p>
            )}
          </div>
        </div>
      </div>

      {!quantityError && (
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={handleAddProduct}
            className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Add Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductInputForm;
