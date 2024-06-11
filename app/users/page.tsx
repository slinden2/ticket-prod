import DataTableSimple from "./DataTableSimple";
import UserForm from "@/components/UserForm";
import prisma from "@/prisma/db";
import React from "react";

const Users = async () => {
  const users = await prisma.user.findMany();

  return (
    <div>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  );
};

export default Users;
