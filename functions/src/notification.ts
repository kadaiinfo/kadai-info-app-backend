import {initializeApp, messaging} from "firebase-admin";
import {applicationDefault} from "firebase-admin/app";
import * as functions from "firebase-functions";
import {WordpressHook} from "./type";

export const wordpressPublished = functions.https.onRequest(
    async (req, res) => {
      const hook = req.body as WordpressHook;
      hook.imageUrl = encodeURI(hook.imageUrl);
      const payload: messaging.TopicMessage = {
        topic: "wordpress-publish",
        notification: {
          title: hook.title,
          body: hook.desctiption,
          imageUrl: hook.imageUrl,
        },
        data: {
          title: JSON.stringify({title: hook.title}),
          desctiption: JSON.stringify({description: hook.desctiption}),
          imageUrl: JSON.stringify({imageUrl: hook.imageUrl}),
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
      try {
        await messaging().send(payload);
      } catch (e) {
        console.log(e);
      }
      res.end();
    }
);
