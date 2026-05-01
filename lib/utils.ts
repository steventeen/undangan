import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getServiceSupabase } from './supabaseClient'; // Only use this utility in API/Server routes

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to Indonesian format (e.g. 20 Desember 2026)
 */
export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Validate form data for required fields
 * @param data Object containing form fields
 * @param requiredFields Array of required keys
 * @returns Object with isValid boolean and array of missing fields
 */
export function validateForm(data: Record<string, any>, requiredFields: string[]): { isValid: boolean, missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Helper to upload a File to Supabase Storage (Server Side Only)
 * Client-side upload should use standard supabase client instead.
 * @param file The File object
 * @param bucketName Name of the storage bucket
 * @returns Object with publicUrl or error message
 */
export async function uploadFileToSupabase(file: File, bucketName: string): Promise<{ publicUrl?: string, error?: string }> {
  try {
    const supabase = getServiceSupabase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Sanitize filename to avoid issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}_${safeName}`;

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      return { error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return { publicUrl };
  } catch (error: any) {
    return { error: error.message || 'Failed to upload file' };
  }
}
