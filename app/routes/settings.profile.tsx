import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { getUserSession } from "~/utils/session.server";

type ProfileActionArgs = {
  request: Request;
  userId: string;
  formData: FormData;
};

const signOutOfSessionsActionIntent = "sign-out-of-session";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      UserImage: true,
    },
  });

  const sessionCount = await prisma.session.count({
    where: { userId: userId, expirationTime: { gt: new Date() } },
  });

  return { user, sessionCount };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case signOutOfSessionsActionIntent:
      return signOutOfSessionAction({ request, userId, formData });
    default:
      throw new Response(`Invalid intent ${intent}`, { status: 400 });
  }
};

const signOutOfSessionAction = async ({
  request,
  userId,
}: ProfileActionArgs) => {
  const { sessionId } = await getUserSession(request);
  await prisma.session.deleteMany({
    where: {
      userId: userId,
      id: {
        not: sessionId,
      },
    },
  });
  return json({ status: "success" } as const, { status: 200 });
};

const SignOutOfSessions = () => {
  const fetcher = useFetcher<typeof signOutOfSessionAction>();
  const { sessionCount } = useLoaderData<typeof loader>();

  if (sessionCount === 1) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        You have 1 active session.
      </p>
    );
  }
  return (
    <fetcher.Form method="post">
      <Button type="submit" name="intent" value={signOutOfSessionsActionIntent}>
        Signout of {sessionCount - 1} other sessions.
      </Button>
    </fetcher.Form>
  );
};

const UserProfileEditPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-indigo-1050 dark:text-white-1000">
            Edit Profile
          </h2>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {/* <Image
                src={imageUrl}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              /> */}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-indigo-1050 dark:text-white-1000"
              >
                Profile Picture
              </Label>
              <Input
                id="image"
                type="file"
                // onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-indigo-1050 dark:text-white-1000"
              >
                Name
              </Label>
              <Input
                id="name"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
                className="border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-indigo-1050 dark:text-white-1000"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-indigo-1050 dark:text-white-1000"
              >
                New Password (optional)
              </Label>
              <Input
                id="password"
                type="password"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                className="border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="submit"
              variant="invoice-primary"
              size="invoice-default"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="invoice-tertiary"
              size="invoice-default"
              // onClick={() => router.push("/user-profile")}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
      <SignOutOfSessions />
    </div>
  );
};

export default UserProfileEditPage;
