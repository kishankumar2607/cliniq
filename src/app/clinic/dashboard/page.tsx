// Dashboard Page
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PatientQueue from '../../components/PatientQueque'; 
import { createClient } from '@/app/utils/supabase/server';

interface QueueItem {
  queue_id: number;
  token_number: number;
  status: string;
  patient: {
    patient_id: number;
    first_name: string;
    last_name: string;
  };
}

export default async function DashboardPage() {
  const supabase = await createClient(); // Await the client

  // Fetch queue data by joining the `queue` and `patient` tables
  const { data: queue, error } = await supabase
    .from("queue")
    .select(
      `
      queue_id,
      token_number,
      status,
      patient:patient_id (patient_id, first_name, last_name)
    `
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching queue data:", error);
    return <div>Error loading queue data. Please try again later.</div>;
  }

  // Transform the data to match the QueueItem interface
  const formattedQueue: QueueItem[] = queue.map((item: any) => ({
    queue_id: item.queue_id,
    token_number: item.token_number,
    status: item.status,
    patient: {
      patient_id: item.patient.patient_id,
      first_name: item.patient.first_name,
      last_name: item.patient.last_name,
    },
  }));

  return (
    <div className="grid gap-4">
      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Patients in Queue</TabsTrigger>
          {/* <TabsTrigger value="history">Visit History</TabsTrigger> */}
        </TabsList>
        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Patients in Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pass transformed queue data to the PatientQueue component */}
              <PatientQueue queque={formattedQueue} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}