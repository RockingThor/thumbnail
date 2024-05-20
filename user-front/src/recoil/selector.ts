import { selector } from "recoil";
import { formState, imagesState, tokenState } from "./atom";
import { MyFormData, ImagesData } from "@/lib/types";

export const getToken = selector({
    key: "getToken", // unique ID (with respect to other atoms/selectors)
    get: ({ get }) => {
        const token = get(tokenState);

        return token;
    },
});

export const getImages = selector({
    key: "getImages",
    get: ({ get }) => {
        const images: ImagesData[] = get(imagesState);
        return images;
    },
});

export const getNumOfImages = selector({
    key: "getNumOfImages",
    get: ({ get }) => {
        const form = get(formState);
        return form.numImages;
    },
});

export const finalFormData = selector({
    key: "finalFormData",
    get: ({ get }) => {
        const data: MyFormData = get(formState);
        return data;
    },
});
