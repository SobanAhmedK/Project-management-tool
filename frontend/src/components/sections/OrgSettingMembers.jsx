import { useState } from "react";
import { motion } from "framer-motion";
import {
    PlusIcon,
  UserCircleIcon as UserCircleIconV2,
  ChevronDownIcon as ChevronDownIconV2,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const MembersSection = ({ members, onRemoveMember, onInviteMember }) => {
  const [visibleMembers, setVisibleMembers] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewMore = () => {
    const nextVisibleCount = visibleMembers + 2;
    setVisibleMembers(nextVisibleCount >= members.length ? members.length : nextVisibleCount);
    setIsExpanded(true);
  };

  const handleViewLess = () => {
    setVisibleMembers(2);
    setIsExpanded(false);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-2">
              <UserCircleIconV2 className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Members</h2>
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {members.length} total
            </span>
          </div>
          <motion.button
            className="flex items-center px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInviteMember}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Invite
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.slice(0, visibleMembers).map((member) => (
                <motion.tr 
                  key={member.id}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium mr-2">
                        {member.name.charAt(0)}
                      </div>
                      <div className="text-sm text-gray-900">{member.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="relative">
                      <select
                        className="appearance-none bg-transparent pr-6 py-1 text-xs text-gray-900 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                        defaultValue={member.role}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <ChevronDownIconV2 className="w-3 h-3 absolute right-1.5 top-2 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {member.email || "No email"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => onRemoveMember(member)}
                    >
                      Remove
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {members.length > 2 && (
            <div className="mt-4 flex justify-center">
              {visibleMembers < members.length ? (
                <button
                  onClick={handleViewMore}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View more members
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleViewLess}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MembersSection;