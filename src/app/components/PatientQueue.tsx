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
import { decryptData } from "../components/encryptDecryptData";

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
  assigned_doctor_id?: number;
}

interface Doctor {
  doctor_id: number;
  name: string;
}

interface PatientQueueProps {
  queue: QueueItem[];
  clinicId: number;
  currentToken: number;
}

export default function PatientQueue({
  queue: initialQueue,
  clinicId,
  currentToken,
}: PatientQueueProps) {
  const router = useRouter();
  const supabase = createClient();
  const [statusUpdates, setStatusUpdates] = useState<{ [key: number]: string }>(
    {}
  );
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [assignedDoctors, setAssignedDoctors] = useState<{
    [key: number]: number;
  }>({});
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);

  // Fetch doctors and assigned doctors from the database
  useEffect(() => {
    const fetchDoctorsAndAssignments = async () => {
      // Fetch doctors
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("doctor")
        .select("doctor_id, name")
        .eq("clinic_id", clinicId);

      if (doctorsError) {
        console.error("Error fetching doctors:", doctorsError);
        return;
      }

      setDoctors(doctorsData);

      // Fetch assigned doctors and patient data for each queue item
      const { data: queueData, error: queueError } = await supabase
        .from("queue")
        .select(
          "queue_id, assigned_doctor_id, patient:patient_id(first_name, last_name)"
        )
        .eq("clinic_id", clinicId);

      if (queueError) {
        console.error("Error fetching queue assignments:", queueError);
        return;
      }

      console.log("Fetched queue data:", queueData); // Debugging

      // Map queue_id to assigned_doctor_id
      const assignments: { [key: number]: number } = {};
      queueData.forEach((item) => {
        if (item.assigned_doctor_id) {
          assignments[item.queue_id] = item.assigned_doctor_id;
        }
      });

      setAssignedDoctors(assignments);
    };

    fetchDoctorsAndAssignments();
  }, [clinicId, supabase]);

  // Subscribe to real-time updates for the queue table
  useEffect(() => {
    const channel = supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue" },
        (payload) => {
          console.log("Realtime update received:", payload);

          window.location.reload();
          switch (payload.eventType) {
            case "INSERT":
              setQueue((prevQueue) => [...prevQueue, payload.new as QueueItem]);
              break;

            case "UPDATE":
              setQueue((prevQueue) =>
                prevQueue.map((item) =>
                  item.queue_id === payload.new.queue_id
                    ? {
                        ...item, // Preserve all existing fields
                        ...payload.new, // Apply updates from payload.new
                        patient: item.patient, // Explicitly preserve patient data
                      }
                    : item
                )
              );
              break;

            case "DELETE":
              setQueue((prevQueue) =>
                prevQueue.filter(
                  (item) => item.queue_id !== payload.old.queue_id
                )
              );
              break;

            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]); // Removed `queue` from dependencies

  // Function to handle "Mark as Current" button click
  const handleMarkAsCurrent = async (tokenNumber: number) => {
    const { error } = await supabase.from("clinicqueuestatus").upsert(
      {
        clinic_id: clinicId,
        current_token: tokenNumber,
        updated_at: new Date().toISOString(),
      },
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
      console.log("Updated assigned doctor:", queueId, doctorId); // Debugging
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
        {queue.map((queueItem) => {
          return (
            <TableRow
              key={queueItem.queue_id}
              className={`cursor-pointer hover:bg-gray-100 ${
                queueItem.status === "closed" ? "opacity-50 bg-gray-100" : ""
              }`}
            >
              <TableCell>{queueItem.token_number}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {queueItem.patient ? (
                  (() => {
                    const decryptedFirstName = decryptData(
                      queueItem.patient.first_name
                    );
                    const decryptedLastName = decryptData(
                      queueItem.patient.last_name
                    );
                    const displayFirstName =
                      decryptedFirstName !== null ? decryptedFirstName : "N/A";
                    const displayLastName =
                      decryptedLastName !== null ? decryptedLastName : "N/A";
                    return `${displayFirstName} ${displayLastName}`;
                  })()
                ) : (
                  <span className="text-red-500">Patient data missing</span>
                )}
              </TableCell>
              <TableCell>
                <select
                  value={statusUpdates[queueItem.queue_id] || queueItem.status}
                  onChange={(e) =>
                    handleStatusChange(queueItem.queue_id, e.target.value)
                  }
                  className="p-1 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </TableCell>
              <TableCell>
                <select
                  value={
                    assignedDoctors[queueItem.queue_id] ||
                    queueItem.assigned_doctor_id ||
                    ""
                  }
                  onChange={(e) =>
                    handleDoctorChange(
                      queueItem.queue_id,
                      Number(e.target.value)
                    )
                  }
                  className="p-1 border rounded"
                >
                  <option value="">Select Doctor</option>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        Dr. {doctor.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No doctors available
                    </option>
                  )}
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
                      navigateToPatient(queueItem.patient.patient_id);
                    }}
                  >
                    View Details
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToPatient(queueItem.patient?.patient_id || 0);
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
