import PurchaseForm from "@/components/Forms/PurchaseForm";
import PurchasePaymentForm from "@/components/Forms/PurchasePaymentForm";
import { Purchase as PurchaseType } from "@/lib/type";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import DetailsNotFound from "@/components/DetailsNotFound";

import { getOne as getOnePurchase } from "@/actions/purchase/actions";

const PurchaseEditPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOnePurchase(parseInt(params.id));
  const purchase: PurchaseType | null = response.data;
  if (!purchase) {
    return <DetailsNotFound pageName="Purchase" callbackUrl="/Purchase" />;
  }

  return (
    <DetailWrapper
      title={"Purchase Information"}
      description={"Let's edit a purchase"}
    >
      <PurchasePaymentForm
        id={purchase.id}
        totalPayment={purchase.totalAmount}
        paidAmount={purchase.paidAmount}
      />
    </DetailWrapper>
  );
};
export default PurchaseEditPage;
