import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request, { params }) {
  try {
    const { patientId } = params; // Extract patientId from the route parameters

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient(); // Initialize Supabase client

    // Step 1: Fetch all visits for the patient
    const { data: visits, error: visitsError } = await supabase
      .from('visit')
      .select('*')
      .eq('patient_id', patientId);

    if (visitsError) {
      return NextResponse.json(
        { error: 'Failed to fetch visits' },
        { status: 500 }
      );
    }

    // Step 2: For each visit, fetch associated visit notes, prescriptions, and invoices
    const visitsWithDetails = await Promise.all(
      visits.map(async (visit) => {
        const { data: visitNotes, error: visitNotesError } = await supabase
          .from('visitnotes')
          .select('*')
          .eq('visit_id', visit.visit_id);

        const { data: prescriptions, error: prescriptionsError } = await supabase
          .from('prescription')
          .select('*')
          .eq('visit_id', visit.visit_id);

        const { data: invoices, error: invoicesError } = await supabase
          .from('invoice')
          .select('*')
          .eq('visit_id', visit.visit_id);

        return {
          visitId: visit.visit_id,
          clinicId: visit.clinic_id,
          visitDate: visit.visit_date,
          visitReason: visit.visit_reason,
          visitNotes: visitNotes || [],
          prescriptions: prescriptions || [],
          invoices: invoices || [],
        };
      })
    );

    // Step 3: Return the visits with details
    return NextResponse.json(
      { data: visitsWithDetails },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}