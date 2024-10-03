import { Link, useLocation } from "@remix-run/react";
import LayoutContainer from "~/components/layout/LayoutContainer";

export function loader() {
  throw new Response("Not Found", { status: 404 });
}

const NotFound = () => {
  return <ErrorBoundary />;
};

export function ErrorBoundary() {
  const location = useLocation();
  return (
    <LayoutContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1>We can't find this page:</h1>
          <pre className="text-body-lg whitespace-pre-wrap break-all">
            {location.pathname}
          </pre>
        </div>
        <Link to="/invoices" className="text-body-md underline">
          Back to home
        </Link>
      </div>
    </LayoutContainer>
  );
}

export default NotFound;
