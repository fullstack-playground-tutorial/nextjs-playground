"use client";
import TransitionButton from "@/app/components/TransitionButton/TransitionButton";
import { register } from "@/app/feature/auth/actions";
import { ValidateErrors } from "@/app/utils/validate/model";
import {
  RefObject,
  useActionState,
} from "react";

interface Props {
  handleTransition: () => void;
  ref: RefObject<HTMLDivElement>
}

export interface SignUpFormState {
  fieldErrors: ValidateErrors;
}

const initialFormState: SignUpFormState = {
  fieldErrors: {},
};

export const SignUpForm = (props: Props) => {
  const [{ fieldErrors }, formAction, pending] = useActionState<SignUpFormState, FormData>(
    register,
    initialFormState
  );


  return (
    <form action={formAction} className="rounded-xl max-w-md mx-auto bg-layer-2 p-4 shadow-lg dark:bg-surface-1 mt-4">
      <h1 className="dark:text-accent-0 text-center text-4xl font-semibold">
        Sign Up
      </h1>
      <span className={`dark:text-alert-1 text-sm h-5 px-2`}>
        {fieldErrors["common"] ?? ""}
      </span>
      <div className="flex flex-col mt-4">
        <input
          className="px-2 rounded-md h-10 text-base border dark:border-border-strong dark:focus:outline-accent-0 dark:text-primary dark:focus:outline-1 dark:placeholder:text-secondary dark:shadow dark:bg-surface-2"
          type="text"
          placeholder="Email"
          name="email"
          id="email"
          defaultValue="john.doe@example.com"
        />
        <span className={`dark:text-alert-1 text-sm h-5 px-2 `}>
          {fieldErrors["email"] ?? ""}
        </span>
      </div>
      <div className="flex flex-col">
        <input
          className="px-2 rounded-md h-10 text-base border dark:border-border-strong dark:focus:outline-accent-0 dark:text-primary dark:focus:outline-1 dark:placeholder:text-secondary dark:shadow dark:bg-surface-2"
          type="text"
          placeholder="Username"
          name="username"
          id="username"
          defaultValue="john_doe"
        />
        <span className="dark:text-alert-1 text-sm h-5 px-2">
          {fieldErrors["username"] ?? ""}
        </span>
      </div>
      <div className="flex flex-col">
        <input
          className="px-2 rounded-md h-10 text-base border dark:border-border-strong dark:focus:outline-accent-0 dark:text-primary dark:focus:outline-1 dark:placeholder:text-secondary dark:shadow dark:bg-surface-2"
          type="password"
          placeholder="Password"
          name="password"
          id="password"
          defaultValue="Secret1"
        />
        <span className={`dark:text-alert-1 text-sm h-5 px-2 `}>
          {fieldErrors["password"] ?? ""}
        </span>
      </div>
      <div className="flex flex-col">
        <input
          className="px-2 rounded-md h-10 text-base border dark:border-border-strong dark:focus:outline-accent-0 dark:text-primary dark:focus:outline-1 dark:placeholder:text-secondary dark:shadow dark:bg-surface-2"
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          id="confirmPassword"
          defaultValue="Secret1"
        />
        <span className={`dark:text-alert-1 text-sm h-5 px-2 `}>
          {fieldErrors["confirmPassword"] ?? ""}
        </span>
      </div>

      <div className="flex flex-col">
        <input
          className="px-2 rounded-md h-10 text-base border dark:border-border-strong dark:focus:outline-accent-0 dark:text-primary dark:focus:outline-1 dark:placeholder:text-secondary dark:shadow dark:bg-surface-2"
          type="tel"
          placeholder="Phone number"
          name="phone"
          id="phone"
          defaultValue="123-456-7890"
        />
        <span className={`dark:text-alert-1 text-sm h-5 px-2 `}>
          {fieldErrors["phone"] ?? ""}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <button
          className=" mx-auto cursor-pointer transition-all dark:bg-accent-0 dark:text-primary font-bold py-2 px-8 dark:hover:bg-accent-1 rounded-full"
          type="submit"
          disabled={pending}
        >
          {pending ? "Registering ..." : "Register"}
        </button>
        <h4 className="pt-4 text-sm dark:text-secondary text-center pb-4">
          Already have account?{" "}
          <TransitionButton
            handleTransition={props.handleTransition}
            refElement={props.ref}
            effectTransition="page-transition"
          >
            <span className="dark:text-blue-500 dark:hover:text-blue-600 cursor-pointer">
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
    </form>
  );
};
