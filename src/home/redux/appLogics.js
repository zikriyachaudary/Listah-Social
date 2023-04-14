import { NOTIFICATION_UNREAD, UPDATE_HOME_DATA } from "./types";



export const updateHomeData = (isFlag) => ({
    type: UPDATE_HOME_DATA,
    data: isFlag
})


export const setNotificationData = (count) => ({
    type: NOTIFICATION_UNREAD,
    data: count
})