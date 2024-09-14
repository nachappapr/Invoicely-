import { useEffect, useRef } from "react";
import { useToast } from "~/hooks/use-toast";

type AlertToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export const AlertToast = ({
  title,
  description,
  variant = "default",
}: AlertToastProps) => {
  const { toast } = useToast();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    buttonRef.current.click();
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={() => {
        toast({
          title,
          description,
          variant,
        });
      }}
    >
      Show Toast
    </button>
  );
};
