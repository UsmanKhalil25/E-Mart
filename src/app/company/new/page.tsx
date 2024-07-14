import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import CompanyForm from "@/components/Forms/CompanyForm";
const CompanyNew = () => {
  return (
    <DetailWrapper
      title={"Company Information"}
      description={"Add a new company by providing the name."}
    >
      <CompanyForm />
    </DetailWrapper>
  );
};
export default CompanyNew;
