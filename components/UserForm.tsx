"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { userSchema } from "@/validation/user";

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
}

const UserForm = ({ user }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  async function onSubmit(values: UserFormData) {
    try {
      setIsSubmitting(true);
      setError("");

      if (user) {
        await axios.patch("/api/users/" + user.id, values);
      } else {
        await axios.post("/api/users", values);
      }

      setIsSubmitting(false);
      router.push("/tickets");
      router.refresh();
    } catch (error) {
      setError("Unknown error occured.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="name"
            defaultValue={user?.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Users Full Name..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            defaultValue={user?.username}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a Username..." {...field} />
                </FormControl>
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
                    required={user ? false : true}
                    placeholder="Enter Password..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="role"
              defaultValue={user?.role}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="TECH">Tech</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {user ? "Update User" : "Create User"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default UserForm;
