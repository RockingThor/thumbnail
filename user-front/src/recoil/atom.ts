import { MyFormData, ImagesData } from "@/lib/types";
import { atom } from "recoil";

export const tokenState = atom({
    key: "tokenState", // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});

export const imagesState = atom<ImagesData[]>({
    key: "imagesState",
    default: [],
});

export const formState = atom<MyFormData>({
    key: "formState",
    default: {
        description: "",
        numImages: 0,
        sampleSize: 0,
        images: [],
    },
});

export const solanaAmountState = atom({
    key: "solanaAmountState",
    default: 0,
});
