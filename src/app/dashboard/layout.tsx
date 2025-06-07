import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex justify-center py-6">
        <main className="container">{children}</main>
      </div>
    </>
  );
}
