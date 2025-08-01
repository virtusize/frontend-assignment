export type FormProps = {
  onSuccess: () => void;
};

export type UserResponse = {
  id: string;
  username: string;
};

export type AuthMode = "login" | "register" | "forgot";

export type AuthCardProps = {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
};
