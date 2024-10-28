'use client'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from 'axios';

const BASE_URL = process.env.API_URL

const formSchema = z.object({
  fullname: z.string().min(3),
  email: z.string().min(3).email(),
  password: z.string().min(6),
  passwordConfirmation: z.string().min(6),
})

export function RegisterForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        email: values.email,
        password: values.password,
        fullname: values.fullname
      }
      const response = await axios.post(`${BASE_URL}/auth/register`, payload)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your information below to register your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 mb-3">
          <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                    placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Confirmation</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                    placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline w-full">
            Sign up
          </Link>

          <Link href="/protected" className="underline w-full">
            Protected
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
