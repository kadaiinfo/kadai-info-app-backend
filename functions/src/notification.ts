import * as functions from "firebase-functions";
import {WordpressHook} from "./type";

export const wordpressPublished = functions.https.onRequest(
    async (req, res) => {
      const hook = req.body as WordpressHook;
      console.log(hook);
      res.end();
    }
);
