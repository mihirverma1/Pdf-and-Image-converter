
export enum ToolType {
  PDF_TO_IMAGE = 'PDF to Image',
  IMAGE_TO_PDF = 'Image to PDF',
  MERGE_PDF = 'Merge PDFs',
  SHRINK_PDF = 'Shrink PDF',
  SHRINK_IMAGE = 'Shrink Image'
}

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

export interface ToolConfig {
  id: ToolType;
  title: string;
  description: string;
  icon: string;
  color: string;
}
