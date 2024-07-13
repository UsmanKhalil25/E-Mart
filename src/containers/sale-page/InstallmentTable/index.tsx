"use client";
import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { TABLE_HEADER_INSTALLMENTS } from "@/constants/index";
import { formatDate } from "@/utils/string-utils";
import { Sale as SaleType, Installment as InstallmentType } from "@/lib/type";
import RedirectButton from "@/components/Buttons/RedirectButton";

interface InstallmentTableProps {
  sale: SaleType;
}
const InstallmentTable: React.FC<InstallmentTableProps> = ({ sale }) => {
  const getPreparedDataInstallments = (installments?: InstallmentType[]) => {
    return installments?.map((item, key) => {
      const expectedPayment = item.expectedPayment;
      const actualPayment = item.actualPayment;
      const dueDate = item.dueDate;
      const paidAt = item.paidAt;
      return {
        id: item.id,
        key: key + 1,
        expectedPayment,
        actualPayment: actualPayment ? actualPayment : 0,
        dueDate: formatDate(dueDate),
        paidAt: paidAt ? formatDate(paidAt) : "Not paid yet",
      };
    });
  };

  return (
    <section className="mt-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-600">
          Click on a installment to update the payment
        </h2>
        <RedirectButton
          redirectionUrl={{
            pathname: "/installment/new",
            query: {
              saleId: sale.id,
              installmentPlan: sale.installmentPlan?.id,
            },
          }}
          label="New installment"
        />
      </div>
      <div className="mt-4 overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER_INSTALLMENTS} />
          <TableBody
            redirectionUrl={{
              pathname: "/installment/edit",
              query: { saleId: sale.id },
            }}
            columns={TABLE_HEADER_INSTALLMENTS}
            data={getPreparedDataInstallments(
              sale.installmentPlan?.installments
            )}
          />
        </table>
      </div>
    </section>
  );
};
export default InstallmentTable;
