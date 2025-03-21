import {createFileRoute, Link, useNavigate} from '@tanstack/react-router';
import {useForm} from 'react-hook-form';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import type {ReactElement, FC} from 'react';
import type {SubmitHandler, FieldPath} from 'react-hook-form';
import type {ValidationErrors} from '@/lib/types/error';
import type {LoginFormData} from '@/lib/types/form';

function Login(): ReactElement<FC> {
    const navigate = useNavigate({from: '/auth/login'});
    const form = useForm<LoginFormData>({
        defaultValues: {
            username: '',
            password: '',
            remember_me: false,
        }
    });
    const handleSubmit: SubmitHandler<LoginFormData> = async (data: LoginFormData): Promise<void> => {
        if(!data.remember_me) delete data.remember_me;

        const response: Response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({...data, type: 'session'}),
        });

        if(response.ok) {
            await navigate({to: '/dashboard'});
            return;
        }

        const responseData = await response.json();

        for(const [key, value] of Object.entries(responseData.errors as ValidationErrors)) {
            if(key === 'type' || key === 'remember_me') continue;

            form.setError(key as FieldPath<LoginFormData>, {message: value.err_value});
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField control={form.control} name="username" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="username..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <div className="flex items-center">
                                <FormLabel>Password</FormLabel>
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="remember_me" render={({field}): ReactElement<FC> => (
                        <FormItem className="flex flex-row items-center gap-2 space-x-1 space-y-0">
                            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember Me
                            </FormLabel>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/registration" className="underline underline-offset-4">
                        Sign Up
                    </Link>
                </div>
            </form>
        </Form>
    );
}

export const Route = createFileRoute('/auth/login')({
    component: Login,
});