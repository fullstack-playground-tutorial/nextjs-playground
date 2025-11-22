"use client";

import TransitionButton from "@/app/components/TransitionButton/TransitionButton";
import { useActionState, useEffect, useRef, useState } from "react";
import { SignUpForm } from "../signup";
import { login } from "@/app/feature/auth/actions";
import { ValidateErrors } from "@/app/utils/validate/model";
import "./index.css";
import { UserInfo } from "@/app/feature/auth";
import { useRouter, useSearchParams } from "next/navigation";

interface InternalState {
  showSignUp: boolean;
}

export interface SigninFormState {
  fieldErrors: ValidateErrors;
  info?: UserInfo;
  loginSuccess: boolean;
}

const initialState: InternalState = {
  showSignUp: false,
};

const initialFormState: SigninFormState = {
  fieldErrors: {},
  loginSuccess: false,
};

export interface Props {
  modal: boolean;
  params: { language: string };
}
export const SignInForm = (props: Props) => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const ref = useRef<HTMLDivElement>(undefined);
  const [{ fieldErrors, loginSuccess }, formAction, pending] = useActionState<
    SigninFormState,
    FormData
  >(login, initialFormState);
  const handleTransition = () => {
    setState((prev) => ({ ...prev, showSignUp: !prev.showSignUp }));
  };

  useEffect(() => {
    if (loginSuccess) {
      if (props.modal) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  }, [loginSuccess]);

  return (
    <>
      <div
        className="transition-all dark:bg-surface-1 w-100 rounded-xl dark:shadow dark:border dark:border-border"
        ref={ref as any}
      >
        {state.showSignUp == false ? (
          <form className="w-full h-full" action={formAction}>
            <div className="rounded-xl max-w-md mx-auto bg-layer-2 p-4 shadow-lg">
              <div className="text-center text-4xl font-semibold mt-4 dark:text-accent-0">
                Sign In
              </div>
              <div className={`pt-4 ${!fieldErrors["common"] ? "h-5" : ""}`}>
                {fieldErrors["common"] && (
                  <span className={`dark:text-alert-1 text-sm h-5 px-2`}>
                    {fieldErrors["common"]}
                  </span>
                )}
              </div>
              <div className="flex flex-col pt-2">
                <input
                  className={`transition-all dark:border dark:border-border-strong dark:bg-surface-2 placeholder:text-tertiary-0 dark:focus:outline-1 dark:outline-accent-1 rounded-md px-4 w-full h-10 text-base ${
                    fieldErrors["email"] ? "" : "mb-5"
                  }`}
                  type="text"
                  placeholder="Email"
                  name="email"
                  defaultValue={"john.doe@example.com"}
                  id="email"
                />
                {fieldErrors["email"] && (
                  <span className={`dark:text-alert-1 text-sm h-5 px-2`}>
                    {fieldErrors["email"]}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  className={`dark:border dark:border-border-strong dark:bg-surface-2 placeholder:text-tertiary-0 dark:focus:outline-1 dark:outline-accent-1 rounded-md px-4 w-full h-10 text-base ${
                    fieldErrors["password"] ? "" : "mb-5"
                  }`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  defaultValue={"Secret1"}
                  id="password"
                />
                {fieldErrors["password"] && (
                  <span className={`dark:text-alert-1 text-sm h-5 px-2`}>
                    {fieldErrors["password"]}
                  </span>
                )}
              </div>
              <div className="flex flex-col pt-4">
                <button
                  className="font-bold dark:active:bg-accent-0 rounded-full py-2 px-8 mx-auto cursor-pointer transition-all dark:shadow dark:hover:shadow-lg dark:bg-accent-0 dark:text-primary hover:bg-accent-1"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? "Login ... " : "Login"}
                </button>

                <h4 className="mt-4 text-sm dark:text-secondary text-center">
                  Don't have an account?{" "}
                  <TransitionButton
                    refElement={ref}
                    effectTransition={"page-transition"}
                    handleTransition={handleTransition}
                  >
                    <span className="text-tertiary-0 cursor-pointer dark:text-blue-500 dark:hover:text-blue-600">
                      Sign up
                    </span>
                  </TransitionButton>
                </h4>
              </div>
              <div className="flex flex-row pt-6 mx-auto items-center w-1/2">
                <div className="flex-grow border-t dark:border-border-strong"></div>
                <span className="flex-shrink mx-4 text-base dark:text-secondary font-semibold">
                  Or
                </span>
                <div className="flex-grow border-t dark:border-border-strong"></div>
              </div>

              <div className="py-4 flex flex-col">
                <div className="dark:text-secondary text-center text-sm pb-4">
                  Sign in with
                </div>
                <div className="flex flex-row gap-4 mx-auto">
                  {/* <GoogleLoginBtn />
              <GoogleLoginBtn />
              <GoogleLoginBtn /> */}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <SignUpForm handleTransition={handleTransition} ref={ref as any} />
        )}
      </div>
    </>
  );
};
