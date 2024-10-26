import { forwardRef } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

const UserAvatarButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    imageUrl: string;
    fallbackText: string;
  }
>(({ imageUrl, fallbackText, ...props }, ref) => (
  <button
    ref={ref}
    className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-1000 focus:ring-offset-2 focus:ring-offset-blue-1000 transition-shadow"
    {...props}
  >
    <Avatar className="h-full w-full">
      <AvatarImage src={imageUrl} alt="User avatar" />
    </Avatar>
  </button>
));
UserAvatarButton.displayName = "UserAvatarButton";

export default UserAvatarButton;
