import { Resend } from "resend";

const SenderService = {
    async sendEmail({to, subject, html, from}) {
        try {
            const response = await new Resend(process.env.RESEND_API_KEY).emails.send({
                from: from || 'onboarding@resend.dev',
                to,
                subject,
                html,
            });
        } catch(err) {
            console.error("Email send error:", err);
            throw new Error("Failed to send email");
        }
    },
};

export default SenderService