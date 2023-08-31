import { FULL_IMAGE_URL, IS_POST_REFRESH, NOTIFICATION_UNREAD, SHOW_FULL_IMAGE, UPDATE_HOME_DATA } from "./types";



export const updateHomeData = (isFlag) => ({
    type: UPDATE_HOME_DATA,
    data: isFlag
})

export const showFullImage = (fullImage) => ({
    type: SHOW_FULL_IMAGE,
    data: fullImage
})

export const setPostRefresh = (isRefresh) => ({
    type : IS_POST_REFRESH,
    data: isRefresh
})

export const setFullImageLink = (fullImage) => ({
    type: FULL_IMAGE_URL,
    data: fullImage
})


export const setNotificationData = (count) => ({
    type: NOTIFICATION_UNREAD,
    data: count
})