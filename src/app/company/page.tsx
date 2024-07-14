import MainWrapper from "@/components/Wrappers/MainWrapper";
import CompanyTable from "@/containers/company-page/CompanyTable";
const CustomerPage = async () => {
  return (
    <MainWrapper pageName="Company" redirectionUrl="/company/new">
      <CompanyTable />
    </MainWrapper>
  );
};
export default CustomerPage;
