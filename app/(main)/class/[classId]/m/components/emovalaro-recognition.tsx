"use client"

import { useState, useEffect } from "react"
import { Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type FaceBox = {
  height: number
  width: number
  x: number
  y: number
}

type EmotionData = {
  arousal: number
  emotion: string
  emotion_perc: number
  face_box: FaceBox
  valence: number
  userId: string
  timeStamp: string
}

// Function to generate timestamp
const generateTimestamp = () => new Date().toISOString()

// Function to simulate data generation
const generateData = (count: number): EmotionData[] => {
  const emotions = ["Neutral", "Happiness", "Sadness", "Anger", "Surprise"]
  return Array.from({ length: count }, () => ({
    arousal: Math.random() * 2 - 1,
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    emotion_perc: Math.random(),
    face_box: {
      height: Math.floor(Math.random() * 100) + 250,
      width: Math.floor(Math.random() * 100) + 250,
      x: Math.floor(Math.random() * 500),
      y: Math.floor(Math.random() * 500)
    },
    valence: Math.random() * 2 - 1,
    userId: "user" + Math.floor(Math.random() * 1000),
    timeStamp: generateTimestamp()
  }))
}

export default function EmotionChart() {
  const [data, setData] = useState<EmotionData[]>([])

  useEffect(() => {
    // Initialize with some data
    setData(generateData(5))

    // Simulating data updates every 5 seconds
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData, ...generateData(1)].slice(-10)
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full my-3">
      <CardHeader>
        <CardTitle>Emotion Data Visualization</CardTitle>
        <CardDescription>Real-time emotion, arousal, and valence data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            arousal: {
              label: "Arousal",
              color: "hsl(var(--chart-1))",
            },
            emotion_perc: {
              label: "Emotion %",
              color: "hsl(var(--chart-3))",
            },
            valence: {
              label: "Valence",
              color: "hsl(var(--chart-2))",
            },
            emotion: {
              label: "Emotion",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[400px] mx-auto"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeStamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
              <YAxis yAxisId="left" domain={[-1, 1]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="arousal" stroke="var(--color-arousal)" />
              <Line yAxisId="left" type="monotone" dataKey="valence" stroke="var(--color-valence)" />
              <Bar yAxisId="right" dataKey="emotion_perc" fill="var(--color-emotion_perc)" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 space-y-2  mx-auto flex flex-col justify-center items-center">
          <p className="text-lg font-semibold">Latest Emotion Data:</p>
          {data.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Emotion:</strong> {data[data.length - 1].emotion}</p>
              <p><strong>User ID:</strong> {data[data.length - 1].userId}</p>
              <p><strong>Arousal:</strong> {data[data.length - 1].arousal.toFixed(2)}</p>
              <p><strong>Valence:</strong> {data[data.length - 1].valence.toFixed(2)}</p>
              <p><strong>Emotion %:</strong> {(data[data.length - 1].emotion_perc * 100).toFixed(2)}%</p>
              <p><strong>Timestamp:</strong> {new Date(data[data.length - 1].timeStamp).toLocaleString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}