const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    context.log('📧 Email sending function triggered.');

    const toEmail = req.body?.toEmail;
    const subject = req.body?.subject;
    const bodyText = req.body?.body;

    if (!toEmail || !subject || !bodyText) {
        context.res = {
            status: 400,
            body: "Missing required fields: toEmail, subject, body"
        };
        return;
    }

    const connectionString = 'endpoint=https://cerebro-communication.uae.communication.azure.com/;accesskey=G07nfmonu31ZEUIof1hHZG5wS4g0WcD5NKUDWA7fhdzpbakI3OQiJQQJ99BFACULyCpP6MelAAAAAZCSQvZa';
    const senderAddress = 'DoNotReply@570e6e76-6857-4e9a-8aa3-b53ca4deb4e3.azurecomm.net';

    try {
        const emailClient = new EmailClient(connectionString);

        const emailMessage = {
            senderAddress,
            content: {
                subject,
                plainText: bodyText,
            },
            recipients: {
                to: [{ address: toEmail, displayName: "Client" }],
            },
        };

        const poller = await emailClient.beginSend(emailMessage);
        const result = await poller.pollUntilDone();

        context.res = {
            status: 200,
            body: {
                message: "Email sent successfully!",
                status: result.status,
                messageId: result.id,
            }
        };
    } catch (err) {
        context.log("❌ Error sending email:", err.message);
        context.res = {
            status: 500,
            body: {
                error: "Failed to send email",
                details: err.message
            }
        };
    }
};