// Patients in queque
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const patients = [
  { id: '1', name: 'John Doe', status: 'Active' },
  { id: '2', name: 'Jane Smith', status: 'Inactive' },
  { id: '3', name: 'Alice Johnson', status: 'Active' },
];

export default function Patients() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.id}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>
                <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href= "/Dashboard/Patients/PatientProfile">
                  <Button variant="outline">View Profile</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
