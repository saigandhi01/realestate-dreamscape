
import { supabase } from "@/integrations/supabase/client";
import { showProfileErrorToast, showProfileUpdateToast } from "@/components/ui/transaction-toast";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const uploadProfilePhoto = async (
  file: File, 
  walletAddress: string
): Promise<string | null> => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    showProfileErrorToast("File size exceeds 5MB limit");
    return null;
  }
  
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    showProfileErrorToast("Invalid file type. Please upload a JPG, PNG, GIF, or WEBP image");
    return null;
  }
  
  try {
    // Ensure wallet address is lowercase to match the policy
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(normalizedWalletAddress, file, {
        upsert: true, // Overwrite if exists
        contentType: file.type,
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    // Get the public URL
    const { data } = await supabase.storage
      .from('profile-photos')
      .getPublicUrl(normalizedWalletAddress);
    
    showProfileUpdateToast("Profile photo updated successfully");
    return data.publicUrl;
  } catch (error: any) {
    console.error("Error uploading profile photo:", error);
    showProfileErrorToast(error.message || "Failed to upload profile photo");
    return null;
  }
};
