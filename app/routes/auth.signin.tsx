import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { safeRedirect } from "remix-utils/safe-redirect";
import { z } from "zod";
import fallbackImgSrc from "~/assets/login-background.jpg";
import AnimatedLoader from "~/components/common/AnimatedLoader";
import LayoutContainer from "~/components/layout/LayoutContainer";
import { ConformCheckboxField } from "~/components/common/ConformCheckboxField";
import FormFieldErrorMessage from "~/components/common/FormFieldErrorMessage";
import CheckboxLabelWrapper from "~/components/common/CheckboxLabelWrapper";
import StyledInputField from "~/components/common/StyledInputField";
import { Button } from "~/components/ui/button";
import { END_POINTS } from "~/constants";
import useIsFormSubmitting from "~/hooks/useIsFormSubmitting";
import {
  comparePassword,
  getExpirationTime,
  requireAnonymous,
} from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { SignInSchema } from "~/utils/schema";
import { sessionStorage } from "~/utils/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // redirect to home if user is already logged in
  await requireAnonymous(request);
  return json(
    {},
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
};

export async function action({ request }: ActionFunctionArgs) {
  // redirect to home if user is already logged in
  await requireAnonymous(request);

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

  const { user, remember, redirectTo } = submission.value;

  const userSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  userSession.set("userId", user.id);

  return redirect(safeRedirect(redirectTo, END_POINTS.HOME), {
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
  const isPending = useIsFormSubmitting();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo");

  const [form, fields] = useForm({
    id: "signin",
    constraint: getZodConstraint(SignInSchema),
    lastResult: navigation.state === "idle" ? actionData?.submission : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignInSchema });
    },
    defaultValue: {
      redirectTo,
    },
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  const loginErrors = form.errors;

  return (
    <LayoutContainer>
      <div className="flex md:p-4 bg-white dark:bg-blue-1000 rounded-lg">
        <div
          className="hidden md:block first-line:marker:max-w-xl w-full aspect-auto bg-cover bg-center bg-no-repeat rounded-md"
          style={{
            backgroundImage: `url(${fallbackImgSrc})`,
            filter: "grayscale(100%)",
          }}
        />
        <div className="w-full p-4 md:p-8">
          <div className="flex items-center gap-1 justify-end mb-10">
            <p className="tertiary-heading-normal text-light">
              Don't have an account?
            </p>
            <Link to="/auth/signup">
              <Button variant="invoice-primary">Sign up</Button>
            </Link>
          </div>
          <div className="mb-4">
            <h4 className="secondary-heading text-center flex gap-1 items-center justify-center mb-2">
              <span className="bg-[linear-gradient(to_right,#0C0E16,#0C0E1660)] dark:bg-[linear-gradient(to_right,#F8F8FB,#F8F8FB60)] !text-transparent bg-clip-text">
                Sign in to
              </span>
              <span className=" bg-[linear-gradient(to_right,#7C5DFA,#7C5DFA80)] !text-transparent bg-clip-text">
                Invoicely
              </span>
            </h4>
            <p className="max-w-sm mx-auto text-center text-body-two text-light !font-[500] flex flex-col justify-center leading-4">
              <span>Welcome to Invoicely! We're excited to have you back.</span>
              <span>
                Please enter your login details to access your account and
                manage your invoices effortlessly.
              </span>
            </p>
          </div>
          <Form
            id={form.id}
            method="post"
            onSubmit={form.onSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <StyledInputField
              label="email"
              htmlFor={fields.email.id}
              error={fields.email.errors}
              {...getInputProps(fields.email, {
                type: "email",
              })}
            />
            <StyledInputField
              label="password"
              htmlFor={fields.password.id}
              error={fields.password.errors}
              {...getInputProps(fields.password, {
                type: "password",
              })}
            />
            <div className="flex justify-between items-center gap-1">
              <CheckboxLabelWrapper
                label="Remember me"
                htmlFor={fields.remember.id}
              >
                <ConformCheckboxField meta={fields.remember} />
              </CheckboxLabelWrapper>
              <Link
                to="/auth/forgot-password"
                className=" text-purple-1000 text-sm font-bold"
              >
                forgot the password?
              </Link>
            </div>
            <FormFieldErrorMessage
              errorId={form.errorId}
              message={loginErrors}
            />
            <input
              {...getInputProps(fields.redirectTo, {
                type: "hidden",
              })}
            />
            <Button
              variant="invoice-primary"
              type="submit"
              disabled={isPending}
            >
              {isPending ? <AnimatedLoader /> : "Login"}
            </Button>
          </Form>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default SignInPage;
