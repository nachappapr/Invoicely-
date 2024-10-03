import { Form, Link, useLocation } from "@remix-run/react";
import LayoutContainer from "~/components/layout/LayoutContainer";
import { useOptionalUser } from "~/utils/user";

const UserProfilePage = () => {
  const user = useOptionalUser();
  const location = useLocation();

  const renderLogin = () => {
    if (user) return null;
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1>You are not logged in yet. Please log in to access this page.</h1>
          <pre className="text-body-lg whitespace-pre-wrap break-all">
            {location.pathname}
          </pre>
        </div>
        <Link to="/auth/signin" className="text-body-md underline">
          SignIn
        </Link>
      </div>
    );
  };

  const renderUserDetails = () => {
    if (!user) return renderLogin();
    return (
      <div>
        <h1>{`Welcome ${user?.email}`}</h1>
        <Form method="post" action="/auth/logout">
          <button type="submit">Logout</button>
        </Form>
      </div>
    );
  };

  return <LayoutContainer>{renderUserDetails()}</LayoutContainer>;
};

export default UserProfilePage;
