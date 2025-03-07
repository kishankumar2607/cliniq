import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function VisitHistory() {
  const visits = [
    { id: 1, patient: 'John Doe', date: '2023-10-01', status: 'Completed' },
    { id: 2, patient: 'Jane Smith', date: '2023-10-02', status: 'Pending' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visits.map((visit) => (
          <TableRow key={visit.id}>
            <TableCell>{visit.patient}</TableCell>
            <TableCell>{visit.date}</TableCell>
            <TableCell>{visit.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}