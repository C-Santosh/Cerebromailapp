require('dotenv').config();
const express = require('express');
const { EmailClient } = require('@azure/communication-email');

const app = express();
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { toEmail, subject, body } = req.body;

  if (!toEmail || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: toEmail, subject, body' });
  }

  try {
    const emailClient = new EmailClient("endpoint=https://cerebro-communication.uae.communication.azure.com/;accesskey=G07nfmonu31ZEUIof1hHZG5wS4g0WcD5NKUDWA7fhdzpbakI3OQiJQQJ99BFACULyCpP6MelAAAAAZCSQvZa");

    const message = {
      senderAddress: "DoNotReply@570e6e76-6857-4e9a-8aa3-b53ca4deb4e3.azurecomm.net",
      content: {
        subject,
        plainText: body,
      },
      recipients: {
        to: [{ address: toEmail }],
      },
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    res.status(200).json({
      message: 'Email sent successfully!',
      status: result.status,
      messageId: result.id,
    });
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`📡 Server running on http://localhost:${PORT}`);
});
