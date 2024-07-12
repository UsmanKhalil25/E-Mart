"use client";
import InstallmentForm from "@/components/Forms/InstallmentForm";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import { InstallmentPlanForm as InstallmentPlanFormType } from "@/lib/type";
import { create as createInstallment } from "@/actions/installment/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const InstallmentNewPage = ({ params }: { params: { id: string } }) => {
  const handleAddInstallment = async (
    newInstallment: InstallmentPlanFormType
  ) => {
    const router = useRouter();
    const payload = {
      newInstallment,
      installmentPlanId: parseInt(params.id),
    };
    const response = await createInstallment(payload);
    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  return (
    <DetailWrapper
      title={"Installment Information"}
      description={"Add information about the new installment"}
    >
      <InstallmentForm onInstallmentAdd={handleAddInstallment} />
    </DetailWrapper>
  );
};
export default InstallmentNewPage;
