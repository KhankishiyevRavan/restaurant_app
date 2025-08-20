import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PaymentsTable from "../../components/tables/PaymentsTable";

export default function PaymentsTables() {
  return (
    <>
      <PageMeta
        title="XENGELAND.AZ | User List Tables"
        description="This is XENGELAND.AZ Users List Tables Dashboard page"
      />
      <PageBreadcrumb pageTitle={`Ödənişlər`} modelName="Ödəniş xidməti" />
      <div className="space-y-6">
        {/* <ComponentCard title={`Ödənişlər cədvəli`}> */}
        <PaymentsTable />
        {/* </ComponentCard> */}
      </div>
    </>
  );
}
