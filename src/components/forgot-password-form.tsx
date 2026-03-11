import { useRef, useState } from 'react';
import { Field, FieldLabel, FieldGroup } from '@components/ui/field';
import { Input } from '@components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { forgotPasswordStart } from '@lib/fetch/auth';
import type { ReactElement, FC, FormEvent } from 'react';

export function ForgotPasswordForm(): ReactElement<FC> {
  const emailRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDisabled(true);
    setMessage(null);
    (async (): Promise<void> => {
      const response = await forgotPasswordStart(emailRef.current?.value || '');
      if (response.code === 200 || response.code === 201) {
        setMessage('If an account with that email exists, a reset link has been sent.');
      } else {
        setDisabled(false);
      }
    })();
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
          <CardDescription>
            Reset the password to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  ref={emailRef}
                  disabled={disabled}
                  placeholder="type email here..."
                  required />
              </Field>
              {message && (
                <p className="text-sm text-muted-foreground text-center">{message}</p>
              )}
              <Field>
                <Button type="submit" disabled={disabled}>Send Reset Email</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>

  );
}
