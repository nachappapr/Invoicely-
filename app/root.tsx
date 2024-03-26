import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import tailwindStyleUrl from "./styles/tailwind.css";
import faviconUrl from "./assets/favicon.svg";
import SideNav from "./components/SideNav";
import LayoutContainer from "./components/ui/LayoutContainer";
import { honeypot } from "./utils/honeypot.server";
import { getEnv } from "./utils/env.server";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { csrf } from "./utils/csrf.server";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStyleUrl },
  { rel: "icon", href: faviconUrl },
];

export async function loader() {
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();
  const honeyProps = honeypot.getInputProps();
  return json(
    {
      ENV: getEnv(),
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

export const Document = ({ children }: { children: React.ReactNode }) => {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
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
  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <HoneypotProvider {...data.honeyProps}>
        <Document>
          <SideNav />
        </Document>
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
