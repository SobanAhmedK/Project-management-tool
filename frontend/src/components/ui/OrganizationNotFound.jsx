// src/pages/OrganizationPage/components/OrganizationNotFound.jsx
import { Link } from "react-router-dom"
import { BriefcaseIcon } from "@heroicons/react/24/outline"
import Navbar from "@layouts/Navbar"
import Sidebar from "@layouts/Sidebar"
import EmptyState from "@components/ui/EmptyState"

const OrganizationNotFound = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            icon={<BriefcaseIcon className="w-12 h-12 text-gray-400" />}
            title="Organization not found"
            description="The organization you're looking for doesn't exist or you don't have access"
            action={
              <Link to="/" className="btn-primary">
                Go to Dashboard
              </Link>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default OrganizationNotFound