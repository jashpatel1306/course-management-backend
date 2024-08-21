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
