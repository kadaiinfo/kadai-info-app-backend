import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {WordpressHook} from "./type";

export const wordpressPublished = functions
    .region("asia-northeast2")
    .https.onRequest(async (req, res) => {
      admin.initializeApp();
      const hook = req.body as WordpressHook;
      hook.imageUrl = encodeURI(hook.imageUrl);
      const payload: admin.messaging.TopicMessage = {
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
      try {
        await admin.messaging().send(payload);
      } catch (e) {
        console.log(e);
      }
      res.end();
    });
