import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request, { params }) {
  try {
    const { clinicId } = await params; // Extract clinicId from the route parameters

    // Validate clinicId
    if (!clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    const { patientId, visitDate, visitReason } = await request.json();

    // Validate required fields
    if (!patientId || !visitDate || !visitReason) {
      return NextResponse.json(
        { error: 'patientId, visitDate, and visitReason are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient(); // Initialize Supabase client

    // Step 1: Insert into the `visit` table
    const { data: visitData, error: visitError } = await supabase
      .from('visit')
      .insert([
        {
          patient_id: patientId,
          clinic_id: clinicId,
          visit_date: visitDate,
          visit_reason: visitReason,
        },
      ])
      .select();

    if (visitError) {
      return NextResponse.json(
        { error: visitError.message },
        { status: 400 }
      );
    }

    const visitId = visitData[0].visit_id; // Get the newly created visit ID

    // Step 2: Insert into the `queue` table
    // Fetch the last token_number for the clinic and increment it
    const { data: lastTokenData, error: lastTokenError } = await supabase
      .from('queue')
      .select('token_number')
      .eq('clinic_id', clinicId)
      .order('token_number', { ascending: false })
      .limit(1)
      .single();

    let tokenNumber = 1; // Default token number if no previous tokens exist
    if (lastTokenData) {
      tokenNumber = lastTokenData.token_number + 1; // Increment the last token number
    }

    const { data: queueData, error: queueError } = await supabase
      .from('queue')
      .insert([
        {
          clinic_id: clinicId,
          patient_id: patientId,
          token_number: tokenNumber,
          status: 'pending', // Default status
        },
      ])
      .select();

    if (queueError) {
      return NextResponse.json(
        { error: queueError.message },
        { status: 400 }
      );
    }

    // Step 3: Return the token number
    return NextResponse.json(
      { token: tokenNumber },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}