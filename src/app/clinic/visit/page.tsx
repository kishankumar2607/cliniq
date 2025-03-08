"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PatientHistory {
  id: number;
  name: string;
  visitedDate: string;
  diagnosis: string;
  prescribedMedication: string;
}

export default function Visits() {
  const router = useRouter();
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([
    {
      id: 1,
      name: "John Doe",
      visitedDate: "2023-10-01",
      diagnosis: "Flu",
      prescribedMedication: "Paracetamol",
    },
    {
      id: 2,
      name: "Jane Smith",
      visitedDate: "2023-10-02",
      diagnosis: "Cold",
      prescribedMedication: "Ibuprofen",
    },
  ]);

  const handlePatientClick = (patientId: number) => {
    // Dynamically construct the path using the patientId
    router.push(`/clinic/visit/visitDetails/`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Visits</h1>

      {/* Patient Visits Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Visited Date</th>
              <th className="py-2 px-4 border-b">Diagnosis</th>
              <th className="py-2 px-4 border-b">Prescribed Medication</th>
            </tr>
          </thead>
          <tbody>
            {patientHistory.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => handlePatientClick(patient.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-2 px-4 border-b">{patient.id}</td>
                <td className="py-2 px-4 border-b">{patient.name}</td>
                <td className="py-2 px-4 border-b">{patient.visitedDate}</td>
                <td className="py-2 px-4 border-b">{patient.diagnosis}</td>
                <td className="py-2 px-4 border-b">
                  {patient.prescribedMedication}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
