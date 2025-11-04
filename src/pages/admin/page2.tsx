import {
  useGetTasksQuery,
  useGetAllSubTasksQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
} from "../../lib/services/apiSlice";
// import NotificationBell from "../../components/NotificationBell";
import TaskCard from "../../components/TaskCard";
import { useState } from "react";
import type { SubTask, Task } from "../../types";
import ErrorToast from "../../components/Toast/ErrorToast";
import Button from "../../components/shared/Button/Button";

export default function AdminDashboard() {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {}
  );
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);

  const { data: tasks = [], isLoading } = useGetTasksQuery({});
  const { data: subtasks = [] } = useGetAllSubTasksQuery({});

  const [updateTask, { isLoading: isUpdating, error: updateTaskError }] =
    useUpdateTaskMutation();
  const [createTask, { isLoading: isCreating, error: createTaskError }] =
    useCreateTaskMutation();
  const [deleteTask, { isLoading: isDeleting, error: deleteTaskError }] =
    useDeleteTaskMutation();
  const [
    updateSubTask,
    { isLoading: isUpdatingSubTask, error: updateSubTaskError },
  ] = useUpdateSubTaskMutation();
  const [
    deleteSubTask,
    { isLoading: isDeletingSubTask, error: deleteSubTaskError },
  ] = useDeleteSubTaskMutation();

  const errorMsg =
    (updateTaskError &&
      "data" in updateTaskError &&
      (updateTaskError.data as { message: string }).message) ||
    (createTaskError && "data" in createTaskError
      ? (createTaskError.data as { message: string }).message
      : undefined) ||
    (updateSubTaskError && "data" in updateSubTaskError
      ? (updateSubTaskError.data as { message: string }).message
      : undefined) ||
    (deleteTaskError &&
      "data" in deleteTaskError &&
      (deleteTaskError.data as { message: string }).message);

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleSaveTask = async (updatedTask: Task) => {
    const payload = {
      id: updatedTask._id,
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      status: updatedTask.status,
    };
    console.log("Saving task with payload: ", payload);

    try {
      await updateTask(payload).unwrap();
    } catch (err) {
      console.error("Failed to update the task: ", err);
    }
  };

  const handleCreateTask = async (newTask: Task) => {
    const payload = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      assignedTo: [],
    };
    try {
      await createTask(payload).unwrap();
      setIsCreatingNewTask(false);
    } catch (err) {
      console.error("Failed to create the task: ", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId).unwrap();
      } catch (err) {
        console.error("Failed to delete the task: ", err);
      }
    }
  };

  const handleUpdateSubTask = async (subTask: SubTask) => {
    try {
      await updateSubTask({
        id: subTask._id,
        title: subTask.title,
        description: subTask.description,
        status: subTask.status,
        deadTime: subTask.deadTime,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update subtask:", err);
    }
  };

  const handleDeleteSubTask = async (subTaskId: string) => {
    if (window.confirm("Are you sure you want to delete this subtask?")) {
      try {
        await deleteSubTask(subTaskId).unwrap();
      } catch (err) {
        console.error("Failed to delete subtask:", err);
      }
    }
  };

  const emptyTask: Task = {
    _id: "new",
    title: "",
    description: "",
    priority: "low",
    status: "pending",
    assignedTo: [],
    createdAt: "",
    updatedAt: "",
    cumulativeTime: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorToast errorMsg={errorMsg || ""} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4 text-black">
          <Button onClick={() => setIsCreatingNewTask(true)}>+ Add Task</Button>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={task}
                expandedTasks={expandedTasks}
                onToggleExpand={() => toggleTaskExpanded(task._id)}
                subTasks={subtasks.filter(
                  (st: SubTask) => st.taskId._id === task._id
                )}
                onSave={handleSaveTask}
                isUpdating={isUpdating}
                onDelete={() => handleDeleteTask(task._id)}
                isDeleting={isDeleting}
                onUpdateSubTask={handleUpdateSubTask}
                isUpdatingSubTask={isUpdatingSubTask}
                onDeleteSubTask={handleDeleteSubTask}
                isDeletingSubTask={isDeletingSubTask}
              />
            ))}
            {isCreatingNewTask && (
              <TaskCard
                task={emptyTask}
                expandedTasks={{}}
                onToggleExpand={() => {}}
                onSave={handleCreateTask}
                isUpdating={isCreating}
                isCreating={true}
                onCancelCreate={() => setIsCreatingNewTask(false)}
              />
            )}
          </div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks available</p>
          </div>
        )}
      </main>
    </div>
  );
}
