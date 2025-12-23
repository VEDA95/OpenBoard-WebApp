import { useRef, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@lib/fetch/auth';
import type { ReactElement, FC, FormEvent, ComponentProps } from 'react';

export interface LoginFormProps extends ComponentProps<'div'> {
  showRegisterLink?: boolean;
}

export function LoginForm({ className, showRegisterLink = false, ...props }: LoginFormProps): ReactElement<FC> {
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDisabled(true);
    (async function (): Promise<void> {
      const response: Response = await login(
        usernameRef.current?.value || '',
        passwordRef.current?.value || '',
        false
      );

      if (response.status === 422) setDisabled(false);
      if (response.status === 201) await navigate({ to: '/dashboard' });
    })()
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Login with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  ref={usernameRef}
                  disabled={disabled}
                  placeholder="type username here..."
                  required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    viewTransition
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  ref={passwordRef}
                  disabled={disabled}
                  required />
              </Field>
              <Field>
                <Button type="submit" disabled={disabled}>Login</Button>
                {showRegisterLink && (
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="#">Sign up</a>
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
