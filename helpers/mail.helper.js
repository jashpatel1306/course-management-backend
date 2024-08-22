const nodemailer = require("nodemailer");

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
      from: `Aggarwal Ecommerce <${process.env.MAIL_USER}>`, // Sender's address
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
        from: process.env.EMAIL_AUTH_USER,
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
        from: process.env.RESEND_EMAIL_AUTH_USER,
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
      } else {
        console.log("send mail with Resend");
        const result = await sendMailWithResend(to, subject, body);
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