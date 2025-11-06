import { useState } from "react";
import SubTaskList from "./SubTaskList";
import type { SubTask, Task } from "../types";
import AssignTaskForm from "./AssignTaskForm";
import Button from "./shared/Button/Button";
import { formatDate } from "../utils/formatDate";

interface TaskCardProps {
  task: Task;
  expandedTasks?: Record<string, boolean>;
  onToggleExpand?: (taskId: string) => void;
  subTasks?: SubTask[];
  onSave?: (updatedTask: Task) => void;
  isUpdating?: boolean;
  isCreating?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
  onCancelCreate?: () => void;
  onUpdateSubTask?: (subTask: SubTask) => void;
  isUpdatingSubTask?: boolean;
  onDeleteSubTask?: (subTaskId: string) => void;
  isDeletingSubTask?: boolean;
}

export default function TaskCard({
  task,
  expandedTasks,
  onToggleExpand,
  subTasks,
  onSave,
  isUpdating,
  isCreating = false,
  isDeleting = false,
  onCancelCreate,
  onDelete,
  onUpdateSubTask,
  onDeleteSubTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  const [editableTask, setEditableTask] = useState<Task>(task);
  const [isAssigning, setIsAssigning] = useState(false);

  const getPriorityClasses = {
    high: "bg-red-600 bg-opacity-20 border-red-500",
    medium: "bg-orange-400 bg-opacity-20 border-warning",
    low: "bg-blue-500 bg-opacity-20 text-white border-blue-500",
  };

  const getStatusClasses = {
    pending: "bg-gray-400 text-foreground-dim border-foreground-dim",
    "in-progress": "bg-cyan-500 bg-opacity-20 text-white border-primary",
    completed: "bg-green-400 bg-opacity-20 text-white border-accent",
  };

  const isExpanded = !isCreating && expandedTasks![task._id];

  const handleSave = () => {
    if (onSave) {
      onSave(editableTask);
    }
    if (!isCreating) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (isCreating && onCancelCreate) {
      onCancelCreate();
    } else {
      setEditableTask(task);
      setIsEditing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditableTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-blue-500">
      <div
        className={`flex items-start justify-between mb-3 ${
          isCreating ? "flex-col" : ""
        }`}
      >
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editableTask.title}
              placeholder="Task Title"
              onChange={handleInputChange}
              className="text-lg font-semibold text-gray-800 bg-gray-100 rounded border border-gray-300 w-full"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800 break-words">
              {task.title}
            </h3>
          )}
          {isEditing ? (
            <textarea
              name="description"
              placeholder="Task Description"
              value={editableTask.description}
              onChange={handleInputChange}
              className="text-sm text-gray-600 mt-1 bg-gray-100 rounded border border-gray-300 w-full"
            />
          ) : (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        {!isCreating && (
          <button
            onClick={() => onToggleExpand!(task._id)}
            className="bg-black text-white rounded-xs hover:text-gray-400 transition ml-2 p-2 px-4"
            aria-label="Toggle subtasks"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-gray-500 w-16">Priority: </span>
          {isEditing ? (
            <select
              name="priority"
              value={editableTask.priority}
              onChange={handleInputChange}
              className="px-1 py-0.5 rounded text-xs font-medium bg-gray-100 border border-gray-300 text-black"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          ) : (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                getPriorityClasses[task.priority]
              }`}
            >
              {task.priority}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-gray-500 w-16">Status: </span>
          {isEditing ? (
            <select
              name="status"
              value={editableTask.status}
              onChange={handleInputChange}
              className="px-1 py-0.5 rounded text-xs font-medium bg-gray-100 border border-gray-300 text-black"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-progress</option>
              <option value="completed">Completed</option>
              <option value="stopped">Stopped</option>
            </select>
          ) : (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                getStatusClasses[task.status]
              }`}
            >
              {task.status}
            </span>
          )}
        </div>
        {!isCreating ? (
          <>
            <div className="flex items-center gap-2 mr-4">
              <span className="text-xs text-gray-500 w-16">Created At: </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium text-gray-700`}
              >
                {formatDate(task.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 mr-4">
              <span className="text-xs text-gray-500 w-16">Updated At: </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium text-gray-700`}
              >
                {formatDate(task.updatedAt)}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {!isCreating && (
        <div className="flex items-center text-xs text-gray-500 mb-3">
          Created by:{" "}
          <span className="font-medium text-gray-700 ml-1">
            {task.createdBy!.name}
          </span>
          <img
            className="ml-2 size-7 rounded-4xl"
            src={
              task.createdBy!.profilePicture!.length > 0
                ? `${import.meta.env.VITE_STORAGE_PATH}${
                    task.createdBy!.profilePicture
                  }`
                : `${import.meta.env.VITE_STORAGE_PATH}/unknown.webp`
            }
            alt="UserImg"
          />
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="py-0.5 px-4 rounded-xs bg-gray-400 hover:bg-gray-500 text-white font-medium cursor-pointer transition-all duration-200 disabled:bg-gray-300"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <Button
              isLoading={isUpdating}
              onClick={handleSave}
              classN="py-0.5 px-4 rounded-xs bg-green-600 hover:bg-green-500 text-white font-medium cursor-pointer transition-all duration-200"
            >
              {isCreating ? "Create" : "Save"}
            </Button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="py-0.5 px-4 rounded-xs bg-amber-300 hover:bg-amber-200 text-white font-medium cursor-pointer transition-all duration-200"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="py-0.5 px-4 rounded-xs bg-red-600 hover:bg-red-500 text-white font-medium cursor-pointer transition-all duration-200 disabled:bg-gray-300"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-end mb-2">
            <Button
              classN="text-black"
              onClick={() => setIsAssigning(!isAssigning)}
            >
              + Assign Task
            </Button>
          </div>
          {isAssigning && (
            <AssignTaskForm
              taskId={task._id}
              onClose={() => {
                setIsAssigning(false);
              }}
            />
          )}
          {subTasks && subTasks.length > 0 && (
            <SubTaskList
              subtasks={subTasks}
              onUpdate={onUpdateSubTask!}
              onDelete={onDeleteSubTask!}
            />
          )}
          {subTasks && subTasks.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              No subtasks
            </p>
          )}
        </div>
      )}
    </div>
  );
}
