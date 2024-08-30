import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { IconMoon, IconSun } from "~/assets/icons";
import { type Theme } from "~/global";
import { type action } from "~/root";
import { ThemeSwitcherSchema } from "~/utils/schema";

const ThemeSwitcher = ({ userPreference }: { userPreference?: Theme }) => {
  const fetcher = useFetcher<typeof action>();
  const mode = userPreference ?? "light";
  const nextMode = mode === "light" ? "dark" : "light";

  const [form] = useForm({
    id: "theme-switch",
    lastSubmission: fetcher?.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ThemeSwitcherSchema });
    },
  });

  const renderIcon = () => {
    return mode === "light" ? <IconMoon /> : <IconSun />;
  };
  return (
    <fetcher.Form {...form.props} method="post">
      <input type="hidden" name="theme" value={nextMode} />
      <button
        type="submit"
        className="flex-4 bg-transparent"
        name="intent"
        value="update-theme"
      >
        {renderIcon()}
      </button>
    </fetcher.Form>
  );
};

export default ThemeSwitcher;
