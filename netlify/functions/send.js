const https = require("https");
const querystring = require("querystring");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  // فك بيانات الفورم
  const formData = querystring.parse(event.body);

  const name = formData.name || "No name";
  const email = formData.email || "No email";
  const subject = formData.subject || "No subject";
  const message = formData.message || "No message";

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN; // تحطه في Netlify dashboard > Site settings > Environment variables
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const textMessage = `📩 New Message from Portfolio:
👤 Name: ${name}
📧 Email: ${email}
📝 Subject: ${subject}
💬 Message: ${message}`;

  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

  // نستخدم Promise عشان نستنى رد API
  const sendToTelegram = () =>
    new Promise((resolve, reject) => {
      const data = JSON.stringify({
        chat_id: chatId,
        text: textMessage,
      });

      const req = https.request(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
        }
      );

      req.on("error", reject);
      req.write(data);
      req.end();
    });

  try {
    await sendToTelegram();
    return {
      statusCode: 200,
      body: "Message sent successfully!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Failed to send message: " + error.message,
    };
  }
};
