import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications'

import AppNavigation from './navigation/AppNavigation';
import configureStore from './redux/configureStore';
import FullImageModal from './common/PostCard/PostItem/FullImageModal';
import { showFullImage } from './home/redux/appLogics';

const store = configureStore();

/* =============================================================================
<App />
============================================================================= */
const App = () => {


  return (

    <Provider store={store}>
      
      <ToastProvider>
        <AppNavigation />
      </ToastProvider>
     
    </Provider>
  );
};

/* Export
============================================================================= */
export default App;
