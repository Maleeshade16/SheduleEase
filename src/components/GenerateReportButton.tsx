'use client';

import { generateAnnouncementsReport } from "@/lib/actions";
import { useState } from "react";
import Image from "next/image";

export default function GenerateReportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const pdfDataUri = await generateAnnouncementsReport();
      
      // Convert data URI to blob
      const byteString = atob(pdfDataUri.split(',')[1]);
      const mimeString = pdfDataUri.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `announcements-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerateReport}
      disabled={isLoading}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
      title="Generate PDF Report"
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Image src="/pdf-icon.png" alt="PDF Icon" width={16} height={16} />
      )}
    </button>
  );
}
