import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { camelToSnakeCase, snakeToCamelCase } from '@/app/utils/transformKeys';

export async function POST(request) {
  try {
    const patientData = await request.json();

    // Transform camel case keys to snake case for database insertion
    const transformedData = camelToSnakeCase(patientData);

    // Add created_at timestamp
    transformedData.created_at = new Date().toISOString();
    transformedData.email = transformedData.email.toLowerCase();

    const supabase = await createClient(); // Initialize Supabase client

    // Step 1: Register the user using Supabase's email/password authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: transformedData.email,
      password: transformedData.password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    delete transformedData.password

    // Step 2: Insert the patient's additional details into the `patient` table
    const { data: patientDataResponse, error: patientError } = await supabase
      .from('patient')
      .insert([transformedData])
      .select();

    if (patientError) {
      return NextResponse.json(
        { error: patientError.message },
        { status: 400 }
      );
    }

    // Transform snake case keys to camel case for the response
    const camelCasePatientData = snakeToCamelCase(patientDataResponse);

    return NextResponse.json(
      { data: camelCasePatientData },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}