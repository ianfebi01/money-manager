import qs from "qs";
import { getStrapiURL } from "./api-helpers";

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    const nodeEnv = process.env.NODE_ENV
    // Merge default and user options
    const mergedOptions = {
      next    : { revalidate : 60 },
      headers : {
        "Content-Type" : "application/json",
        Authorization  : `Bearer ${token}`
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify( { ...urlParamsObject, publicationState : nodeEnv === 'production' ? "live" : "preview", } );
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    // Trigger API call
    const response = await fetch( requestUrl, mergedOptions );
    const data = await response.json();
    
    return data;
    
  } catch ( error ) {
    // eslint-disable-next-line no-console
    console.error( error );
    throw new Error( `Please check if your server is running and you set all the required tokens.` );
  }
}