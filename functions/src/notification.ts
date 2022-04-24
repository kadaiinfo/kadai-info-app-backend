import {initializeApp, messaging} from "firebase-admin";
import {applicationDefault} from "firebase-admin/app";
import * as functions from "firebase-functions";
import {WordpressHook} from "./type";

export const wordpressPublished = functions.https.onRequest(
    async (req, res) => {
      const hook = req.body as WordpressHook;
      const payload: messaging.TopicMessage = {
        topic: "wordpress-publish",
        data: {
          title: hook.title,
          desctiption: hook.desctiption,
          imageUrl: hook.imageUrl,
        },
        notification: {
          title: hook.title,
          body: hook.desctiption,
          imageUrl: hook.imageUrl,
        },
        android: {
          priority: "high",
          notification: {
            priority: "high",
            visibility: "public",
          },
        },
        apns: {
          headers: {
            "apns-push-type": "alert",
          },
          payload: {
            aps: {
              mutableContent: true,
              contentAvailable: true,
            },
          },
          fcmOptions: {
            imageUrl: hook.imageUrl,
          },
        },
      };
      initializeApp({credential: applicationDefault()});
      messaging().send(payload);
      res.end();
    }
);
