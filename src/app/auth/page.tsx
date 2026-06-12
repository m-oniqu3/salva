"use client";

import Button from "@/components/Button";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@utils/api/auth/login";
import { signup } from "@utils/api/auth/signup";
import { atuhSchema, AuthCredentials } from "@utils/validation/auth";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const { openModal, closeModal } = useModal();

  const form = useForm<AuthCredentials>({
    resolver: zodResolver(atuhSchema),
    defaultValues: { email: "", password: "" },
  });

  const [isAuthenticating, startIsAuthenticatingTransition] = useTransition();

  function handleAuth(mode: AuthMode, inputs: AuthCredentials) {
    startIsAuthenticatingTransition(async () => {
      try {
        const formData = new FormData();

        Object.entries(inputs).forEach(([key, value]) => {
          formData.append(key, value);
        });

        openModal({ type: ModalEnum.LOADING });

        if (mode === "login") {
          await login(formData);
        } else {
          await signup(formData);
        }
      } catch (error) {
        console.log(error);
        form.setError("root", {
          message: "Failed to authenticate.",
        });
      } finally {
        closeModal();
      }
    });
  }

  return (
    <section className=" h-full absolute-center grid place-items-center">
      <form className="flex flex-col gap-4 ">
        <header className="pb-4">
          <h1 className="font-bold text-lg">Your watchlist starts here</h1>
          <p className="text-sml">
            Sign in to continue, or create an account to get started.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="form-label ">
              Email
            </label>

            <input
              {...form.register("email")}
              className="input h-9"
              placeholder="dougking@koq.com"
            />

            <p className="input-error">
              {form.formState.errors.email?.message}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="form-label ">
              Password
            </label>

            <input
              {...form.register("password")}
              type="password"
              className="input h-9"
              placeholder="dougking"
            />

            <p className="input-error">
              {form.formState.errors.password?.message}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            className="gray"
            disabled={isAuthenticating}
            onClick={form.handleSubmit((data) => handleAuth("login", data))}
          >
            Log in
          </Button>

          <Button
            className="bg-neutral-800 text-white"
            disabled={isAuthenticating}
            onClick={form.handleSubmit((data) => handleAuth("signup", data))}
          >
            Sign up
          </Button>
        </div>
      </form>
    </section>
  );
}
