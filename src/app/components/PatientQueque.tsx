// Patients in queue component
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PatientQueue() {
  const patients = [
    { id: 1, name: 'John Doe', status: 'waiting' },
    { id: 2, name: 'Jane Smith', status: 'called' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
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
              <Badge variant={patient.status === 'waiting' ? 'secondary' : 'default'}>
                {patient.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline">Call</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
