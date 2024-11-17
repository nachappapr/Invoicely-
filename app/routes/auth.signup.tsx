import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import { z } from "zod";
import fallbackImgSrc from "~/assets/login-background.jpg";
import AnimatedLoader from "~/components/common/AnimatedLoader";
import FormFieldErrorMessage from "~/components/common/FormFieldErrorMessage";
import StyledInputField from "~/components/common/StyledInputField";
import LayoutContainer from "~/components/layout/LayoutContainer";
import { Button } from "~/components/ui/button";
import { END_POINTS } from "~/constants";
import useIsFormSubmitting from "~/hooks/useIsFormSubmitting";
import { findExistingUser, requireAnonymous } from "~/utils/auth.server";
import { VerifyEmailSchema } from "~/utils/schema";
import { sendEmail } from "~/utils/sendEmail.server";
import {
  onBoardingSessionKey,
  verifySesssionStorage,
} from "~/utils/verifyEmail.session";

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
      VerifyEmailSchema.superRefine(async (data, ctx) => {
        const existingUser = await findExistingUser({ email: data.email });
        if (existingUser) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A user already exists with this email",
          });
          return z.NEVER;
        }
      }),
    async: true,
  });

  if (submission.status !== "success") {
    return json({ status: "error", submission: submission.reply() } as const, {
      status: 400,
    });
  }

  const response = await sendEmail({
    to: submission.value.email,
    subject: "Welcome to Invoice!",
    html: `<p>Click <a href="http://localhost:3000/auth/signup">here</a> to sign up.</p>`,
  });

  if (response.status === "success") {
    const { email } = submission.value;

    const verifySession = await verifySesssionStorage.getSession(
      request.headers.get("cookie")
    );

    verifySession.set(onBoardingSessionKey, email);

    return redirect(END_POINTS.ONBOARDING, {
      headers: {
        "Set-Cookie": await verifySesssionStorage.commitSession(verifySession),
      },
    });
  } else {
    return json(
      {
        status: "error",
        submission: submission.reply({
          formErrors: [response.error],
        }),
      } as const,
      {
        status: 500,
      }
    );
  }
}

const SignUpPage = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isPending = useIsFormSubmitting();

  const [form, fields] = useForm({
    id: "verify-email",
    constraint: getZodConstraint(VerifyEmailSchema),
    lastResult: navigation.state === "idle" ? actionData?.submission : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyEmailSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const signUpErrors = form.errors;

  return (
    <LayoutContainer>
      <div className="flex md:p-4 bg-white dark:bg-blue-1000 rounded-lg">
        <div
          className="hidden md:block max-w-lg w-full aspect-auto bg-cover bg-center bg-no-repeat rounded-md"
          style={{
            backgroundImage: `url(${fallbackImgSrc})`,
            filter: "grayscale(100%)",
          }}
        />
        <div className="w-full p-4 md:p-8">
          <div className="flex items-center gap-1 justify-end mb-10">
            <p className="tertiary-heading-normal text-light">
              Have an account?
            </p>
            <Link to="/auth/signin">
              <Button variant="invoice-primary">Log in</Button>
            </Link>
          </div>
          <div className="mb-4">
            <h4 className="secondary-heading text-center flex gap-1 items-center justify-center mb-2">
              <span className="bg-[linear-gradient(to_right,#0C0E16,#0C0E1660)] dark:bg-[linear-gradient(to_right,#F8F8FB,#F8F8FB60)] !text-transparent bg-clip-text">
                Let's start your
              </span>
              <span className=" bg-[linear-gradient(to_right,#7C5DFA,#7C5DFA80)] !text-transparent bg-clip-text">
                journey!
              </span>
            </h4>
            <p className="max-w-sm text-center mx-auto text-body-two text-light !font-[500] flex flex-col justify-center leading-4">
              <span>Please enter your email.</span>
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

            <FormFieldErrorMessage
              errorId={form.errorId}
              message={signUpErrors}
            />
            <Button
              variant="invoice-primary"
              type="submit"
              disabled={isPending}
            >
              {isPending ? <AnimatedLoader /> : "Submit"}
            </Button>
          </Form>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default SignUpPage;
