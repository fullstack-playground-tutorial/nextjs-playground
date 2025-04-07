"use client";
import TransitionButton from "@/app/components/TransitionButton/TransitionButton";
import { register } from "@/app/feature/auth/actions";
import { ValidateErrors } from "@/app/utils/validate/model";
import React, {
  ChangeEvent,
  MutableRefObject,
  useActionState,
  useState,
} from "react";

interface Props {
  handleTransition: () => void;
  ref: MutableRefObject<HTMLDivElement>
}
interface InternalState {
  email: string;
  username: string;
  password: string;
  phone: string;
  confirmPassword: string;
}

const initialState: InternalState = {
  email: "",
  username: "",
  password: "",
  phone: "",
  confirmPassword: "",
};

export interface SignUpFormState {
  fieldErrors: ValidateErrors;
}

const initialFormState: SignUpFormState = {
  fieldErrors: {},
};

export const SignUpForm = (props: Props) => {
  const [state, setState] = useState<InternalState>(initialState);
  const [formState, formAction, pending] = useActionState<SignUpFormState, FormData>(
    register,
    initialFormState
  );

  const updateState = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className="pt-12 m-4" action={formAction}>
      <div className="rounded-xl max-w-md mx-auto bg-layer-2 p-4 shadow-lg">
        <h1 className="text-center text-3xl font-semibold pt-4">
          Sign Up
        </h1>
        <span className={`text-red-500 text-sm h-5 px-2 `}>
          {formState.fieldErrors["common"] ?? ""}
        </span>
        <div className="flex flex-col pt-4">
          <input
            className="border-app field-color-app px-2 rounded-md h-9 text-base"
            type="text"
            placeholder="Email"
            name="email"
            id="email"
            value={state.email}
            onChange={(e) => updateState(e)}
          />
          <span className={`text-red-500 text-sm h-5 px-2 `}>
            {formState.fieldErrors["email"] ?? ""}
          </span>
        </div>
        <div className="flex flex-col">
          <input
            className="border-app field-color-app px-2 rounded-md h-9 text-base"
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            value={state.username}
            onChange={(e) => updateState(e)}
          />
          <span className="text-red-500 text-sm h-5 px-2">
            {formState.fieldErrors["username"] ?? ""}
          </span>
        </div>
        <div className="flex flex-col">
          <input
            className="border-app px-2 rounded-md h-9 text-base field-color-app"
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            value={state.password}
            onChange={(e) => updateState(e)}
          />
          <span className={`text-red-500 text-sm h-5 px-2 `}>
            {formState.fieldErrors["password"] ?? ""}
          </span>
        </div>
        <div className="flex flex-col">
          <input
            className="border-app field-color-app px-2 rounded-md h-9 text-base"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            value={state.confirmPassword}
            onChange={(e) => updateState(e)}
          />
          <span className={`text-red-500 text-sm h-5 px-2 `}>
            {formState.fieldErrors["confirmPassword"] ?? ""}
          </span>
        </div>

        <div className="flex flex-col">
          <input
            className="border-app px-2 rounded-md h-9 text-base field-color-app"
            type="tel"
            placeholder="Phone number"
            name="phone"
            id="phone"
            value={state.phone}
            onChange={(e) => updateState(e)}
          />
          <span className={`text-red-500 text-sm h-5 px-2 `}>
            {formState.fieldErrors["phone"] ?? ""}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <button
            className=" mx-auto bg-blue-500 text-white font-bold py-2 px-8 hover:bg-blue-700 rounded-full"
            type="submit"
            aria-disabled = {pending}
          >
            Register
          </button>
          <h4 className="pt-4 text-sm text-gray-500 text-center pb-4">
            Already have account?{" "}
            <TransitionButton
              handleTransition={props.handleTransition}
              refElement={props.ref}
              effectTransition="page-transition"
            >
              <span className="text-blue-500 cursor-pointer hover:text-blue-700">
                Login
              </span>
            </TransitionButton>
          </h4>

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
      </div>
    </form>
  );
};
