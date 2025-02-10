"use server";

import {
  shippingAddressSchema,
  signInSchema,
  signUpSchema,
} from "../validator";
import { auth, signIn, signOut } from "../../auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";
import { ShippingAddress } from "../../types";
// sign in user with credentials

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    await signIn("credentials", user);
    return {
      success: true,
      message: "Sign in successful",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// sign out user

export async function signOutUser() {
  await signOut();
}

// sign up user with credentials
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpSchema.parse({
      name: formData.get("name") as string,
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return {
      success: true,
      message: "Sign up successful",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
//

export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) {
      throw new Error("User not found");
    }
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        address,
      },
    });
    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
