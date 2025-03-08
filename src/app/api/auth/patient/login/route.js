import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { snakeToCamelCase } from "@/app/utils/transformKeys";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient(); // Initialize Supabase client

        // Authenticate the patient using email and password
        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password,
            });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 401 }
            );
        }

        // Fetch the patient's data from the `patient` table
        const { data: patientData, error: patientError } = await supabase
            .from("patient")
            .select("*")
            .eq("email", email.toLowerCase())
            .single();

        if (patientError) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }

        // Transform snake case keys to camel case for the response
        const camelCasePatientData = snakeToCamelCase(patientData);

        return NextResponse.json(
            { data: camelCasePatientData },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
