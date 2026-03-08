import { useRef, useState } from 'react';
import { Field, FieldLabel, FieldGroup } from '@components/ui/field';
import { Input } from '@components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import type { ReactElement, FC, ComponentProps, FormEvent } from 'react';

export function ForgotPasswordForm(): ReactElement<FC> {
  const emailRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDisabled(true);
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
              <Field>
                <Button type="submit">Send Reset Email</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>

  );
}
