import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation } from "@remix-run/react";

import LayoutContainer from "~/components/layout/LayoutContainer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { END_POINTS } from "~/constants";
import { requireUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  let userImage: string | null = null;
  if (user.UserImage?.blob) {
    const base64Image = user.UserImage?.blob.toString("base64");
    userImage = `data:${user.UserImage.contentType};base64,${base64Image}`;
  }

  return json({ user, userImage }, { status: 200 });
}

const UserProfilePage = () => {
  const { user, userImage } = useLoaderData<typeof loader>();
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
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h2 className="primary-heading">User Profile</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={userImage ?? ""}
                className="h-52 w-52 rounded-full object-cover"
                alt={user?.username ?? user?.username}
              />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="tertiary-heading">{user.username}</h3>
              <p className="tertiary-heading-normal">{user.email}</p>
              <p className="text-body-one">
                Joined on: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to={END_POINTS.SETTINGS}>
              <Button variant="invoice-primary" size="invoice-default">
                Edit Profile
              </Button>
            </Link>
            <Form method="post" action="/auth/logout">
              <Button variant="invoice-tertiary" size="invoice-default">
                Logout
              </Button>
            </Form>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return <LayoutContainer>{renderUserDetails()}</LayoutContainer>;
};

export default UserProfilePage;
