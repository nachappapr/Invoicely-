import { parseWithZod } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import faviconUrl from "./assets/favicon.svg";
import SideNav from "./components/SideNav";
import LayoutContainer from "./components/common/LayoutContainer";
import { type Theme } from "./global";
import { useTheme } from "./hooks/useTheme";
import "./styles/tailwind.css";
import { csrf } from "./utils/csrf.server";
import { getEnv } from "./utils/env.server";
import { honeypot } from "./utils/honeypot.server";
import { combineHeaders, invariantResponse } from "./utils/misc";
import { ThemeSwitcherSchema } from "./utils/schema";
import { getTheme, setTheme } from "./utils/theme.server";
import { getToast } from "./utils/toast.server";
import { Toaster } from "./components/ui/toaster";
import { AlertToast } from "./components/common/Toast";
import { getUserSession, sessionStorage } from "./utils/session.server";
import { prisma } from "./utils/db.server";
import LogoutTimer from "./components/form/LogoutTimer";

export const links: LinksFunction = () => [{ rel: "icon", href: faviconUrl }];

export async function loader({ request }: LoaderFunctionArgs) {
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();
  const honeyProps = honeypot.getInputProps();
  const theme = getTheme(request);
  const { toast, headers } = await getToast(request);
  const { userId, userSession } = await getUserSession(request);

  const user = userId
    ? await prisma.user.findFirst({
        select: { id: true, email: true },
        where: {
          id: userId,
        },
      })
    : null;

  if (userId && !user) {
    throw redirect("/auth/login", {
      headers: {
        "set-cookie": await sessionStorage.destroySession(userSession),
      },
    });
  }

  return json(
    {
      ENV: getEnv(),
      theme,
      honeyProps,
      csrfToken,
      toast,
      user,
    },
    {
      headers: combineHeaders(
        csrfCookieHeader
          ? {
              "Set-Cookie": csrfCookieHeader,
            }
          : null,
        headers
      ),
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  invariantResponse(
    formData.get("intent") === "update-theme",
    "Invalid intent",
    {
      status: 400,
    }
  );

  const submission = parseWithZod(formData, { schema: ThemeSwitcherSchema });

  if (submission.status !== "success") {
    return json({ status: "error", submission: submission.reply() } as const, {
      status: 400,
    });
  }

  const responseInit = {
    headers: {
      "Set-Cookie": setTheme(submission.value.theme),
    },
  };
  return json({ status: "success", submission } as const, responseInit);
}

export const Document = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) => {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en" className={`${theme}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      </body>
    </html>
  );
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const theme = useTheme();
  const isLoggedInUser = data.user ? true : false;

  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <AnimatePresence mode="wait" key={useLocation().pathname}>
          <Document theme={theme}>
            <SideNav theme={theme} />
            <Toaster />
            {data.toast && <AlertToast {...data.toast} />}
            {isLoggedInUser ? <LogoutTimer /> : null}
          </Document>
        </AnimatePresence>
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <LayoutContainer>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </LayoutContainer>
    );
  } else if (error instanceof Error) {
    return (
      <LayoutContainer>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </LayoutContainer>
    );
  } else {
    return <LayoutContainer>Unknown Error</LayoutContainer>;
  }
}
