
import { createClient } from '@/app/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient(); // Await the client

  const { data: clinics } = await supabase.from("clinic").select();

  return (
    <ul>
      {clinics?.map((clinic) => (
        <li key={clinic.clinic_id}>
          <strong>{clinic.name}</strong> - {clinic.address} - {clinic.phone} - {clinic.email}
        </li>
      ))}
    </ul>
  );
}
