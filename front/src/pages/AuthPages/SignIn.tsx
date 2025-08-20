import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="MENU.AZ | Daxil olma"
        description="Bu MENU.AZ-ın daxil olma formudur."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
