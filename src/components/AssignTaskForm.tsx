import { useState } from "react";
import {
  useCreateSubTaskMutation,
  useGetAllUsersQuery,
} from "../lib/services/apiSlice";
import Button from "./shared/Button/Button";
import UserSelect from "./UserSelect";

interface AssignTaskFormProps {
  taskId: string;
  onClose: () => void;
}

export default function AssignTaskForm({
  taskId,
  onClose,
}: AssignTaskFormProps) {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadTime, setDeadTime] = useState("");
  const [createSubTask, { isLoading }] = useCreateSubTaskMutation();
  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsersQuery(
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Please select a user to assign the task to.");
      return;
    }
    if (!title) {
      alert("Please provide a title for the subtask.");
      return;
    }
    try {
      await createSubTask({
        taskId,
        userId,
        title,
        description,
        status: "pending",
        deadTime: deadTime ? new Date(deadTime).toISOString() : "",
        priority: "low",
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to assign task:", err);
      // You can show an error toast here
    }
  };

  return (
    <div className="my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h4 className="text-md font-semibold mb-3">Assign New Subtask</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 text-black">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter subtask title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter subtask description"
            />
          </div>
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700"
            >
              User ID to assign
            </label>
            <UserSelect
              users={users}
              isLoading={isLoadingUsers}
              value={userId}
              onChange={setUserId}
            />
          </div>
          <div>
            <label
              htmlFor="deadTime"
              className="block text-sm font-medium text-gray-700"
            >
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadTime"
              value={deadTime}
              onChange={(e) => setDeadTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-1 px-4 rounded-xs bg-gray-400 hover:bg-gray-500 text-white font-medium cursor-pointer transition-all duration-200"
            >
              Cancel
            </button>
            <Button
              type="submit"
              isLoading={isLoading}
              classN="py-1 px-4 rounded-xs bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer transition-all duration-200"
            >
              Assign
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
