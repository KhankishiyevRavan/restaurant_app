import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CallsTable from "../../components/tables/CallsTable";

export default function Calls() {
  return (
    <div>
      <PageMeta
        title="MENU.AZ | Form Elements Dashboard"
        description="This is MENU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumb pageTitle="Çağırışlar" modelName="Çağırış xidmətləri" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          {/* <ComponentCard title={``}> */}
            <CallsTable />
          {/* </ComponentCard> */}
        </div>
      </div>
    </div>
  );
}
