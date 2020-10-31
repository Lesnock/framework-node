import nodemailer from 'nodemailer'

class Email {
  isTest = false

  constructor(isTest = false) {
    this.isTest = isTest
  }

  async createTransporter() {
    const testAccount = await nodemailer.createTestAccount()

    const emailConfig = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: this.isTest ? testAccount.user : process.env.EMAIL_USER,
        pass: this.isTest ? testAccount.pass : process.env.EMAIL_PASS,
      },
    }

    return nodemailer.createTransport(emailConfig)
  }

  async send(options) {
    const transporter = await this.createTransporter()

    return transporter.sendMail(options)
  }
}

export default Email
