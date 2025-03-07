import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

// http://localhost:3000/api/clinic/1

export async function GET(request, { params }) {
  try {
    const { clinicId } = await params; // Extract clinicId from the URL

    if (!clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient(); // Initialize Supabase client

    // Fetch clinic details from the `clinic` table
    const { data: clinicData, error } = await supabase
      .from('clinic')
      .select('name, address, phone')
      .eq('clinic_id', clinicId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: clinicData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}