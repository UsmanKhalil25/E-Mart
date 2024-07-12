import { getOne as getOneCustomer } from "@/actions/customer/actions";
import { Customer as CustomerType } from "@/lib/type";
import DetailsNotFound from "@/components/DetailsNotFound";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import CustomerDetailSection from "@/containers/customer-page/CustomerDetailSection";

const CustomerDetailPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOneCustomer(parseInt(params.id));
  const customer: CustomerType | null = response.data;
  if (!customer) {
    return <DetailsNotFound pageName="customer" callbackUrl="/customer" />;
  }

  return (
    <DetailWrapper
      title={"Customer Information"}
      description={"Here is the complete information about the customer"}
    >
      <CustomerDetailSection customer={customer} showEditButton={true} />
    </DetailWrapper>
  );
};
export default CustomerDetailPage;
