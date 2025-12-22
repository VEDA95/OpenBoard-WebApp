export type FileUpload = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  name: string;
  extension: string;
  path: string;
  size: number;
  additionalDetails: { [index: string]: any; };
};

export type FileUploadResponse = {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  name: string;
  extension: string;
  path: string;
  size: number;
  additional_details: { [index: string]: any; };
};
