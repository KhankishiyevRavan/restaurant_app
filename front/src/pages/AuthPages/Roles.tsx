import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RolesTable from "../../components/tables/RolesTable";

export default function Roles() {
  return (
    <div>
      <PageMeta
        title="MENU.AZ | Form Elements Dashboard"
        description="This is MENU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumb pageTitle="Rol siyahısı" modelName="Rollar"/>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          {/* <ComponentCard title={`Rollar cədvəli`}> */}
            <RolesTable />
          {/* </ComponentCard> */}
        </div>
      </div>
    </div>
  );
}
