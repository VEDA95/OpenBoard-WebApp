import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@components/ui/field';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { register } from '@lib/fetch/auth';
import type { ReactElement, FC, FormEvent, ChangeEvent } from 'react';
import type { APIResponse } from '@appTypes/response';

export function RegistrationForm(): ReactElement<FC> {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;

    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirm-password') setConfirmPassword(value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDisabled(true);
    (async (): Promise<void> => {
      const response: APIResponse<{ message: string; }> = await register(
        username,
        email,
        password,
        confirmPassword,
        firstNameRef.current?.value,
        lastNameRef.current?.value
      );

      if (response.code === 422) {
        setDisabled(false);
        return;
      }

      await navigate({ to: '/auth/login' });
    })();
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>
            fill in the form below create your user account for Open Board!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  disabled={disabled}
                  onChange={handleChange}
                  placeholder="type username here..."
                  required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  disabled={disabled}
                  onChange={handleChange}
                  placeholder="type email address here..."
                  required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  disabled={disabled}
                  onChange={handleChange}
                  required />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  value={confirmPassword}
                  disabled={disabled}
                  onChange={handleChange}
                  required />
                <FieldDescription>Please confirm your password.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                <Input
                  id="first-name"
                  type="text"
                  ref={firstNameRef}
                  disabled={disabled} />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                <Input
                  id="last-name"
                  type="text"
                  ref={lastNameRef}
                  disabled={disabled} />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={disabled || (username.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0)}>
                  Create User
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
