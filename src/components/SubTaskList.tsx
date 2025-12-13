import { useState } from "react";
import type { SubTask, SubTaskStatus } from "../types";
import { formatDate } from "../utils/formatDate";
import Button from "./shared/Button/Button";

const statusColors = {
  pending: "bg-yellow-50 border-l-2 border-gray-400",
  "in-progress": "bg-blue-50 border-l-2 border-blue-400",
  completed: "bg-green-50 border-l-2 border-green-400",
  stopped: "bg-gray-50 border-l-2 border-gray-400 ml-3",
};
interface SubTaskCardProps {
  subtasks: SubTask[];
  onUpdate: (subTask: SubTask) => void;
  onDelete?: (subTaskId: string) => void;
}

export default function SubTaskList({
  subtasks,
  onUpdate,
}: // onDelete,
SubTaskCardProps) {
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editableStatus, setEditableStatus] =
    useState<SubTaskStatus>("pending");
  const [editableDeadTime, setEditableDeadTime] = useState<string>("");

  const [editableTitle, setEditableTitle] = useState<string>("");
  const [editableDescription, setEditableDescription] = useState<string>("");

  const handleEdit = (subtask: SubTask) => {
    setEditingSubTaskId(subtask._id);
    setEditableStatus(subtask.status);
    setEditableDeadTime(subtask.deadTime ? subtask.deadTime.slice(0, 16) : "");
    setEditableTitle(subtask.title!);
    setEditableDescription(subtask.description);
  };

  const handleCancel = () => {
    setEditingSubTaskId(null);
  };

  const handleSave = (subtask: SubTask) => {
    onUpdate({
      ...subtask,
      title: editableTitle,
      description: editableDescription,
      status: editableStatus,
      deadTime: editableDeadTime
        ? new Date(editableDeadTime).toISOString()
        : "",
    });
    setEditingSubTaskId(null);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Subtasks</h4>
      {subtasks.map((subtask: SubTask) => (
        <div
          key={subtask._id}
          className={`flex flex-col gap-2 p-3 rounded ${
            statusColors[subtask.status]
          }`}
        >
          <div className="flex-1">
            {editingSubTaskId === subtask._id ? (
              <>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="text-lg font-semibold text-gray-800 bg-gray-100 rounded border border-gray-300 w-full mb-1"
                />
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  className="text-sm text-gray-600 mt-1 bg-gray-100 rounded border border-gray-300 w-full"
                />
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-800 break-words">
                  {subtask.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {subtask.description}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-row justify-between">
            <p className="flex items-center text-xs font-medium text-gray-800 w-full">
              <span className="text-xs text-gray-500 w-18 mr-2">
                Assigned To:{" "}
              </span>
              {subtask.userId?.name}
              <img
                className="ml-2 size-7 rounded-4xl"
                src={
                  subtask.userId.profilePicture!.length > 0
                    ? `${import.meta.env.VITE_STORAGE_PATH}${
                        subtask.userId.profilePicture
                      }`
                    : `${import.meta.env.VITE_STORAGE_PATH}/unknown.webp`
                }
                alt="UserImg"
              />
            </p>
            {subtask.status === "stopped" && (
              <div className="bg-neutral-400 px-4 py-1 rounded-lg text-2xl">
                !
              </div>
            )}
          </div>
          <div className="flex items-center text-xs font-medium text-gray-800">
            <span className="text-xs text-gray-500 w-18 mr-2">
              Assigned By:{" "}
            </span>
            {subtask.assignedBy?.name}
            <img
              className="ml-2 size-7 rounded-4xl"
              src={
                subtask.assignedBy.profilePicture!.length > 0
                  ? `${import.meta.env.VITE_STORAGE_PATH}${
                      subtask.assignedBy.profilePicture
                    }`
                  : `${import.meta.env.VITE_STORAGE_PATH}/unknown.webp`
              }
              alt="UserImg"
            />
          </div>
          <div className="">
            <p className="flex items-center text-xs font-medium text-gray-800 w-full">
              <span className="text-xs text-gray-500 w-18 mr-2">
                Assignment start time:
              </span>
              {formatDate(subtask.createdAt)}
            </p>
          </div>
          <div>
            <p className="flex items-center text-xs font-medium text-gray-800 w-full">
              <span className="text-xs text-gray-500 w-18 mr-2">
                Dead Time:{" "}
              </span>
              {editingSubTaskId === subtask._id ? (
                <input
                  type="datetime-local"
                  value={editableDeadTime}
                  onChange={(e) => setEditableDeadTime(e.target.value)}
                  className="px-1 py-0.5 rounded text-xs font-medium bg-gray-100 border border-gray-300 text-black"
                />
              ) : subtask.deadTime ? (
                formatDate(subtask.deadTime)
              ) : (
                "N/A"
              )}
            </p>
          </div>
          {editingSubTaskId === subtask._id ? (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-18 mr-2">
                    Status:{" "}
                  </span>
                  <select
                    value={editableStatus}
                    onChange={(e) =>
                      setEditableStatus(e.target.value as SubTaskStatus)
                    }
                    className="px-1 py-0.5 rounded text-xs font-medium bg-gray-100 border border-gray-300 text-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-progress</option>
                    <option value="completed">Completed</option>
                    <option value="stopped">Stopped</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancel}
                  className="py-0.5 px-3 rounded-xs bg-gray-400 hover:bg-gray-500 text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleSave(subtask)}
                  classN="py-0.5 px-4 rounded-xs bg-green-600 hover:bg-green-500 text-white font-medium cursor-pointer transition-all duration-200"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2">
              <span className="flex items-center text-xs font-medium text-gray-800 w-full">
                <span className="text-xs text-gray-500 w-18 mr-2">Status:</span>
                {subtask.status}
              </span>
              <div className="flex gap-2">
                <Button
                  classN="py-0.5 px-4 rounded-xs bg-amber-300 hover:bg-amber-200 text-white font-medium cursor-pointer transition-all duration-200"
                  onClick={() => handleEdit(subtask)}
                >
                  Edit
                </Button>
                {/* <Button
                  classN="py-0.5 px-4 rounded-xs bg-red-600 hover:bg-red-500 text-white font-medium cursor-pointer transition-all duration-200 disabled:bg-gray-300"
                  onClick={() => onDelete(subtask._id)}
                >
                  Delete
                </Button> */}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
