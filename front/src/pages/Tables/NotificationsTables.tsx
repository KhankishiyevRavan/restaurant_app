import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import NotificationsTable from "../../components/tables/NotificationsTable";

export default function NotificationsTables() {
  return (
    <>
      <PageMeta
        title="MENU.AZ | Satış üçün istifadəçi seçmə"
        description="This is MENU.AZ Kontrak List Tables Dashboard page"
      />
      <PageBreadcrumb pageTitle={`Bütün bildirişlər`} />
      <div className="space-y-6">
        <NotificationsTable />
      </div>
    </>
  );
}
