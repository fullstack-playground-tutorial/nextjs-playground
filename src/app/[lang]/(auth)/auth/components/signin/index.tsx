"use client";

import TransitionButton from "@/app/components/TransitionButton/TransitionButton";
import { useActionState, useContext, useRef, useState } from "react";
import { SignUpForm } from "../signup";
import { login } from "@/app/feature/auth/actions";
import { ValidateErrors } from "@/app/utils/validate/model";
import "../signin/index.css";
import Loading from "@/app/[lang]/loading";
import { ThemeContext } from "@/app/core/client/context/theme/ThemeContext";
import CustomSwitch from "@/app/components/ThemeToggle";
interface InternalState {
  showSignUp: boolean;
  body: HTMLElement | null;
  email: string;
  password: string;
}

export interface SigninFormState {
  fieldErrors: ValidateErrors;
}

const initialState: InternalState = {
  showSignUp: false,
  body: null,
  email: "",
  password: "",
};

const initialFormState: SigninFormState = {
  fieldErrors: {},
};

export interface Props {
  params: { language: string };
}
export const SignInForm = (props: Props) => {
  const [state, setState] = useState(initialState);
  const { theme, changeTheme } = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(undefined);
  const [formState, formAction, pending] = useActionState<
    SigninFormState,
    FormData
  >(login, initialFormState);

  const handleTransition = () => {
    setState((prev) => ({ ...prev, showSignUp: !prev.showSignUp }));
  };

  const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    updateState(e);
    // formState.fieldErrors = {};
  };

  return (
    <>
      {pending ? (
        <Loading />
      ) : (
        <div className="auth-page w-[460px]" ref={ref as any}>
          {state.showSignUp == false ? (
            <form className="pt-12 m-4" action={formAction}>
              <div className="rounded-xl max-w-md mx-auto bg-color-app-2 p-4 shadow-lg">
                <h1 className="text-center text-4xl font-semibold pt-4">
                  Sign In
                </h1>
                <div>
                  <CustomSwitch
                    onToggle={() => {
                      changeTheme(
                        theme === "dark-theme" ? "light-theme" : "dark-theme"
                      );
                    }}
                    checked={theme !== "dark-theme"}
                  />
                </div>
                <div
                  className={`pt-4 ${
                    !formState.fieldErrors["common"] ? "h-5" : ""
                  }`}
                >
                  {formState.fieldErrors["common"] && (
                    <span className={`text-red-500 text-sm h-5 px-2`}>
                      {formState.fieldErrors["common"]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col pt-2">
                  <input
                    className={`border rounded-md px-4 w-full h-8 text-base ${
                      formState.fieldErrors["email"] ? "" : "mb-5"
                    } border-app field-color-app`}
                    type="text"
                    placeholder="Email"
                    name="email"
                    id="email"
                    value={state.email}
                    onChange={(e) => onFieldChange(e)}
                  />
                  {formState.fieldErrors["email"] && (
                    <span className={`text-red-500 text-sm h-5 px-2`}>
                      {formState.fieldErrors["email"]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    className={`border rounded-md px-4 w-full h-8 text-base ${
                      formState.fieldErrors["password"] ? "" : "mb-5"
                    } border-app field-color-app`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={state.password}
                    onChange={(e) => onFieldChange(e)}
                  />
                  {formState.fieldErrors["password"] && (
                    <span className={`text-red-500 text-sm h-5 px-2`}>
                      {formState.fieldErrors["password"]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col pt-4">
                  <button
                    className=" mx-auto bg-blue-500 text-white font-bold py-2 px-8 hover:bg-blue-700 rounded-full"
                    aria-disabled={pending}
                    type="submit"
                  >
                    Login
                  </button>

                  <h4 className="pt-4 text-sm text-gray-500 text-center">
                    Don't have an account?{" "}
                    <TransitionButton
                      refElement={ref}
                      effectTransition={"page-transition"}
                      handleTransition={handleTransition}
                    >
                      <span className="text-blue-500 cursor-pointer hover:text-blue-700">
                        Sign up
                      </span>
                    </TransitionButton>
                  </h4>
                </div>
                <div className="flex flex-row pt-6 mx-auto items-center w-1/2">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-4 text-base text-gray-500 font-semibold">
                    Or
                  </span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className="py-4 flex flex-col">
                  <div className="text-gray-500 text-center text-sm pb-4">
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
      )}
    </>
  );
};
