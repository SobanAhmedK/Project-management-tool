import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";

export const useTaskForm = (projectId) => {
  const { addTask, getProject } = useProject();
  const { currentUser } = useAuth();
  
  const project = getProject(projectId);
  const members = project?.members || [];

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigned_to: currentUser ? { 
      id: currentUser.id, 
      full_name: currentUser.full_name 
    } : null,
    due_date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState("basic");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (e) => {
    const selectedMember = members.find(m => m.id === e.target.value);
    setTaskData(prev => ({
      ...prev,
      assigned_to: selectedMember ? { 
        id: selectedMember.id, 
        full_name: selectedMember.full_name 
      } : null
    }));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) return;

    setIsSubmitting(true);

    try {
      await addTask(projectId, {
        ...taskData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        order: project?.tasks?.length || 0,
        created_by: {
          id: currentUser?.id || "user1",
          full_name: currentUser?.name || "Current User",
        },
        updated_at: new Date().toISOString()
      });

      setIsSuccess(true);
      
      setTimeout(() => {
        resetForm();
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error adding task:", error);
    }
  };

  const resetForm = () => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setTaskData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigned_to: currentUser ? { 
        id: currentUser.id, 
        full_name: currentUser.full_name 
      } : null,
      due_date: "",
    });
    setExpandedSection("basic");
  };

  return {
    taskData,
    isSubmitting,
    isSuccess,
    expandedSection,
    members,
    handleChange,
    handleMemberSelect,
    handleSubmit,
    toggleSection,
    resetForm
  };
};