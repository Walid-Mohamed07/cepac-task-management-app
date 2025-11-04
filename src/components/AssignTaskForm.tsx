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
    try {
      await createSubTask({ taskId, userId }).unwrap();
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
        <div className="flex flex-col gap-2">
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
