//add store here
import AuthStore from "./AuthStore";
import UserStore from "./UserStore";
import NotificationStore from "./NotificationStore";
import LayoutStore from "./LayoutStore";
import CommonStore from "./CommonStore";

const stores = {
    authStore: new AuthStore(),
    userStore: new UserStore(),
    notificationStore: new NotificationStore(),
    layoutStore: new LayoutStore(),
    commonStore: new CommonStore(),
};

export default stores;
