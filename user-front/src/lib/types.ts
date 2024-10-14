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

export interface Poll {
    id: number;
    title: string;
    user_id: number;
    signature: string;
    amount: string;
    done: boolean;
    sampleSize: number;
    submissionCount: number;
}
