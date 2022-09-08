import AxiosInstance from "../httpClient"

export const sendPicture = async (picture) => {
    try {
        // return await AxiosInstance.post("/about", {
        //     content: JSON.stringify(content)
        // });
        console.log("lmao")
    } catch (err) {
        console.error("An error occured while processing the request:", err);
        return err.response;
    }
};