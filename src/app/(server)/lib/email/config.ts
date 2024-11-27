import { Resend } from "resend";

const audienceId = process.env.RESEND_AUDIENCE_ID ?? "";
const resend = new Resend(process.env.RESEND_API_KEY);

export { audienceId, resend };
