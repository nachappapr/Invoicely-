import { useRouteLoaderData } from "@remix-run/react";
import { type loader } from "~/root";

export function useOptionalUser() {
  const data = useRouteLoaderData<typeof loader>("root");
  return data?.user ?? null;
}

export function useUser() {
  const user = useOptionalUser();
  if (!user) {
    throw new Error("Access Denied");
  }
  return user;
}
