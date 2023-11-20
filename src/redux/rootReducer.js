import { combineReducers } from "redux";

import AuthReducer from "../auth/redux/reducer";
import HomeReducer from "../home/redux/reducer";
import ProfileReducer from "../profile/redux/reducer";
import DiscoverReducer from "../discover/redux/reducer";
import FollowingReducer from "../following/redux/reducer";
import NotificationsReducer from "../notification/redux/reducer";
import SuggestionReducer from "../suggestion/redux/reducer";
import DraftPostReducer from "./DraftPostReducer";
import SliceReducer from "./SliceReducer";

const rootReducer = combineReducers({
  Auth: AuthReducer,
  Home: HomeReducer,
  Profile: ProfileReducer,
  Discover: DiscoverReducer,
  Following: FollowingReducer,
  Notifications: NotificationsReducer,
  Suggestion: SuggestionReducer,
  DraftPost: DraftPostReducer,
  sliceReducer: SliceReducer,
});

export default rootReducer;
