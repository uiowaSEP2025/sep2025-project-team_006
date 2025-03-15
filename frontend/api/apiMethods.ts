import axios from "axios";

/**
 * If you perform a `GET` request, the server looks for the data you requested and sends it back to you.
 * 
 * @param webService API link from `WebService.ts`
 * @param id Optional identifier token of the data to be fetched
 * @returns Requested data as JSON
 */
export const apiGET = async (webService: string, id: string = "") => {
    const formatted_url = webService.replace(":id", id);
    const response = await axios.get(formatted_url, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return response.data;
};

/**
 * If you perform a `PUT` request, the server updates an entry in the database and informs you if the update is successful.
 * 
 * @param webService API link from `WebService.ts`
 * @param id identifier token of the data to be modified
 * @returns Server response as JSON
 */
export const apiPUT = async (webService: string, id: string, data: string) => {
    const formatted_url = webService.replace(":id", id);
    const response = await axios.put(formatted_url, data, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return response.data;
};

/**
 * If you perform a `POST` request, the server creates a new entry in the database and informs you if the creation is successful.
 * 
 * @param webService API link from `WebService.ts`
 * @returns Server response as JSON
 */
export const apiPOST = async (webService: string, data: string) => {
    const response = await axios.post(webService, data, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return response.data;
};

/**
 * If you perform a `DELETE` request, the server creates a deletes the entry from the database and informs you if the deletion is successful. 
 * 
 * @param webService API link from `WebService.ts`
 * @param id Optional identifier token of the data to be deleted
 * @returns Server response as JSON
 */
export const apiDELETE = async (webService: string, id: string = "") => {
    const formatted_url = webService.replace(":id", id);
    const response = await axios.delete(formatted_url, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return response.data;
};
