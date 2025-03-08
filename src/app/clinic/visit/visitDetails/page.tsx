"use client";
import React from 'react';
import { useParams } from 'next/navigation';

interface VisitDetails {
  visit_id: number;
  notes: { note_id: number; note: string; created_at: string }[];
  prescriptions: { prescription_id: number; medicine_name: string; dosage: string; instructions: string; created_at: string }[];
  tests: { test_id: number; test_name: string; result: string; created_at: string }[];
}

// Mock data for visit details (replace with API call later)
const mockVisitDetails: VisitDetails = {
  visit_id: 1,
  notes: [
    { note_id: 1, note: 'Patient complained of headache.', created_at: '2023-10-01' },
    { note_id: 2, note: 'Patient has a mild fever.', created_at: '2023-10-01' },
  ],
  prescriptions: [
    {
      prescription_id: 1,
      medicine_name: 'Paracetamol',
      dosage: '500mg',
      instructions: 'Take twice a day after meals.',
      created_at: '2023-10-01',
    },
  ],
  tests: [
    { test_id: 1, test_name: 'Blood Test', result: 'Normal', created_at: '2023-10-01' },
  ],
};

export default function VisitDetails() {
  const params = useParams();
  const patientId = params.id; // Get the patient ID from the URL

  // Fetch visit details for the patient (replace with API call later)
  const visitDetails = mockVisitDetails;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Visit Details for Patient {patientId}</h1>

      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <div className="space-y-2">
          {visitDetails.notes.map((note) => (
            <div key={note.note_id} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{note.note}</p>
              <p className="text-xs text-gray-500">{note.created_at}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prescriptions Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
        <div className="space-y-2">
          {visitDetails.prescriptions.map((prescription) => (
            <div key={prescription.prescription_id} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{prescription.medicine_name}</strong> ({prescription.dosage})
              </p>
              <p className="text-sm text-gray-700">{prescription.instructions}</p>
              <p className="text-xs text-gray-500">{prescription.created_at}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tests Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Tests</h3>
        <div className="space-y-2">
          {visitDetails.tests.map((test) => (
            <div key={test.test_id} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{test.test_name}</strong>: {test.result}
              </p>
              <p className="text-xs text-gray-500">{test.created_at}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}