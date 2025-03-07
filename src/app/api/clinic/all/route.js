import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient(); // Initialize Supabase client

    // Fetch all clinics from the `clinic` table
    const { data: clinics, error } = await supabase
      .from('clinic')
      .select('clinic_id, name, address, phone');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch clinics' },
        { status: 500 }
      );
    }

    // Return the list of clinics
    return NextResponse.json(
      { data: clinics },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}