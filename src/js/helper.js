import { TIMEOUT } from './config';

/**
 * @brief Returns a promise that rejects after a specified timeout duration.
 *
 * This function can be used to create a timeout for asynchronous operations.
 *
 * @param {number} s - The timeout duration in seconds.
 * @returns {Promise} A promise that rejects with a timeout error message after the specified duration.
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * @brief Sends a JSON request to a specified URL.
 *
 * This function can send a GET or POST request, depending on whether uploadData is provided.
 * It uses a timeout to prevent long requests from hanging indefinitely.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {Object} [uploadData=undefined] - The data to be uploaded with the request (for POST requests).
 * @returns {Promise<Object>} The response data parsed as JSON if the request is successful.
 * @throws {Error} Throws an error if the request fails or if a timeout occurs.
 */
export const requestJSON = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'Post',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Race the fetch request against the timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}  code: (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
