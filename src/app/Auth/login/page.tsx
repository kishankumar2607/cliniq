"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Attempt to sign in using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("Invalid email or password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Error logging in:", error);
        return;
      }

      const user = data.user;
      if (!user) {
        toast.error("User not found. Please verify your credentials.", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("No user found");
        return;
      }

      if (selectedRole === "clinic") {
        const { data: clinicData, error: clinicError } = await supabase
          .from("clinic")
          .select("*")
          .eq("email", email)
          .single();

        if (clinicError) {
          toast.error("Failed to load clinic account details. Please contact support.", {
            position: "top-right",
            autoClose: 3000,
          });
          console.error("Error fetching clinic data:", clinicError);
          return;
        }
        if (clinicData) {
          toast.success("Clinic login successful!", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/clinic/dashboard");
          return;
        }
      } else if (selectedRole === "doctor") {
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctor")
          .select("*")
          .eq("email", email)
          .single();

        if (doctorError) {
          toast.error("Failed to load doctor account details. Please contact support.", {
            position: "top-right",
            autoClose: 3000,
          });
          console.error("Error fetching doctor data:", doctorError);
          return;
        }
        if (doctorData) {
          toast.success("Doctor login successful!", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/doctor/dashboard");
          return;
        }
      }

      toast.error("No matching account found for the selected role. Please check your details.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("User not found in either doctor or clinic tables.");
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="clinic">Clinic Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
