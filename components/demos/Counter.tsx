"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setCount((c) => c - 1)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        -
      </button>
      <span className="text-2xl font-bold">{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        +
      </button>
    </div>
  );
}
