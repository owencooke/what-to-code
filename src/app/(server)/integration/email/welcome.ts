// import { resend } from "@/app/(server)/integration/email/config";

/**
 * Sends a welcome email to a new user.
 *
 * @param {string} email - The email of the recipient.
 * @param {string} name - The name of the recipient.
 * @returns {Promise<{ success: boolean; message: string }>} - A promise that resolves to an object containing the success status and message.
 * @throws {Error} - Throws an error if the email sending fails.
 */
const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  // TODO: Re-enable Resend email sending when domain is verified
  console.log(`[DISABLED] Welcome email would be sent to ${email}`);
  return;
  /* const { error } = await resend.emails.send({
    from: "What to Code <noreply@updates.what-to-code.dev>",
    to: [email],
    subject: "One step closer to the next Facebook! 🚀",
    html: `
        <p>Hey ${name},</p>
        
        <p>I'm Owen, part of the team here at What to Code. 
        Just wanted to personally welcome you on board! 🎉</p>
        
        <p>We can't wait to help you kickstart your next software project. Here's a quick overview of what you can do next:</p>
        <ul>
            <li>💡 <strong>Generate fresh project ideas</strong> tailored just for you</li>
            <li>📝 <strong>Flesh out those ideas</strong> with detailed features</li>
            <li>🔧 <strong>Get a head start</strong> with GitHub templates that fit your needs</li>
            <li>🚀 <strong>Start building</strong> and turn your ideas into reality!</li>
        </ul>
                    
        <p>We're just getting started and more big features are coming, so stay tuned! 👨‍💻 
        And if you have any thoughts or suggestions, we'd love to hear them via email or Twitter.
        </p>
        
        <p>Happy coding,</p>
        <p>Owen</p>
        
        <p>PS: Feel free to share your project on Twitter and mention me 
        (<a href="https://x.com/theowencooke/">@theowencooke</a>) – would love to shout you out!</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
  */
};

export { sendWelcomeEmail };
