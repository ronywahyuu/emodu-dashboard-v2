"use client";
import React, { useEffect, useRef, useState } from "react";
// import { Card } from "../ui/card";
import { Card } from "@/components/ui/card";
import { AffectiveInteractiveTextLog, EmotionEnum} from "@/hooks/api/manual-service-hooks";
interface EmotionConfirmationTableProps {
  data: AffectiveInteractiveTextLog[];
  isLoading: boolean;
}

// Helper untuk mendapatkan warna emotion
const getEmotionColor = (emotion: EmotionEnum | string) => {
  const colorMap: Record<string, string> = {
    HAPPY: "bg-yellow-100 text-yellow-800",
    SAD: "bg-blue-100 text-blue-800",
    ANGRY: "bg-red-100 text-red-800",
    FEARFUL: "bg-purple-100 text-purple-800",
    DISGUSTED: "bg-green-100 text-green-800",
    SURPRISED: "bg-pink-100 text-pink-800",
    NEUTRAL: "bg-gray-100 text-gray-800",
    "NOT_CONFIRMED": "bg-yellow-100 text-yellow-800",
    "Not Confirmed": "bg-yellow-100 text-yellow-800",
  };
  
  return colorMap[emotion] || "bg-gray-100 text-gray-800";
};

// Helper untuk format label emotion
const getEmotionLabel = (emotion: string) => {
  if (emotion === "NOT_CONFIRMED" || emotion === "Not Confirmed") {
    return "Not Confirmed";
  }
  
  // Konversi HAPPY → Happy, dll
  return emotion.charAt(0) + emotion.slice(1).toLowerCase();
};

const EmotionConfirmationTable = ({ data, isLoading }: EmotionConfirmationTableProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No emotion confirmation data available
      </div>
    );
  }

  // Format tanggal
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Render progress bar
  const renderProgressBar = (value: number | null) => {
    if (value === null) return <span className="text-gray-400">-</span>;
    
    return (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
          <div 
            className="h-2 rounded-full bg-blue-500" 
            style={{ width: `${value * 100}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium min-w-[40px]">
          {(value * 100).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Detected
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Primary Emotion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emotion Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Secondary Emotion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emotion Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confirmed Emotion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confirmed At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((log, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(log.createdAt)}
              </td>
              
              {/* Primary Emotion */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(log.emotion1)}`}>
                  {getEmotionLabel(log.emotion1)}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {renderProgressBar(log.emotionValue1)}
              </td>
              
              {/* Secondary Emotion */}
              <td className="px-6 py-4 whitespace-nowrap">
                {log.emotion2 ? (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(log.emotion2)}`}>
                    {getEmotionLabel(log.emotion2)}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {renderProgressBar(log.emotionValue2)}
              </td>
              
              {/* Confirmed Emotion */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(log.confirmedEmotion)}`}>
                  {getEmotionLabel(log.confirmedEmotion)}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.confirmedAt ? formatDate(log.confirmedAt) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Footer Summary */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Total Records: <span className="font-semibold">{data.length}</span>
          </span>
          <span>
            Confirmed: <span className="font-semibold text-green-600">
              {data.filter(log => !log.confirmedEmotion.includes('Not Confirmed')).length}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmotionConfirmationTable;