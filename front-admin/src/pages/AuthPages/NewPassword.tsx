import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import NewPasswordForm from "../../components/auth/NewPasswordForm";

export default function NewPassword() {
  return (
    <>
      <PageMeta
        title="MENU.AZ | Şifrəni yenilə"
        description="Bu səhifə MENU.AZ şifrə yeniləmə səhifəsidir."
      />
      <AuthLayout>
        <NewPasswordForm />
      </AuthLayout>
    </>
  );
}
