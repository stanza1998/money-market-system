import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import { defaultUser, IUser } from "../models/User";

interface ReturnType {
  mailSupervisor: (subject: string, message: string) => Promise<void>;
  mailMe: (subject: string, message: string, $cc?: string[]) => Promise<void>;
}

const useMailer = (): ReturnType => {
  const { store, api, ui } = useAppContext();
  const [supervisor, setSupervisor] = useState<IUser>({
    ...defaultUser,
  });
  const firstRender = useRef(true);
  const me = store.auth.meJson;

  const mailSupervisor = async (subject: string, message: string) => {
    if (!me || !supervisor) return;
    const $to = supervisor.email;
    const $from = me.email;

    // console.log("Supervisor: ", $to);
    // console.log("Employee: ", $from);

    if (!$to) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Your supervisor email is unknown.",
        type: "danger",
      });
      return;
    }

    if (!$from) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Your email is unknown.",
        type: "danger",
      });
      return;
    }

    const to = [$to];
    const from = $from;

    try {
      await api.mail.sendMail(to, from, subject, message);
      ui.snackbar.load({
        id: Date.now(),
        message: "Email notification sent!",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to send email notification.",
        type: "danger",
      });
    }
  };

  const mailMe = async (subject: string, message: string, $cc?: string[]) => {
    if (!me || !supervisor) return;
    const $to = me.email;
    const $from = "e-performance@ecb.org.na";

    // console.log("Employee: ", $to);
    // console.log("From: ", $from);

    if (!$to) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Your email address is unknown.",
        type: "danger",
      });
      return;
    }

    const to = [$to];
    const from = $from;
    try {
      await api.mail.sendMail(to, from, subject, message);
      ui.snackbar.load({
        id: Date.now(),
        message: "Email notification sent!",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to send email notification.",
        type: "danger",
      });
    }
  };

  // const sendWelcomeMail = async (subject: string, message: string) => {
  //   const $to = "werner@lotsinsights.com";
  //   const $from = "e-performance@ecb.org.na";
  //   const to = [$to];
  //   const from = $from;

  //   try {
  //     await api.mail.sendMail(to, from, subject, message);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (!firstRender.current) return;
  //   firstRender.current = false;
  //   const load = async () => {
  //     if (!me) return;
  //     const supervisorId = me.supervisor;
  //     try {
  //       await api.user.getByUid(supervisorId);
  //     } catch (error) {}
  //   };
  //   load();
  // }, [api.user, me]);

  // useEffect(() => {
  //   if (!me) return;
  //   const supervisorId = me.supervisor;
  //   const $supervisor = store.user.getItemById(supervisorId);
  //   if (!$supervisor) return;

  //   setSupervisor({
  //     ...defaultUser,
  //     ...$supervisor.asJson,
  //   });
  // }, [me, store.user, store.user.all]);

  const returnType: ReturnType = {
    mailSupervisor,
    mailMe,
  };
  return returnType;
};

export default useMailer;
