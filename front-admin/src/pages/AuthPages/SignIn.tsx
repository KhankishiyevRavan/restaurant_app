import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="XENGELAND.AZ | Daxil olma"
        description="Bu XENGELAND.AZ-ın daxil olma formudur."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
