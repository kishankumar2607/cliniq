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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface QueueItem {
  queue_id: number;
  clinic_id: number;
  token_number: number;
  status: string;
  patient: {
    patient_id: number;
    first_name: string;
    last_name: string;
  };
  assigned_doctor_id?: number; // Add this field to track the assigned doctor
}

interface Doctor {
  doctor_id: number;
  first_name: string;
  last_name: string;
}

interface PatientQueueProps {
  queue: QueueItem[];
  clinicId: number;
  currentToken: number;
}

export default function PatientQueue({ queue, clinicId, currentToken }: PatientQueueProps) {
  const router = useRouter();
  const supabase = createClient();
  const [statusUpdates, setStatusUpdates] = useState<{ [key: number]: string }>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [assignedDoctors, setAssignedDoctors] = useState<{ [key: number]: number }>({});

  // Fetch doctors from the database
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("doctor_id, first_name, last_name")
        .eq("clinic_id", clinicId);

      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        setDoctors(data);
      }
    };

    fetchDoctors();
  }, [clinicId, supabase]);

  // Function to handle "Mark as Current" button click
  const handleMarkAsCurrent = async (tokenNumber: number) => {
    const { error } = await supabase
      .from("clinicqueuestatus")
      .upsert(
        { clinic_id: clinicId, current_token: tokenNumber, updated_at: new Date().toISOString() },
        { onConflict: "clinic_id" }
      );

    if (error) {
      console.error("Error updating current token:", error);
    } else {
      window.location.reload();
    }
  };

  // Function to handle status dropdown change
  const handleStatusChange = async (queueId: number, newStatus: string) => {
    const { error } = await supabase
      .from("queue")
      .update({ status: newStatus })
      .eq("queue_id", queueId);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      setStatusUpdates((prev) => ({ ...prev, [queueId]: newStatus }));
    }
  };

  // Function to handle doctor assignment change
  const handleDoctorChange = async (queueId: number, doctorId: number) => {
    const { error } = await supabase
      .from("queue")
      .update({ assigned_doctor_id: doctorId })
      .eq("queue_id", queueId);

    if (error) {
      console.error("Error updating assigned doctor:", error);
    } else {
      setAssignedDoctors((prev) => ({ ...prev, [queueId]: doctorId }));
    }
  };

  // Function to navigate to patient details
  const navigateToPatient = (patientId: number) => {
    router.push(`/clinic/dashboard/patient/${patientId}`);
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
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queue.map((queueItem) => (
          <TableRow
            key={queueItem.queue_id}
            className="cursor-pointer hover:bg-gray-100"
          >
            <TableCell>{queueItem.token_number}</TableCell>
            <TableCell>
              {queueItem.patient.first_name} {queueItem.patient.last_name}
            </TableCell>
            <TableCell>
              <select
                value={statusUpdates[queueItem.queue_id] || queueItem.status}
                onChange={(e) => handleStatusChange(queueItem.queue_id, e.target.value)}
                className="p-1 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </TableCell>
            <TableCell>
              <select
                value={assignedDoctors[queueItem.queue_id] || queueItem.assigned_doctor_id || ""}
                onChange={(e) => handleDoctorChange(queueItem.queue_id, Number(e.target.value))}
                className="p-1 border rounded"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </option>
                ))}
              </select>
            </TableCell>
            <TableCell>
              {queueItem.token_number === currentToken ? (
                <Badge className="bg-green-500 text-white">Current</Badge>
              ) : (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsCurrent(queueItem.token_number);
                  }}
                >
                  Mark as Current
                </Button>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToPatient(queueItem.patient.patient_id);
                }}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}