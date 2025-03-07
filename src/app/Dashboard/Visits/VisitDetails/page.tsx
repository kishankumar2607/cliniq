// Individual Visit History
import React from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const visit = {
  id: '1',
  patient: 'John Doe',
  date: '2023-10-01',
  status: 'Completed',
  doctor: 'Dr. Smith',
  diagnosis: 'Common Cold',
  prescription: 'Rest and hydration',
};

export default function VisitDetails({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Visit Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Visit ID: {visit.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Patient</p>
            <p>{visit.patient}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p>{visit.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p>{visit.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Doctor</p>
            <p>{visit.doctor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diagnosis</p>
            <p>{visit.diagnosis}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Prescription</p>
            <p>{visit.prescription}</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Link href="/Dashboard/Visits">
          <Button variant="outline">Back to Visits</Button>
        </Link>
      </div>
    </div>
  );
}