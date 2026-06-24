export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white md:block" />
      <main className="min-h-screen md:pl-64">{children}</main>
    </div>
  );
}
