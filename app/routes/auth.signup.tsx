import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
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

  const loginErrors = Object.entries(form.allErrors).map(([_, value]) => {
    return value.flat().join(", ");
  });

  return (
    <LayoutContainer>
      <Form id={form.id} method="post" onSubmit={form.onSubmit} noValidate>
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

        <CheckboxLabel label="Remember me" htmlFor={fields.remember.id}>
          <ConformCheckbox meta={fields.remember} />
        </CheckboxLabel>

        <ErrorMessage errorId={form.errorId} message={loginErrors} />
        <Button type="submit">signup</Button>
      </Form>
    </LayoutContainer>
  );
};

export default SignUpPage;
