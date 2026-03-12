"use client";

import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  GripVertical,
  Star,
  Target,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export interface Task {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  done: boolean;
  icon: ReactNode;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    text: "Ship the new landing page",
    priority: "high",
    done: false,
    icon: <Flame className="h-4 w-4" />,
  },
  {
    id: "2",
    text: "Review pull requests",
    priority: "medium",
    done: false,
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "3",
    text: "Update design tokens",
    priority: "low",
    done: true,
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "4",
    text: "Fix authentication bug",
    priority: "high",
    done: false,
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "5",
    text: "Write API documentation",
    priority: "medium",
    done: false,
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "6",
    text: "Deploy staging environment",
    priority: "low",
    done: false,
    icon: <Target className="h-4 w-4" />,
  },
];

export interface DragTaskProps {
  initialTasks?: Task[];
  title?: string;
}

const priorityConfig = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-destructive/10 text-destructive",
  low: "bg-accent/10 text-accent",
};

function TaskItem({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  const controls = useDragControls();
  const y = useMotionValue(0);

  return (
    <Reorder.Item
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="cursor-default select-none rounded-xl border border-border bg-card"
      dragControls={controls}
      dragListener={false}
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: 8 }}
      layout="position"
      style={{ y }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 30,
        mass: 0.6,
      }}
      value={task}
      whileDrag={{
        scale: 1.005,
        zIndex: 50,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          className="-ml-1 cursor-grab touch-none p-1 text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
          onPointerDown={(e) => controls.start(e)}
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <button
          className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
          onClick={() => onToggle(task.id)}
          type="button"
        >
          {task.done ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <span
          className={`flex-1 font-medium text-sm transition-all ${
            task.done
              ? "text-muted-foreground line-through"
              : "text-card-foreground"
          }`}
        >
          {task.text}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs ${priorityConfig[task.priority]}`}
        >
          {task.icon}
          {task.priority}
        </span>
      </div>
    </Reorder.Item>
  );
}

export function DragTask({
  initialTasks = defaultTasks,
  title = "Tasks",
}: DragTaskProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-bold text-3xl text-foreground tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        <p
          className="mt-1 text-muted-foreground text-sm"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {doneCount}/{tasks.length} completed · drag to reorder
        </p>

        {/* Progress */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(doneCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* List */}
      <Reorder.Group
        axis="y"
        className="flex flex-col gap-2"
        layoutScroll
        onReorder={setTasks}
        values={tasks}
      >
        {tasks.map((task) => (
          <TaskItem key={task.id} onToggle={toggleTask} task={task} />
        ))}
      </Reorder.Group>

      {/* Footer hint */}
      <p
        className="mt-6 text-center text-muted-foreground text-xs"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        ⇅ grab the handle to reorder with spring physics
      </p>
    </div>
  );
}
