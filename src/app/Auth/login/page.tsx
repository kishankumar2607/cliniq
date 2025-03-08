"use client";

import { JSX, useState } from "react";
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
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import Image from "next/image";
import GreetingMessageComponent from "./../../components/GreetingMessageComponent/GreetingMessageComponent";
import ButtonComponent from "./../../components/ButtonComponent/ButtonComponent";
import TitleComponent from "./../../components/TitleComponent/TitleComponent";
import InputComponent from "./../../components/InputComponent/InputComponent";
import PasswordInputComponent from "./../../components/InputComponent/PasswordInputComponent";
import styles from "./LoginComponent.module.scss";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value);
  };

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
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
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        toast.error("User not found. Please verify your credentials.", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("No user found");
        setLoading(false);
        return;
      }

      if (selectedRole === "clinic") {
        const { data: clinicData, error: clinicError } = await supabase
          .from("clinic")
          .select("*")
          .eq("email", email)
          .single();

        if (clinicError) {
          toast.error(
            "Failed to load clinic account details. Please contact support.",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
          console.error("Error fetching clinic data:", clinicError);
          setLoading(false);
          return;
        }
        if (clinicData) {
          toast.success("Clinic login successful!", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/clinic/dashboard");
          setLoading(false);
          return;
        }
      } else if (selectedRole === "doctor") {
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctor")
          .select("*")
          .eq("email", email)
          .single();

        if (doctorError) {
          toast.error(
            "Failed to load doctor account details. Please contact support.",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
          console.error("Error fetching doctor data:", doctorError);
          setLoading(false);
          return;
        }
        if (doctorData) {
          toast.success("Doctor login successful!", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/doctor/dashboard");
          setLoading(false);
          return;
        }
      }

      toast.error(
        "No matching account found for the selected role. Please check your details.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("User not found in either doctor or clinic tables.");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className={styles.mainDivStyle}>
      <div className={styles.cardDivStyle}>
        <div className="d-flex align-items-center pb-3">
          <Image src="/logo.svg" alt="Logo" width={120} height={120} />
        </div>
        <div className="d-flex flex-column">
          <TitleComponent title="Hello," fontSize="26px" />
          <GreetingMessageComponent />
        </div>
        <div className="d-flex align-items-center flex-column pt-2">
          <div className={styles.accountLoginStyleDiv}>
            <p>Login&nbsp;</p>
            <p>to Your Account</p>
          </div>
          <div>
            <InputComponent
              label="Email"
              value={email}
              type="text"
              placeholder="test@example.com"
              helperText=""
              onChange={(value: string) => setEmail(value)}
            />

            <div className={styles.inputFeildDivStyle} />

            <PasswordInputComponent
              passwordValue={password}
              placeholder="************"
              helperText=""
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className={styles.inputFeildDivStyle} />

            <FormControl className={styles.selectStyle}>
              <InputLabel id="demo-simple-select-autowidth-label">
                Select Role
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={selectedRole}
                onChange={handleChange}
                autoWidth
                label="Select Role"
              >
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="clinic">Clinic Worker</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={styles.buttonDivStyle}>
            <ButtonComponent
              onClick={handleLogin}
              title="Submit"
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
