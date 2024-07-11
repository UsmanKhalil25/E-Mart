import CustomerForm from "@/components/Forms/CustomerForm";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
const CustomerNew = () => {
  return (
    <DetailWrapper
      title={"Customer Information"}
      description={"Let's add a new customer"}
    >
      <CustomerForm />
    </DetailWrapper>
  );
};
export default CustomerNew;
