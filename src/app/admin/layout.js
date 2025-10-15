export const metadata = {
  title: "ICPC Admin Panel",
  description: "Admin panel for ICPC Asia West Continent management",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}