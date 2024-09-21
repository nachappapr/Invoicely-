import { Form, useLocation, useSubmit } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type ModalStateType = "show-modal" | "idle";

function LogoutTimer() {
  const [status, setStatus] = useState<ModalStateType>("idle");
  const location = useLocation();
  const logoutTime = 1000 * 60 * 60;
  const modalTime = logoutTime - 1000 * 60 * 5;
  const submit = useSubmit();

  const modalTimer = useRef<ReturnType<typeof setTimeout>>();
  const logoutTimer = useRef<ReturnType<typeof setTimeout>>();

  const logout = useCallback(() => {
    submit(null, {
      method: "POST",
      action: "/auth/logout",
    });
  }, [submit]);

  const cleanupTimers = useCallback(() => {
    clearTimeout(modalTimer.current);
    clearTimeout(logoutTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    cleanupTimers();
    modalTimer.current = setTimeout(() => {
      setStatus("show-modal");
    }, modalTime);
    logoutTimer.current = setTimeout(logout, logoutTime);
  }, [cleanupTimers, logout, logoutTime, modalTime]);

  useEffect(() => resetTimers(), [resetTimers, location.key]);
  useEffect(() => cleanupTimers, [cleanupTimers]);

  function closeModal() {
    setStatus("idle");
    resetTimers();
  }

  return (
    <AlertDialog open={status === "show-modal"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you still there?</AlertDialogTitle>
          <AlertDialogDescription>
            You are going to be logged out due to inactivity. Close this modal
            to stay logged in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>
            Remain Logged In
          </AlertDialogCancel>
          <Form method="post" action="/auth/logout">
            <AlertDialogAction>Logout</AlertDialogAction>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutTimer;
