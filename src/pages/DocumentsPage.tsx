
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { DocumentList } from "@/components/documents/DocumentList";
import { useQueryClient } from "@tanstack/react-query";

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  
  // Function to refresh the documents list
  const refreshDocuments = () => {
    queryClient.invalidateQueries({ queryKey: ["userDocuments"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 pt-16">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Documents</h1>
            
            <div className="grid gap-8">
              <DocumentUploadForm onSuccess={refreshDocuments} />
              <DocumentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
