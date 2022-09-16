import AxiosInstance from "../httpClient"

export const sendPicture = async (picture) => {
    try {
        return await AxiosInstance.post("api/digits", {
            picture: JSON.stringify(picture)
        });
    } catch (err) {
        console.error("An error occured while processing the request:", err);
        return err.response;
    }
    
};

export const sendLabeledPicture = async (picture, label) => {
    try {
        return await AxiosInstance.post("api/digits", {
            picture: JSON.stringify(picture),
            label: label
        });
    } catch (err) {
        console.error("An error occured while processing the request:", err);
        return err.response;
    }
};