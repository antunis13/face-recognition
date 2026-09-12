"use client";

import { useState } from "react";
import { LoginUi } from "./ui/login-ui";

export const LoginScreen = () => {
  const [isSignInForm, setIsSignInForm] = useState(false);

  return (
    <LoginUi
      onGoToSignIn={() => setIsSignInForm(true)}
      isSignInForm={isSignInForm}
      setIsSignInForm={setIsSignInForm}
    />
  );
};
