import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import SubscriberCallForm from "../Forms/Call/SubscriberCallForm";

export default function Subscriber() {
  return (
    <div>
      <PageMeta
        title="MENU.AZ | Form Elements Dashboard"
        description="This is MENU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        pageTitle="Çağırışlar"
        modelName="Çağırış xidmətləri"
        pageTitleSrc="/calls"
        subTitle="Abunəçi çağırışı"
        subTwoTitle="Çağırış növü seçin"
        subTwoTitleSrc="/call"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          {/* <ComponentCard title={``}> */}
            <SubscriberCallForm />
          {/* </ComponentCard> */}
        </div>
      </div>
    </div>
  );
}
