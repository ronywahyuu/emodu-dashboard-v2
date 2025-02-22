/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  // RadarLine,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { useGetValenceArousalAnalytics } from '@/hooks/api/valence-arousal-service-hooks';
import { Skeleton } from '@/components/ui/skeleton';


const EmotionAnalyticsDashboard = ({ meetingCode }: {
  meetingCode: string
}) => {
  console.log('meetingCode', meetingCode);

  const { data: valaroAnalytics, isPending } = useGetValenceArousalAnalytics(meetingCode);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isPending) {
    return <Skeleton />
  }
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6 p-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Records</CardTitle>
            <CardDescription>Number of emotional responses recorded</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <p className="text-3xl font-bold">{data.totalRecords}</p> */}
            <p className="text-3xl font-bold">{valaroAnalytics?.data.totalRecords}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Participants</CardTitle>
            <CardDescription>Number of different participants</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <p className="text-3xl font-bold">{data.uniqueParticipants}</p> */}
            <p className="text-3xl font-bold">{valaroAnalytics?.data.uniqueParticipants}</p>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Emotion Distribution</CardTitle>
          <CardDescription>Percentage distribution of emotions</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {/* <BarChart data={data.emotions}> */}
            <BarChart data={valaroAnalytics?.data.emotions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="percentage" name="Percentage">
                {/* {data.emotions.map((entry, index) => ( */}
                {valaroAnalytics?.data.emotions.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} // Using same COLORS array as pie chart
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Valence and Arousal Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Valence and Arousal</CardTitle>
          <CardDescription>Emotional dimensions by category</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {/* <LineChart data={data.emotions}> */}
            <LineChart data={valaroAnalytics?.data.emotions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="valence"
                stroke="#8884d8"
                name="Valence"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="arousal"
                stroke="#82ca9d"
                name="Arousal"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart for Emotional Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle>Emotional Dimensions Radar</CardTitle>
          <CardDescription>Combined view of all emotional metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {/* <RadarChart outerRadius="80%" data={data.emotions}> */}
            <RadarChart outerRadius="80%" data={valaroAnalytics?.data.emotions}>
              <PolarGrid />
              <PolarAngleAxis dataKey="emotion" />
              <PolarRadiusAxis />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Percentage"
                dataKey="percentage"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              {/* <Radar
                name="Emotion Percentage"
                dataKey="emotionPercentage"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              /> */}
              <Radar
                name="Arousal"
                dataKey="arousal"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionAnalyticsDashboard;