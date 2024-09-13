import { parse } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import faviconUrl from "./assets/favicon.svg";
import SideNav from "./components/SideNav";
import LayoutContainer from "./components/common/LayoutContainer";
import { type Theme } from "./global";
import { useTheme } from "./hooks/useTheme";
import { csrf } from "./utils/csrf.server";
import { getEnv } from "./utils/env.server";
import { honeypot } from "./utils/honeypot.server";
import { combineHeaders, invariantResponse } from "./utils/misc";
import { ThemeSwitcherSchema } from "./utils/schema";
import { getTheme, setTheme } from "./utils/theme.server";
import { toastSessionStorage } from "./utils/toast.server";
import "./styles/tailwind.css";

export const links: LinksFunction = () => [{ rel: "icon", href: faviconUrl }];

export async function loader({ request }: LoaderFunctionArgs) {
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();
  const honeyProps = honeypot.getInputProps();
  const theme = getTheme(request);
  const cookie = request.headers.get("cookie");
  const toastCookieSession = await toastSessionStorage.getSession(cookie);

  const toast = toastCookieSession.get("toast");

  return json(
    {
      ENV: getEnv(),
      theme,
      honeyProps,
      csrfToken,
      toast,
    },
    {
      headers: combineHeaders(
        csrfCookieHeader
          ? {
              "Set-Cookie": csrfCookieHeader,
            }
          : null,
        {
          "Set-Cookie": await toastSessionStorage.commitSession(
            toastCookieSession
          ),
        }
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

  const submission = parse(formData, { schema: ThemeSwitcherSchema });

  if (submission.intent !== "submit") {
    return json({ status: "success", submission } as const);
  }

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
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

  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <AnimatePresence mode="wait" key={useLocation().pathname}>
          <Document theme={theme}>
            <SideNav theme={theme} />
          </Document>
        </AnimatePresence>
      </HoneypotProvider>
    </AuthenticityTokenProvider>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <LayoutContainer>Oops! Something went wrong</LayoutContainer>
    </Document>
  );
}
