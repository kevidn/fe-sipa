"use client";

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/forgot-password') || pathname?.startsWith('/reset-password');
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
