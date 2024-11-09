'use client'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function GetExtensionPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4  p-6 rounded-md ">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Download Emodu for Students</h2>
        <p className="text-gray-600 dark:text-gray-400">Click the button below to download Emodu for Students extension.</p>
        <a href="/ext/emodu-extensions.zip" download className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out">
          Download Extension
        </a>

      </div>
      <Separator className="w-3/4 h-[2px] rounded-full mx-auto" />
      <div className="flex flex-col items-start justify-center space-y-4 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">How to Download and Install Extension</h2>
        <span>
          Full Documentation:
          <a className="text-blue-400 hover:underline hover:cursor-pointer"
            onClick={() => {
              window.open('https://docs.google.com/document/d/1ZOHjrXTLpZ9BChw_MKTpYh3EoJCOWqAY0dnvbo67_uw/edit', '_blank')

              window.location.reload()
            }}
            rel="noopener noreferrer">{" "}Emodu for Students Documentation{" "}</a>
        </span>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-200 space-y-2">
          <li>Use
            <a
              onClick={() => {
                window.open('https://alternativeto.net/category/browsers/chromium-based/', '_blank')

                window.location.reload()
              }}
              className="text-blue-400 hover:underline cursor-pointer"
              rel="noopener noreferrer">{" "}Chromium Based Browsers{" "}</a>
            to open Emoview app and extensions (Chrome, Ms. Edge, Opera, etc)</li>
          <li>Download the extension file by clicking the &quot;Download Extension&quot; button.</li>
          <li>Extract the zip file.</li>
          <li>Open your browser&apos;s extension management page.</li>
          <li>Switch the <span className="font-bold">Developer Mode</span> toggle to on </li>
          <li>Drag and drop the extracted file into the extension management page.</li>
          <li>Confirm the installation and wait for the process to complete.</li>
          <li>Once installed, you should see our extension in your browser&apos;s toolbar.</li>
          <li>Click on the extension icon to start using it.</li>
        </ul>


        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">How to Remove Extension</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-200 space-y-2">
          <li>Right Click on Emodu Extension</li>
          <li>Click Remove from &apos;Browser Name&apos;</li>
        </ul>
      </div>
    </>
  )
}

export default GetExtensionPage