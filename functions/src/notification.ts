import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {WordpressHook} from "./type";

export const wordpressPublished = functions
    .region("asia-northeast2")
    .https.onRequest(async (req, res) => {
      admin.initializeApp();
      const hook: WordpressHook = req.body;
      hook.imageUrl = encodeURI(hook.imageUrl);
      const payload: admin.messaging.TopicMessage = {
        topic: "wordpress-publish",
        notification: {
          title: "〈新着記事のお知らせ〉",
          body: hook.title,
          imageUrl: hook.imageUrl,
        },
        data: {
          title: hook.title,
          desctiption: hook.description,
          imageUrl: hook.imageUrl,
        },
        android: {
          priority: "high",
          notification: {
            title: "〈新着記事のお知らせ〉",
            body: hook.title,
            imageUrl: hook.imageUrl,
            ticker: "KADAI INFOの通知です",
            color: "#FFFFFF",
            tag: hook.title,
            sticky: true,
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
              threadId: hook.title,
              alert: {
                title: "〈新着記事のお知らせ〉",
                subtitle: hook.title,
                body: hook.description,
              },
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
