
import { supabase } from "@/integrations/supabase/client";
import { UserDocument } from "@/types/documents";

// Get all documents for the current user
export const getUserDocuments = async (): Promise<UserDocument[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("user_documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as UserDocument[];
};

// Upload a document for the current user
export const uploadUserDocument = async ({
  file,
  documentType
}: {
  file: File;
  documentType: string;
}): Promise<UserDocument> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }

  // Create a unique file path: user-id/timestamp-filename
  const timestamp = new Date().getTime();
  const fileExt = file.name.split('.').pop();
  const filePath = `${user.user.id}/${timestamp}-${file.name}`;

  // Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("user-documents")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get the URL for the uploaded file
  const { data: urlData } = supabase.storage
    .from("user-documents")
    .getPublicUrl(filePath);
  
  // Create a record in the database
  const { data: documentData, error: documentError } = await supabase
    .from("user_documents")
    .insert({
      user_id: user.user.id,
      document_type: documentType,
      document_url: urlData.publicUrl,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size
    })
    .select()
    .single();

  if (documentError) throw documentError;
  return documentData as UserDocument;
};

// Delete a document
export const deleteUserDocument = async (documentId: string): Promise<void> => {
  const { data: document, error: fetchError } = await supabase
    .from("user_documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (fetchError) throw fetchError;
  
  // Delete from storage
  const filePath = document.document_url.split('/').slice(-2).join('/');
  const { error: storageError } = await supabase.storage
    .from("user-documents")
    .remove([filePath]);
    
  if (storageError) throw storageError;
  
  // Delete from database
  const { error: deleteError } = await supabase
    .from("user_documents")
    .delete()
    .eq("id", documentId);
    
  if (deleteError) throw deleteError;
};
