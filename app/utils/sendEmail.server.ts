import { Resend } from "resend";
import { getErrorMessage } from "./misc";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailPayloadType = {
  to: string;
  subject: string;
  html: string;
};

const FROM_EMAIL = "nextdevaws@gmail.com";

export const sendEmail = async (emailPayload: EmailPayloadType) => {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    ...emailPayload,
  });

  if (!error) {
    return {
      status: "success",
    } as const;
  } else {
    return {
      status: "error",
      error: getErrorMessage(error),
    } as const;
  }
};
