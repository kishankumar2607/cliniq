import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
    <Navbar />
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-1 p-4">
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <a href="/clinic/dashboard" className="block hover:bg-gray-100 text-black p-2 rounded text-decoration-none">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/clinic/visit" className="block hover:bg-gray-100 text-black p-2 rounded text-decoration-none">
                Visits
              </a>
            </li>
            <li>
              <a href="/clinic/settings" className="block hover:bg-gray-100 text-black p-2 rounded text-decoration-none">
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
    </>
  );
}