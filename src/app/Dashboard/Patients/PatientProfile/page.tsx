// Individual Patient Profile
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const patient = {
  id: '1',
  name: 'John Doe',
  status: 'Active',
  age: 35,
  gender: 'Male',
  phone: '+1 123-456-7890',
  email: 'john.doe@example.com',
  address: '123 Main St, New York, NY 10001',
};

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{patient.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">ID</p>
            <p>{patient.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p>{patient.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p>{patient.age}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p>{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p>{patient.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p>{patient.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p>{patient.address}</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Link href="/Dashboard/Patients">
          <Button variant="outline">Back to Patients</Button>
        </Link>
      </div>
    </div>
  );
}