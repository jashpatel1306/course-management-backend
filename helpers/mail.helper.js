const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_KEY);
/**
 * Asynchronously sends an email using Nodemailer.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<Object>} An object indicating the status of the email sending operation.
 */
module.exports.sendEmail = async (email, subject, html) => {
  return new Promise(async (resolve) => {
    // Create a Nodemailer transporter object with SMTP configuration
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // SMTP server host
      port: process.env.MAIL_PORT, // SMTP server port (optional)
      secure: true, // Use SSL/TLS (optional)
      auth: {
        user: process.env.MAIL_USER, // SMTP username
        pass: process.env.MAIL_PASS, // SMTP password
      },
    });

    // Define the email options
    var mailOptions = {
      from: `Learning Management System <${process.env.MAIL_USER}>`, // Sender's address
      to: email, // Recipient's address
      subject: subject, // Email subject
      html: html, // Email content in HTML format
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error", error);
        // Return an error object if the email sending operation failed
        return resolve({
          status: false,
          data: [],
          message: {
            en: "Could not send Email!",
            es: "No se pudo enviar el correo electrónico.",
          },
        });
      }
      // Return a success object if the email sending operation was successful
      return resolve({ status: true, data: [], message: "Mail Sent..." });
    });
  });
};

const sendMailWithNodemailer = async (to, subject, body) => {
  return new Promise(async (resolve) => {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_AUTH_USER,
          pass: process.env.EMAIL_AUTH_PASS,
        },
      });
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: to,
        subject: subject,
        html: body,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("sendEmail error :", error);
          return resolve({
            status: false,
            message: "Could not send Email!",
          });
        }
        return resolve({ status: true, message: "Email sent!." });
      });
    } catch (error) {
      console.log("sendMailWithNodemailer error :", error);
      return resolve({
        status: false,
        message: error,
      });
    }
  });
};
const sendMailWithResend = async (to, subject, body) => {
  return new Promise(async (resolve) => {
    try {
      const mailOptions = {
        from: `${process.env.RESEND_EMAIL_AUTH_USER} <${process.env.RESEND_EMAIL_AUTH_USER}>`,
        to: to,
        subject: subject,
        html: body,
      };

      const { data, error } = await resend.emails.send(mailOptions);
      if (error) {
        console.log("sendEmail error:", error);
        return resolve({
          status: false,
          message: "Could not send Email!",
        });
      }
      return resolve({ status: true, message: "Email sent!." });
    } catch (error) {
      console.log("sendMailWithResend error:", error);
      return resolve({
        status: false,
        message: error.message || "An error occurred while sending the email.",
      });
    }
  });
};

module.exports.sendMailWithServices = async (to, subject, body) => {
  return new Promise(async (resolve) => {
    try {
      if (process.env.SEND_MAIL_WITH === "SES") {
        console.log("send mail with SES");
        const result = await sendMailWithSES(to, subject, body);
        return resolve(result);
      } else if (process.env.SEND_MAIL_WITH === "Resend") {
        console.log("send mail with Resend");
        const result = await sendMailWithResend(to, subject, body);
        return resolve(result);
      }else{
        console.log("send mail with Nodemailer");
        const result = await sendMailWithNodemailer(to, subject, body);
        return resolve(result);

      }
    } catch (error) {
      console.log("sendMailWithServices error :", error);
      return resolve({
        status: false,
        message: error,
      });
    }
  });
};

// module.exports.sendMailWithSendGrid(to, subject, body) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.sendgrid.net",
//       port: 587, // or 465 if you want SSL
//       secure: false, // true for 465, false for 587
//       auth: {
//         user: "apikey", // must be literally "apikey"
//         pass: process.env.SENDGRID_API_KEY, // your SendGrid API key
//       },
//     });

//     const info = await transporter.sendMail({
//       from: process.env.FROM_EMAIL, // must be verified in SendGrid
//       to,
//       subject,
//       html: body,
//     });

//     console.log("Message sent: %s", info.messageId);
//     return { status: true, message: "Email sent", info };
//   } catch (error) {
//     console.error("SendGrid SMTP error:", error);
//     return { status: false, message: error.message };
//   }
// }
