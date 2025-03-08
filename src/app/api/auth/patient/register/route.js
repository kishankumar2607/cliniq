import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { camelToSnakeCase, snakeToCamelCase } from '@/app/utils/transformKeys';
import { encryptData } from '../../../../components/encryptDecryptData';

export async function POST(request) {
  try {
    // Get raw patient data from the request body
    const patientData = await request.json();

    // Transform keys from camelCase to snake_case for database insertion
    const transformedData = camelToSnakeCase(patientData);

    // Set created_at timestamp and standardize email case
    transformedData.created_at = new Date().toISOString();
    transformedData.email = transformedData.email.toLowerCase();

    // Store plaintext values for authentication before encryption
    const signupEmail = transformedData.email;
    const signupPassword = transformedData.password;

    const supabase = await createClient(); // Initialize Supabase client

    // Step 1: Register the user using Supabase's email/password authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    delete transformedData.password;

    const fieldsToEncrypt = [
      "first_name",
      "last_name",
      "address",
      "phone_number",
      "health_card_number",
      "student_id",
      "emergency_contact_name",
      "emergency_contact_relationship",
      "emergency_contact_number",
    ];

    for (const field of fieldsToEncrypt) {
      if (transformedData[field]) {
        transformedData[field] = encryptData(transformedData[field]);
      }
    }

    // Step 2: Insert the patient's additional details into the `patient` table
    const { data: patientDataResponse, error: patientError } = await supabase
      .from('patient')
      .insert([transformedData])
      .select();

    if (patientError) {
      return NextResponse.json({ error: patientError.message }, { status: 400 });
    }

    // Transform snake case keys back to camel case for the response
    const camelCasePatientData = snakeToCamelCase(patientDataResponse);

    return NextResponse.json({ data: camelCasePatientData }, { status: 201 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
