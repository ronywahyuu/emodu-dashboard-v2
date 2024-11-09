"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data list
const emotionDataList = [
  {
    timestamp: "2023-05-01T10:00:00Z",
    arousal: 0.1005476787686348,
    emotion: "Happiness",
    emotion_perc: 0.9986386895179749,
    face_box: { height: 195, width: 195, x: 25, y: 36 },
    valence: 0.5019767880439758
  },
  {
    timestamp: "2023-05-01T10:05:00Z",
    arousal: 0.2,
    emotion: "Surprise",
    emotion_perc: 0.8,
    face_box: { height: 200, width: 200, x: 30, y: 40 },
    valence: 0.6
  },
  {
    timestamp: "2023-05-01T10:10:00Z",
    arousal: 0.15,
    emotion: "Happiness",
    emotion_perc: 0.9,
    face_box: { height: 198, width: 198, x: 28, y: 38 },
    valence: 0.55
  }
]

// Aggregate data
const aggregateData = (data) => {
  const emotionCounts = {};
  let totalArousal = 0;
  let totalValence = 0;

  data.forEach(item => {
    emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
    totalArousal += item.arousal;
    totalValence += item.valence;
  });

  const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const averageArousal = totalArousal / data.length;
  const averageValence = totalValence / data.length;

  return {
    dominantEmotion,
    averageArousal,
    averageValence,
    emotionPercentage: (emotionCounts[dominantEmotion] / data.length) * 100
  };
};

const aggregatedData = aggregateData(emotionDataList);

const radarData = [
  { name: 'Arousal', value: aggregatedData.averageArousal },
  { name: 'Valence', value: aggregatedData.averageValence },
];

const lineChartData = emotionDataList.map(item => ({
  timestamp: new Date(item.timestamp).toLocaleTimeString(),
  arousal: item.arousal,
  valence: item.valence
}));

export default function EmotionDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Emotion Analysis Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dominant Emotion</CardTitle>
            <CardDescription>Most frequent emotion and its percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{aggregatedData.dominantEmotion}</div>
            <Progress value={aggregatedData.emotionPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Percentage: {aggregatedData.emotionPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Arousal and Valence</CardTitle>
            <CardDescription>Emotional intensity and pleasantness</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar name="Value" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Avg. Arousal: {aggregatedData.averageArousal.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">Average intensity of emotion</p>
              </div>
              <div>
                <p className="font-semibold">Avg. Valence: {aggregatedData.averageValence.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">Average pleasantness of emotion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Emotion Trends Over Time</CardTitle>
            <CardDescription>Arousal and valence changes</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer
              config={{
                arousal: {
                  label: "Arousal",
                  color: "hsl(var(--chart-1))",
                },
                valence: {
                  label: "Valence",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="timestamp" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="arousal" stroke="var(--color-arousal)" />
                  <Line type="monotone" dataKey="valence" stroke="var(--color-valence)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Latest Face Detection</CardTitle>
            <CardDescription>Most recent detected face bounding box</CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={4/3} className="bg-muted">
              <div 
                className="border-2 border-primary absolute"
                style={{
                  left: `${(emotionDataList[emotionDataList.length - 1].face_box.x / 4)}%`,
                  top: `${(emotionDataList[emotionDataList.length - 1].face_box.y / 3)}%`,
                  width: `${(emotionDataList[emotionDataList.length - 1].face_box.width / 4)}%`,
                  height: `${(emotionDataList[emotionDataList.length - 1].face_box.height / 3)}%`,
                }}
              ></div>
            </AspectRatio>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">X: {emotionDataList[emotionDataList.length - 1].face_box.x}</p>
                <p className="font-semibold">Y: {emotionDataList[emotionDataList.length - 1].face_box.y}</p>
              </div>
              <div>
                <p className="font-semibold">Width: {emotionDataList[emotionDataList.length - 1].face_box.width}</p>
                <p className="font-semibold">Height: {emotionDataList[emotionDataList.length - 1].face_box.height}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader>
            <CardTitle>Raw Data</CardTitle>
            <CardDescription>JSON representation of the analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm h-[300px]">
              {JSON.stringify(emotionDataList, null, 2)}
            </pre>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}