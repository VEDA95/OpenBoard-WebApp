import {createFileRoute} from '@tanstack/react-router';
import {useForm} from 'react-hook-form';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import type {ReactElement, FC} from 'react';
import type {SubmitHandler} from 'react-hook-form';
import type {FormDataOutput} from '@/lib/types/form';
import type {ValidationErrors} from '@/lib/types/error';

function RegistrationPage(): ReactElement<FC> {
    const form = useForm<FormDataOutput>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: ''
        }
    });
    const handleSubmit: SubmitHandler<FormDataOutput> = async (data: FormDataOutput): Promise<void> => {
        if((data.first_name as string).length === 0) delete data.first_name;
        if((data.last_name as string).length === 0) delete data.last_name;

        data.type = 'session';
        const response: Response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(data),
        })
        const responseData: any = await response.json();

        if(response.ok) return;

        for(const [key, value] of Object.entries(responseData.errors as ValidationErrors)) {
            if(key === 'type') continue;
            if(key === 'confirm_password' && value.tag === 'eqfield') {
                form.setError(key, {message: 'The value provided does not match your password'});
                continue;
            }

            form.setError(key, {message: value.err_value});
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <p className="text-balance text-sm text-muted-foreground">
                            Enter your details below to create your user account
                        </p>
                    </div>
                    <FormField control={form.control} name="username" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="m" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="confirm_password" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="first_name" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="last_name" render={({field}): ReactElement<FC> => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export const Route = createFileRoute('/auth/registration')({
    component: RegistrationPage,
});