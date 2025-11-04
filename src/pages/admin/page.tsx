import { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import "../styles/dashboard.css";
import type { Task } from "../../types";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    // Load mock data - replace with API calls to your backend
    setTasks([
      {
        _id: "6903f2b693221c92b17e0415",
        title: "Implement new feature",
        description: "Add dark mode toggle",
        priority: "high",
        status: "pending",
        assignedTo: [],
        createdBy: {
          name: "Walid Mohamed",
          profilePicture: "b3d3aaeb-3e8d-43fc-a63d-073946bae797-walid.jpg",
        },
        cumulativeTime: 0,
        createdAt: "2025-10-30T23:20:22.706Z",
        updatedAt: "2025-10-30T23:20:22.706Z",
        __v: 0,
      },
    ]);

    setSubTasks([
      {
        _id: "6903f2b693221c92b17e0417",
        userId: {
          name: "Hossam",
          profilePicture: "unknown.webp",
        },
        taskId: {
          title: "Implement new feature",
          description: "Add dark mode toggle",
        },
        status: "pending",
        cumulativeTime: 0,
        assignedBy: {
          name: "Walid Mohamed",
          profilePicture: "b3d3aaeb-3e8d-43fc-a63d-073946bae797-walid.jpg",
        },
        __v: 0,
        createdAt: "2025-10-30T23:20:22.817Z",
        updatedAt: "2025-10-30T23:20:22.817Z",
      },
      {
        _id: "6903f2b693221c92b17e0418",
        userId: {
          name: "Tony",
          profilePicture: "unknown.webp",
        },
        taskId: {
          title: "Implement new feature",
          description: "Add dark mode toggle",
        },
        status: "in-progress",
        cumulativeTime: 0,
        assignedBy: {
          name: "Walid Mohamed",
          profilePicture: "b3d3aaeb-3e8d-43fc-a63d-073946bae797-walid.jpg",
        },
        __v: 0,
        createdAt: "2025-10-30T23:20:22.818Z",
        updatedAt: "2025-10-28T23:28:59.115Z",
        comment: "Started working on the task",
      },
      {
        _id: "6904b27e55c8b51eb43e5294",
        userId: {
          name: "Sayed Elsobky",
          profilePicture: "unknown.webp",
        },
        taskId: {
          title: "Implement new feature",
          description: "Add dark mode toggle",
        },
        status: "in-progress",
        cumulativeTime: 0,
        assignedBy: {
          name: "Walid Mohamed",
          profilePicture: "b3d3aaeb-3e8d-43fc-a63d-073946bae797-walid.jpg",
        },
        createdAt: "2025-10-31T12:58:38.672Z",
        updatedAt: "2025-10-31T12:58:38.672Z",
        __v: 0,
      },
    ]);

    setLoading(false);
  }, []);

  const toggleTaskExpanded = (taskId: Task) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Management Dashboard</h1>
          <button className="logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="tasks-section">
          <div className="section-header">
            <h2>Tasks ({tasks.length})</h2>
          </div>

          <div className="tasks-grid">
            {tasks.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={task}
                isExpanded={expandedTasks[task._id] || false}
                onToggleExpand={() => toggleTaskExpanded(task._id)}
                subTasks={subTasks.filter(
                  (st) => st.taskId.title === task.title
                )}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
