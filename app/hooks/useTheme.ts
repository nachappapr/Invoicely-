import { useFetchers, useLoaderData } from "@remix-run/react";
import { type loader } from "~/root";

export function useTheme() {
  const data = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const fetcher = fetchers.find(
    (f) => f.formData?.get("intent") === "update-theme"
  );

  const optimisticTheme = fetcher?.formData?.get("theme");

  if (optimisticTheme === "light" || optimisticTheme === "dark") {
    return optimisticTheme;
  }
  return data.theme;
}
