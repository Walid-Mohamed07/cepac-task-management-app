import { useAppSelector } from "../../lib/hooks";
import { useGetAssignedTasksQuery } from "../../lib/services/apiSlice";
import type { Task } from "../../types";
import TaskCardEmployee from "../../components/TaskCardEmployee";

export default function EmployeeDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: tasks = [], isLoading } = useGetAssignedTasksQuery(
    user?._id || ""
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-600 text-sm">
              Your assigned tasks, {user?.name}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-14 pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading your tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: Task) => (
              <TaskCardEmployee key={task._id} task={task} />
            ))}
          </div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks assigned to you</p>
          </div>
        )}
      </main>
    </div>
  );
}
