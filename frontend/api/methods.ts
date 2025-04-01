import axios from "axios";

/**
 * If you perform a `GET` request, the server looks for the data you requested and sends it back to you.
 *
 * @param webService API link from `WebService.ts`
 * @param id1 identifier token of the data to be fetched
 * @param id2 identifier token of the data to be fetched
 * @returns Requested data as JSON
 */
export const apiDoubleIdGET = async (
  webService: string,
  id1: string,
  id2: string,
) => {
  const formatted_url = webService.replace(":id1", id1).replace(":id2", id2);
  const response = await axios.get(formatted_url, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};
