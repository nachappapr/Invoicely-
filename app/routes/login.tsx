import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import StyledInput from "~/components/form/StyledInput";
import { LoginSchema } from "~/utils/schema";
import { prisma } from "~/utils/db.server";
import { z } from "zod";
import { sessionStorage } from "~/utils/session.server";
import ErrorMessage from "~/components/form/ErrorMessage";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: (intent) =>
      LoginSchema.transform(async (data, ctx) => {
        const user = await prisma.user.findUnique({
          select: { id: true },
          where: { email: data.email },
        });
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid username or password",
          });
          return z.NEVER;
        }
        // verify the password (we'll do this later)
        return { ...data, user };
      }),
    async: true,
  });
  // delete password off the payload that is sent to the client
  delete submission.payload.password;

  if (submission.status !== "success") {
    return json({ status: "error", submission: submission.reply() } as const, {
      status: 400,
    });
  }

  const { user } = submission.value;

  const userSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  userSession.set("userId", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(userSession),
    },
  });
}

const LoginPage = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    id: "login",
    constraint: getZodConstraint(LoginSchema),
    lastResult: navigation.state === "idle" ? actionData?.submission : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const loginErrors = Object.entries(form.allErrors).map(([_, value]) => {
    return value.flat().join(", ");
  });

  return (
    <div className="max-w-md mx-auto">
      <Form id={form.id} method="post" onSubmit={form.onSubmit} noValidate>
        <StyledInput
          label="email"
          htmlFor={fields.email.id}
          error={fields.email.errors}
          {...getInputProps(fields.email, {
            type: "email",
          })}
        />
        <StyledInput
          label="password"
          htmlFor={fields.password.id}
          error={fields.password.errors}
          {...getInputProps(fields.password, {
            type: "password",
          })}
        />
        <ErrorMessage errorId={form.errorId} message={loginErrors} />
        <Button type="submit">login</Button>
      </Form>
    </div>
  );
};

export default LoginPage;
