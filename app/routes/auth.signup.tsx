import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import LayoutContainer from "~/components/common/LayoutContainer";
import { ConformCheckbox } from "~/components/form/ConformCheckbox";
import ErrorMessage from "~/components/form/ErrorMessage";
import CheckboxLabel from "~/components/form/StyledCheckbox";
import StyledInput from "~/components/form/StyledInput";
import { Button } from "~/components/ui/button";
import {
  createUser,
  findExistingUser,
  getExpirationTime,
} from "~/utils/auth.server";
import { SignUpSchema } from "~/utils/schema";
import { sessionStorage } from "~/utils/session.server";
import fallbackImgSrc from "~/assets/login-background.jpg";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: () =>
      SignUpSchema.superRefine(async (data, ctx) => {
        const existingUser = await findExistingUser({ email: data.email });
        if (existingUser) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A user already exists with this email",
          });
          return z.NEVER;
        }
      }).transform(async (data) => {
        const { email, password, username } = data;
        const user = await createUser({ username, email, password });
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

const SignUpPage = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    id: "signup",
    constraint: getZodConstraint(SignUpSchema),
    lastResult: navigation.state === "idle" ? actionData?.submission : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignUpSchema });
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
                Sign in to
              </span>
              <span className=" bg-[linear-gradient(to_right,#7C5DFA,#7C5DFA80)] !text-transparent bg-clip-text">
                Invoicely
              </span>
            </h4>
            <p className="max-w-sm text-center mx-auto text-body-two text-light !font-[500] flex flex-col justify-center leading-4">
              <span>
                Welcome to Invoicely! We're thrilled to have you join our
                community.
              </span>
              <span>
                Please fill in your details to create your account and start
                managing your invoices with ease and efficiency.
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
            <StyledInput
              label="username"
              htmlFor={fields.username.id}
              error={fields.username.errors}
              {...getInputProps(fields.username, {
                type: "text",
              })}
            />
            <StyledInput
              label="name"
              htmlFor={fields.name.id}
              error={fields.name.errors}
              {...getInputProps(fields.name, {
                type: "text",
              })}
            />
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
            <StyledInput
              label="confirm password"
              htmlFor={fields.confirmPassword.id}
              error={fields.confirmPassword.errors}
              {...getInputProps(fields.confirmPassword, {
                type: "password",
              })}
            />
            <CheckboxLabel
              label="Accept terms and conditions"
              privacyText="You agree to our Terms of Service and Privacy Policy."
              htmlFor={fields.agreeToTermsOfServiceAndPrivacyPolicy.id}
            >
              <ConformCheckbox
                meta={fields.agreeToTermsOfServiceAndPrivacyPolicy}
              />
            </CheckboxLabel>
            <ErrorMessage
              errorId={fields.agreeToTermsOfServiceAndPrivacyPolicy.errorId}
              message={fields.agreeToTermsOfServiceAndPrivacyPolicy.errors}
            />

            <CheckboxLabel label="Remember me" htmlFor={fields.remember.id}>
              <ConformCheckbox meta={fields.remember} />
            </CheckboxLabel>

            <ErrorMessage errorId={form.errorId} message={signUpErrors} />
            <Button variant="invoice-primary" type="submit">
              Sign up
            </Button>
          </Form>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default SignUpPage;
