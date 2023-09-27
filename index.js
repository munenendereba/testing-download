import Fs from "fs";
import Https from "https";

/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile(url, targetFile) {
  return await new Promise((resolve, reject) => {
    Https.get(url, (response) => {
      const code = response.statusCode ?? 0;

      if (code >= 400) {
        return reject(new Error(response.statusMessage));
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return resolve(downloadFile(response.headers.location, targetFile));
      }

      // save the file to disk
      const fileWriter = Fs.createWriteStream(targetFile).on("finish", () => {
        resolve({});
      });

      response.pipe(fileWriter);
    }).on("error", (error) => {
      reject(error);
    });
  });
}

const targetFile = "interruption-20230921.pdf";
const wallpaperUrl =
  "https://www.kplc.co.ke/img/full/Interruption%20-%2021.09.2023.pdf";

await downloadFile(wallpaperUrl, targetFile);
