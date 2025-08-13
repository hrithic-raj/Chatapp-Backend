import { Express } from 'express';

declare global {
  namespace Express {
    export interface Multer {
      File: File;
    }
  }
}

interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
