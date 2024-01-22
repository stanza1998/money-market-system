// MailApi.ts

import axios from "axios";
import { stringify } from "querystring";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BufferOptions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface EmailBody {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  message: string;
  attachment?: string;
}

export const generatePdf = async (content: any) => {
  return new Promise<Blob>((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(content);

      pdfDocGenerator.getBlob((result: Blob) => {
        resolve(result);
      }, {} as BufferOptions); // Pass an empty object as the second argument
    } catch (error) {
      reject(error);
    }
  });
};


export default class MailApi {
  API_URI: string;

  constructor(private api: AppApi, private store: AppStore, URI: string) {
    this.API_URI = URI;
  }

  async sendMail(to: string[], from: string, subject: string, message: string) {
    const body: EmailBody = {
      from: from,
      to: to.join(", "),
      subject,
      message,
    };

    const response = await axios.post(this.API_URI, body);
    return response;
  }

  async sendMailCC(
    to: string[],
    cc: string[],
    from: string,
    subject: string,
    message: string
  ) {
    const body: EmailBody = {
      from: from,
      to: to.join(", "),
      cc: cc.join(", "),
      subject,
      message,
    };

    const response = await axios.post(this.API_URI, body);
    return response;
  }

  async sendMailWithAttachment(
    to: string[],
    from: string,
    subject: string,
    message: string,
    attachmentData: any
  ) {
    try {
      // Generate a simple PDF using the utility function
      const pdfContent = {
        content: [
          { text: message, fontSize: 14 },
          // ... other elements in your PDF content
        ],
      };

      const pdfBlob = await generatePdf(pdfContent);

      // Convert the Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);

      reader.onloadend = async () => {
        if (reader.result) {
          const base64Data = (reader.result as string).split(",")[1];

          // Send email with attachment
          const body: EmailBody = {
            from: from,
            to: to.join(", "),
            subject,
            message,
            attachment: base64Data,
          };

          const response = await axios.post(this.API_URI, body);

          console.log(response.data);
        }
      };
    } catch (error) {
      console.error("Error sending email with attachment:", error);
    }
  }
}
