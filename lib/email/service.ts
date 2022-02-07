type SendEmailProps<T> = {
  recipient: string;
  subject: string;
  templateId: string;
  data: T;
}
export const sendEmail = async <T>(emailData: SendEmailProps<T>) => {
  console.log(emailData);
}