// src/app/clinic/dashboard/patient/[patientId]/page.tsx
'use client'; // Mark this as a client component for interactivity

import { createClient } from '@/app/utils/supabase/client'; // Use client-side Supabase client
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { use } from 'react'; // Import `use` to unwrap the `params` Promise

export default function PatientDetails({ params }: { params: Promise<{ patientId: string }> }) {
  const supabase = createClient();
  const { patientId } = use(params); // Unwrap the `params` Promise

  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);
  const [visitNotes, setVisitNotes] = useState<any[]>([]);

  // Fetch patient details and visits on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (patientError) {
        console.error('Error fetching patient details:', patientError);
      } else {
        setPatient(patientData);
      }

      // Fetch visits
      const { data: visitsData, error: visitsError } = await supabase
        .from('visit')
        .select('*')
        .eq('patient_id', patientId);

      if (visitsError) {
        console.error('Error fetching visits:', visitsError);
      } else {
        setVisits(visitsData);
      }
    };

    fetchData();
  }, [patientId, supabase]);

  // Function to fetch visit notes for a specific visit
  const fetchVisitNotes = async (visitId: string) => {
    const { data: notesData, error: notesError } = await supabase
      .from('visitnotes')
      .select('*')
      .eq('visit_id', visitId);

    if (notesError) {
      console.error('Error fetching visit notes:', notesError);
    } else {
      setVisitNotes(notesData);
    }
  };

  // Function to handle "View Visit" button click
  const handleViewVisit = async (visitId: string) => {
    if (expandedVisitId === visitId) {
      setExpandedVisitId(null); // Collapse the row if it's already expanded
    } else {
      setExpandedVisitId(visitId); // Expand the row
      await fetchVisitNotes(visitId); // Fetch visit notes for the selected visit
    }
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!patient) {
    return <div>Loading patient details...</div>;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
          <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone Number:</strong> {patient.phone_number}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {visits.map((visit, index) => (
            <div key={visit.visit_id}>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm text-gray-600">{formatDate(visit.visit_date)}</p>
                  <p className="text-sm text-gray-800">Reason: {visit.visit_reason}</p>
                </div>
                <Button onClick={() => handleViewVisit(visit.visit_id)}>
                  {expandedVisitId === visit.visit_id ? 'Hide Details' : 'View Visit'}
                </Button>
              </div>
              {expandedVisitId === visit.visit_id && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Visit Notes</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Note ID</th>
                        <th className="p-2 border">Note</th>
                        <th className="p-2 border">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitNotes.map((note) => (
                        <tr key={note.note_id}>
                          <td className="p-2 border">{note.note_id}</td>
                          <td className="p-2 border">{note.note}</td>
                          <td className="p-2 border">{formatDate(note.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {index < visits.length - 1 && <hr className="my-2 border-gray-200" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}