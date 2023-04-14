import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { StackHeader } from '../../common'
import AddIcon from '../../assets/icons/edit-plus-square.svg';
import HomeHeaderProfileInfo from './HomeHeaderProfileInfo';
import { Image, TouchableOpacity, View } from 'react-native';

/* =============================================================================
<HomeListHeader />
============================================================================= */
const HomeListHeader = ({ postRefresh, filterClick }) => {
  const navigation = useNavigation();

  const _handleCreatePostPress = () => navigation.navigate('PostCreate', { postRefresh: postRefresh })

  return (
    <View>
      <StackHeader
        left={<AddIcon />}
        onLeftPress={_handleCreatePostPress}
      />
      <HomeHeaderProfileInfo />
      {/* <View style={{
        flex: 1,
        height: 30,
        alignItems: "flex-end",
        marginHorizontal: 10
      }}>
        <TouchableOpacity
          onPress={filterClick}
        >
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={require("../../assets/icons/filter-ic.png")}
          />
        </TouchableOpacity>
      </View> */}

    </View>
  );
};

export default HomeListHeader;
