import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindStyleUrl from "./styles/tailwind.css";
import faviconUrl from "./assets/favicon.svg";
import SideNav from "./components/SideNav";
import LayoutContainer from "./components/ui/LayoutContainer";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStyleUrl },
  { rel: "icon", href: faviconUrl },
];

export const Document = ({ children }: { children: React.ReactNode }) => {
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
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <SideNav />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <LayoutContainer>Oops! Something went wrong</LayoutContainer>
    </Document>
  );
}
