import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CreateUserDataForm from "../Forms/CreateUserDataForm";

export default function CreateDataUser() {
  return (
    <div>
      <PageMeta
        title="MENU.AZ | Form Elements Dashboard"
        description="This is MENU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumb pageTitle="İstifadəçi əlavə et"   modelName="İstifadəçilər"/>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <CreateUserDataForm />
        </div>
      </div>
    </div>
  );
}
