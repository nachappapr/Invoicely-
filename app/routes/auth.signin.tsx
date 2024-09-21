import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import StyledInput from "~/components/form/StyledInput";
import { SignInSchema } from "~/utils/schema";
import { prisma } from "~/utils/db.server";
import { z } from "zod";
import { sessionStorage } from "~/utils/session.server";
import ErrorMessage from "~/components/form/ErrorMessage";
import { comparePassword, getExpirationTime } from "~/utils/auth.server";
import CheckboxLabel from "~/components/form/StyledCheckbox";
import { ConformCheckbox } from "~/components/form/ConformCheckbox";
import LayoutContainer from "~/components/common/LayoutContainer";
import { InvoiceLogin } from "~/assets/icons";
import fallbackImgSrc from "~/assets/login-background.jpg";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: () =>
      SignInSchema.transform(async (data, ctx) => {
        const user = await prisma.user.findUnique({
          select: { id: true, password: { select: { hash: true } } },
          where: { email: data.email },
        });
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid username or password",
          });
          return z.NEVER;
        }
        if (user.password) {
          const isValidPassword = await comparePassword(
            data.password,
            user.password?.hash
          );

          if (!isValidPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode["custom"],
              message: "Invalid username or password",
            });
            return z.NEVER;
          }
        }
        return { ...data, user: { id: user.id } };
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

  const { user, remember } = submission.value;

  const userSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  userSession.set("userId", user.id);

  return redirect("/invoices", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(userSession, {
        expires: remember ? getExpirationTime() : undefined,
      }),
    },
  });
}

const SignInPage = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    id: "signin",
    constraint: getZodConstraint(SignInSchema),
    lastResult: navigation.state === "idle" ? actionData?.submission : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignInSchema });
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  const loginErrors = Object.entries(form.allErrors).map(([_, value]) => {
    return value.flat().join(", ");
  });

  return (
    <LayoutContainer>
      <div className="flex p-4 bg-white dark:bg-blue-1000 rounded-lg">
        <div className="max-w-lg aspect-auto object-cover">
          <img
            className="w-full rounded-md"
            alt="A puppy sleeping on it's back with it's mouth slightly open"
            src={fallbackImgSrc}
          />
        </div>
        <div className="w-full p-8">
          <div className="flex items-center gap-1 justify-end mb-10">
            <p className="tertiary-heading-normal text-light">
              Don't have an account?
            </p>
            <Link to="/auth/signup">
              <Button className="discardButton">Sign up</Button>
            </Link>
          </div>
          <div className="mb-4">
            <h4 className="secondary-heading text-center">
              Sign in to Invoicely
            </h4>
            <p className="max-w-sm text-center text-body-two">
              Welcome to Invoicely, please enter your login details
            </p>
          </div>
          <Form
            id={form.id}
            method="post"
            onSubmit={form.onSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
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
            <CheckboxLabel label="Remember me" htmlFor={fields.remember.id}>
              <ConformCheckbox meta={fields.remember} />
            </CheckboxLabel>
            <ErrorMessage errorId={form.errorId} message={loginErrors} />
            <button type="submit" className="saveButton">
              Login
            </button>
          </Form>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default SignInPage;
