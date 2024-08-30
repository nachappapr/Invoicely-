import { parse } from "@conform-to/zod";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  type ActionFunctionArgs,
  type DataFunctionArgs,
  json,
  type LinksFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
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
import LayoutContainer from "./components/ui/LayoutContainer";
import { type Theme } from "./global";
import { useTheme } from "./hooks/useTheme";
import tailwindStyleUrl from "./styles/tailwind.css";
import { csrf } from "./utils/csrf.server";
import { getEnv } from "./utils/env.server";
import { honeypot } from "./utils/honeypot.server";
import { invariantResponse } from "./utils/misc";
import { ThemeSwitcherSchema } from "./utils/schema";
import { getTheme, setTheme } from "./utils/theme.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStyleUrl },
  { rel: "icon", href: faviconUrl },
];

export async function loader({ request }: DataFunctionArgs) {
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();
  const honeyProps = honeypot.getInputProps();
  const theme = getTheme(request);
  return json(
    {
      ENV: getEnv(),
      theme,
      honeyProps,
      csrfToken,
    },
    {
      headers: csrfCookieHeader
        ? {
            "Set-Cookie": csrfCookieHeader,
          }
        : {},
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
  const location = useLocation();
  console.log(location.pathname, "router*****");

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
        <LiveReload />
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
