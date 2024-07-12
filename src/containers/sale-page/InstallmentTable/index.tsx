"use client";
import { useState } from "react";
import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { TABLE_HEADER_INSTALLMENTS } from "@/constants/index";
import { formatDate } from "@/utils/string-utils";
import { Sale as SaleType, Installment as InstallmentType } from "@/lib/type";
import RedirectButton from "@/components/Buttons/RedirectButton";
import EditInstallmentModal from "@/components/Modals/EditInstallmentModal";

interface InstallmentTableProps {
  sale: SaleType;
}
const InstallmentTable: React.FC<InstallmentTableProps> = ({ sale }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingInstallment, setExistingInstallment] =
    useState<InstallmentType>();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getPreparedDataInstallments = (installments?: InstallmentType[]) => {
    return installments?.map((item, key) => {
      console.log("installment: ", item);
      const expectedPayment = item.expectedPayment;
      const actualPayment = item.actualPayment;
      const dueDate = item.dueDate;
      const paidAt = item.paidAt;
      return {
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
      {existingInstallment && (
        <EditInstallmentModal
          existingInstallment={existingInstallment}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
        />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-600">
          Click on a installment to update the payment
        </h2>
        <RedirectButton
          redirectionUrl={`/installment/new/${sale.installmentPlan?.id}`}
          label="New installment"
        />
      </div>
      <div className="mt-4 overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER_INSTALLMENTS} />
          <TableBody
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
