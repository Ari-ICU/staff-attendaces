// components/AttendanceChart.tsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AttendanceChartProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string }[];
  };
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  return <Bar data={data} options={{ responsive: true }} />;
}
