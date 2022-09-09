import AxiosInstance from "../httpClient"

export const sendPicture = async (picture) => {
    try {
        console.log(picture)
        return await AxiosInstance.post("api/digit", {
            content: JSON.stringify(picture)
        });
    } catch (err) {
        console.error("An error occured while processing the request:", err);
        return err.response;
    }
};