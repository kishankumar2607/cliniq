import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4">
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <a href="/clinic/dashboard" className="block hover:bg-gray-100 p-2 rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/patients" className="block hover:bg-gray-100 p-2 rounded">
                Patients
              </a>
            </li>
            <li>
              <a href="/dashboard/visits" className="block hover:bg-gray-100 p-2 rounded">
                Visits
              </a>
            </li>
            <li>
              <a href="/dashboard/settings" className="block hover:bg-gray-100 p-2 rounded">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}