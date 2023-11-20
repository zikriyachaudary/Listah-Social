import axios from "axios";

export const sendPushNotification = async (params, onComplete) => {
  const urlForApiCall = "https://fcm.googleapis.com/fcm/send";
  const authToken = `Bearer AAAARjQJGfc:APA91bFCYUEE3kvB0CxA3Y27cm32JLN2pXMKUVq7Edb49zyQFDovglkxmMonwuGvGhA9oZ3nqbrVETGgvPHAikB__19dz9O84Bn38UN4Wu1J4v9CdxCT9NXqaM1-rZCM_icBR-wPMHFU`;

  await axios({
    method: "post",
    url: urlForApiCall,
    data: params,
    headers: {
      Authorization: authToken,
      "Content-Type": `application/json`,
    },
  })
    .then(() => {
      onComplete(true);
    })
    .catch(async (error) => {
      console.log("error Send Notification====>", error);
      onComplete(false);
    });
};
