import { useRef, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
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
import { Separator } from '@/components/ui/separator';
import { login } from '@lib/fetch/auth';
import { initiateOAuthFlow } from '@lib/fetch/oauth';
import type { ReactElement, FC, FormEvent } from 'react';
import type { OAuthProvider } from '@appTypes/oauth';

export interface LoginFormProps {
  showRegisterLink?: boolean;
  oauthProviders?: OAuthProvider[];
}

export function LoginForm({ showRegisterLink = false, oauthProviders = [] }: LoginFormProps): ReactElement<FC> {
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

  const handleOAuthLogin = (providerId: string): void => {
    // Store provider ID for the callback to use
    localStorage.setItem('oauth_provider_id', providerId);
    const callbackUrl = `${window.location.origin}/auth/oauth/callback`;
    initiateOAuthFlow(providerId, callbackUrl);
  };

  const hasOAuthProviders = oauthProviders.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Login with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {hasOAuthProviders && (
              <>
                <div className="flex flex-col gap-3">
                  {oauthProviders.map((provider) => (
                    <Button
                      key={provider.id}
                      variant="outline"
                      className="w-full"
                      onClick={() => handleOAuthLogin(provider.id)}
                      disabled={disabled}
                    >
                      Continue with {provider.name}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              </>
            )}
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
                  <Button type="submit" disabled={disabled} className="w-full">Login</Button>
                  {showRegisterLink && (
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <Link to="/auth/register" viewTransition>Sign up</Link>
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
