// Dashboard Page
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PatientQueue from '../../components/PatientQueque';
import VisitHistory from '../../components/VisitHistory';

export default function DashboardPage() {
  return (
    <div className="grid gap-4">
      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Patients in Queue</TabsTrigger>
          <TabsTrigger value="history">Visit History</TabsTrigger>
        </TabsList>
        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Patients in Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <PatientQueue queque={[]} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Visit History</CardTitle>
            </CardHeader>
            <CardContent>
              <VisitHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}