import Nodemailer from 'nodemailer'
import { MailtrapTransport } from 'mailtrap'
import config from '../config'

const TOKEN = config.email_token as string

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  }),
)

const sender = {
  address: 'hello@demomailtrap.co',
  name: 'Info - Jotter',
}

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transport.sendMail({
      from: sender,
      to,
      subject,
      text,
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
