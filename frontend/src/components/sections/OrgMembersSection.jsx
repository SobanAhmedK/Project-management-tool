import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";    
import {
  UserGroupIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  UserIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const MemberItem = ({ member, onMenuAction }) => {
  const currentUser = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState('bottom');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) ){
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (!isMenuOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      setMenuPosition(spaceBelow < 150 ? 'top' : 'bottom');
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <li className="py-3 flex justify-between items-center group relative">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Link 
          to={member.id === currentUser?.id ? '/profile' : `/profile/${member.id}`} 
          className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium flex-shrink-0 hover:bg-indigo-200 transition-colors"
        >
          {member.name.charAt(0).toUpperCase()}
        </Link>
        <div className="min-w-0">
          <Link 
            to={member.id === currentUser?.id ? '/profile' : `/profile/${member.id}`} 
            className="font-medium text-gray-800 hover:text-indigo-600 truncate"
          >
            {member.name}
          </Link>
          <p className="text-sm text-gray-500 truncate">
            {member.email || `${member.role.toLowerCase()}@example.com`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
       {member.role === 'Admin' ?(<span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </span>): member.role === 'Manager' ? (
    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
    </span>
  )
          :<span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </span>
        
       }
        <div className="flex items-center gap-1">
          <button
            className="text-gray-400 hover:text-indigo-500 p-1"
            onClick={() => console.log(`Chat with ${member.name}`)}
            aria-label={`Chat with ${member.name}`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </button>
          <button
            className="text-gray-400 hover:text-indigo-500 p-1"
            onClick={() => console.log(`Video call ${member.name}`)}
            aria-label={`Video call ${member.name}`}
          >
            <VideoCameraIcon className="w-5 h-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              className="text-gray-400 hover:text-gray-600 p-1"
              onClick={toggleMenu}
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div
                className={`absolute right-0 w-40 bg-white rounded-md shadow-md border border-gray-100 z-50 ${
                  menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                }`}
              >
                <div className="py-1">
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      onMenuAction("change-role", member);
                      setIsMenuOpen(false);
                    }}
                  >
                    <UserIcon className="w-4 h-4" />
                    Change Role
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                    onClick={() => {
                      onMenuAction("delete", member);
                      setIsMenuOpen(false);
                    }}
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

const MembersCard = ({ members, onMenuAction }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedMembers = showAll ? members : members.slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5 text-indigo-600" />
          Team Members
          <span className="text-sm text-gray-500">({members.length})</span>
        </h3>
        {members.length > 5 && (
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            onClick={() => setShowAll(!showAll)}
            aria-label={showAll ? "Show less members" : "Show all members"}
          >
            {showAll ? 'Show Less' : 'View All'}
            {showAll ? (
              <ArrowDownIcon className="w-4 h-4" />
            ) : (
              <ArrowRightIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="p-4">
        <ul className="divide-y divide-gray-100">
          {displayedMembers.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              onMenuAction={onMenuAction}
            />
          ))}
        </ul>
        
        {members.length === 0 && (
          <p className="text-gray-500 text-center py-4">No members found</p>
        )}
      </div>
    </div>
  );
};

export default MembersCard;