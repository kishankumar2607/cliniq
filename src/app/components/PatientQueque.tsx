"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface PatientQueueProps {
  queque: QueueItem[];
}

export default function PatientQueue({ queque }: PatientQueueProps) {
  // Example list of available doctors
  const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Lee", "Dr. Patel"];

  // Function to assign a random doctor
  const assignRandomDoctor = () => {
    const randomIndex = Math.floor(Math.random() * doctors.length);
    return doctors[randomIndex];
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned Doctor</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queque.map((queueItem) => (
          <TableRow key={queueItem.queue_id}>
            <TableCell>{queueItem.token_number}</TableCell>
            <TableCell>
              {queueItem.patient.first_name} {queueItem.patient.last_name}
            </TableCell>
            <TableCell>
              <Badge
                variant={queueItem.status === "waiting" ? "secondary" : "default"}
              >
                {queueItem.status}
              </Badge>
            </TableCell>
            <TableCell>
              {/* Display a randomly assigned doctor */}
              <Badge variant="outline">{assignRandomDoctor()}</Badge>
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