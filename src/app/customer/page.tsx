import MainWrapper from "@/components/Wrappers/MainWrapper";
import CustomerTable from "@/containers/customer-page/CustomerTable";
import CustomerSearchBar from "@/components/Searchbars/CustomerSearchbar";
const CustomerPage = () => {
  return (
    <MainWrapper pageName="Customer" redirectionUrl="/customer/new">
      <div className="flex flex-col gap-4">
        <CustomerSearchBar />
        <CustomerTable />
      </div>
    </MainWrapper>
  );
};
export default CustomerPage;
