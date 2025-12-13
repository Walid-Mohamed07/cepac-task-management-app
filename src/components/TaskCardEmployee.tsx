import type { SubTask } from "../types";
import { formatDate } from "../utils/formatDate";

interface TaskCardEmployeeProps {
  task: SubTask;
}

const getPriorityClasses: Record<string, string> = {
  high: "bg-red-600 bg-opacity-20 border-red-500",
  medium: "bg-orange-400 bg-opacity-20 border-warning",
  low: "bg-blue-500 bg-opacity-20 text-white border-blue-500",
};

const getStatusClasses: Record<string, string> = {
  pending: "bg-gray-400 text-foreground-dim border-foreground-dim",
  "in-progress": "bg-cyan-500 bg-opacity-20 text-white border-primary",
  completed: "bg-green-400 bg-opacity-20 text-white border-accent",
  stopped: "bg-neutral-400 border-l-2 border-gray-400 ml-3",
};

export default function TaskCardEmployee({ task }: TaskCardEmployeeProps) {
  console.log({ task });

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-blue-500 ${
        getStatusClasses[task.status]
      } max-h-fit`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 break-words">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-gray-500 w-16">Priority: </span>
          <div className="px-2 py-1">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                getPriorityClasses[task.taskId!.priority!]
              }`}
            >
              {task.taskId!.priority}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-xs text-gray-500 w-16">Status: </span>
            <div className="px-2 py-1">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  getStatusClasses[task.status]
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
          {task.status === "stopped" && (
            <div className="bg-neutral-400 px-4 py-1 rounded-lg text-2xl">
              !
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-gray-500 w-16">Created At: </span>
          <span className="px-2 py-1 rounded text-xs font-medium text-gray-700">
            {formatDate(task.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-gray-500 w-16">Updated At: </span>
          <span className="px-2 py-1 rounded text-xs font-medium text-gray-700">
            {formatDate(task.updatedAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center text-xs font-medium text-gray-800 w-full">
        Assigned By:{" "}
        <span className="font-medium text-gray-700 ml-2">
          {task.assignedBy?.name || "Unknown"}
        </span>
        <img
          className="ml-2 size-7 rounded-4xl"
          src={
            task.assignedBy &&
            task.assignedBy.profilePicture &&
            task.assignedBy.profilePicture.length > 0
              ? `${import.meta.env.VITE_STORAGE_PATH}${
                  task.assignedBy.profilePicture
                }`
              : `${import.meta.env.VITE_STORAGE_PATH}/unknown.webp`
          }
          alt="AssignedByImg"
        />
      </div>
    </div>
  );
}
