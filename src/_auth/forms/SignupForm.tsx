import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { SignupValidation } from '@/lib/validation'
import { Loader } from 'lucide-react'
import { createUserAccount } from '@/lib/appwrite/api'
import {
  useCreateUserAccountMutation,
  useSignInAccount
} from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const SignupForm = () => {
  // use a toast as a warning message
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate()

  // rename the variable in the function
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
    useCreateUserAccountMutation()

  const { mutateAsync: signInAccount, isLoading: isSigningIn } =
    useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: ''
    }
  })

  // const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
  //   useCreateUserAccountMutation()

  // 2. Define a submit handler.
  async function onSubmit (values: z.infer<typeof SignupValidation>) {
    // create a user when clicked
    const newUser = await createUserAccount(values)

    if (!newUser) {
      return toast({ title: 'Sign up failed. Please try again' })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      return toast({ title: 'Sign in failed. Please try again' })
    }

    const isLoggedIn = await checkAuthUser()
    if (isLoggedIn) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
          create your account
        </h2>
        <p className='text-light-3 small-medium md:base-regular'>
          To use, enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 w-full mt-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='shad-button_primary'>
            {isCreatingUser ? (
              <div className='flex-center gap-2'>
                <Loader />
                Loading...
              </div>
            ) : (
              'Sign up'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Already have account?
            <Link
              to='/sign-in'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
