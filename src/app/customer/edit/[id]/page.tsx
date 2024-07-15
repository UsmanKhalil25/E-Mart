import CustomerForm from "@/components/Forms/CustomerForm";
import { Customer as CustomerType } from "@/lib/type";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import DetailsNotFound from "@/components/DetailsNotFound";

import { getOne as getOneCustomer } from "@/actions/customer/actions";

const CustomerEditPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOneCustomer(parseInt(params.id));
  const customer: CustomerType | null = response.data;
  if (!customer) {
    return <DetailsNotFound pageName="customer" callbackUrl="/customer" />;
  }

  return (
    <DetailWrapper
      title={"Customer Information"}
      description={"Let's edit a  customer"}
    >
      <CustomerForm existingCustomer={customer} />
    </DetailWrapper>
  );
};
export default CustomerEditPage;
