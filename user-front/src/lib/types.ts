export interface ImagesData {
    imageUrl: string;
}

export interface MyFormData {
    description: string;
    numImages: number;
    sampleSize: number;
    images: ImagesData[];
}

export interface TaskData {
    imageUrl: string;
    count: number;
}
