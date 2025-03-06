// Visit History
import React from 'react'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const visits = [
  { id: '1', patient: 'John Doe', date: '2023-10-01', status: 'Completed' },
  { id: '2', patient: 'Jane Smith', date: '2023-10-02', status: 'Pending' },
  { id: '3', patient: 'Alice Johnson', date: '2023-10-03', status: 'Completed' },
];

export default function Visits() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Visits</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>{visit.id}</TableCell>
              <TableCell>{visit.patient}</TableCell>
              <TableCell>{visit.date}</TableCell>
              <TableCell>
                <Badge variant={visit.status === 'Completed' ? 'default' : 'secondary'}>
                  {visit.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href='/Dashboard/Visits/VisitDetails'>
                  <Button variant="outline">View Details</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}