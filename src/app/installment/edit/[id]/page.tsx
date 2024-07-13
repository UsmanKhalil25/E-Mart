import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import DetailsNotFound from "@/components/DetailsNotFound";
import { Installment as InstallmentType } from "@/lib/type";
import { getOne as getOneInstallment } from "@/actions/installment/actions";
import InstallmentEditForm from "@/components/Forms/InstallmentEditForm";
const InstallmentNewPage = async ({
  params,
}: {
  params: { id: string; saleId: string };
}) => {
  const response = await getOneInstallment(parseInt(params.id));
  const installment: InstallmentType | null = response.data;
  if (!installment) {
    return <DetailsNotFound pageName="installment" callbackUrl="/sale" />;
  }

  return (
    <DetailWrapper
      title={"Installment Information"}
      description={"Edit an existing installment"}
    >
      <InstallmentEditForm existingInstallment={installment} />
    </DetailWrapper>
  );
};
export default InstallmentNewPage;
