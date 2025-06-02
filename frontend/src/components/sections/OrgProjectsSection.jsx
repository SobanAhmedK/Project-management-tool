import { motion } from "framer-motion";
import { useState } from "react";
import { 
  BriefcaseIcon, 
  PlusCircleIcon,
  ArrowRightIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";
import EmptyState from "@components/ui/EmptyState";
import AddProjectModal from "@components/modals/AddProjectModal";
import { Link } from "react-router-dom";
import { useOrganization } from "@/context/OrganizationContext";

const ProjectItem = ({ project }) => {
  const { getOrganization, setOrganization } = useOrganization();
  

  return (
    <motion.li
      whileHover={{ x: 4 }}
      className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <Link 
        to={`/organization/${project.orgId}/projects/${project.id}`} 
        className="block"
        onClick={() => setOrganization(project.organization.name || "")}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {project.tasks.length} tasks
          </span>
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs border-2 border-white"
                title={member.full_name}
              >
                {member.full_name.charAt(0)}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

const ProjectCard = ({ projects, orgId }) => {
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <>
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-emerald-600" />
              Recent Projects
              <span className="text-sm text-gray-500">({projects.length})</span>
            </h2>
            <div className="flex items-center gap-4">
              {projects.length > 3 && (
                <button
                  className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
                  onClick={() => setShowAll(!showAll)}
                  aria-label={showAll ? "Show less projects" : "Show all projects"}
                >
                  {showAll ? 'Show Less' : 'View All'}
                  {showAll ? (
                    <ArrowDownIcon className="w-4 h-4" />
                  ) : (
                    <ArrowRightIcon className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
              >
                <PlusCircleIcon className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {projects.length > 0 ? (
            <ul className="space-y-4">
              {displayedProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </ul>
          ) : (
            <EmptyState 
              icon={<BriefcaseIcon className="w-10 h-10 text-gray-400" />}
              title="No projects yet"
              description="Get started by creating your first project"
              action={
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Create Project
                </button>
              }
              small
            />
          )}
        </div>
      </motion.div>

      <AddProjectModal 
        orgId={orgId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProjectCard;