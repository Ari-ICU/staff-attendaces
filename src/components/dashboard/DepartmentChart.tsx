// components/DepartmentChart.tsx
"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface DepartmentChartProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string[] }[];
  };
}

export default function DepartmentChart({ data }: DepartmentChartProps) {
  return <Pie data={data} options={{ responsive: true }} />;
}
