import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import { Dimensions, Text, TextInput, View } from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../profile/redux/selectors";
import { Button, Container, StackHeader } from "../../common";
import { acceptRejectChallenge } from "../redux/actions";
import { CHALLENGE_REQUEST, UPDATE_CHALLENGE_FEATURE } from "../../suggestion/redux/constants";
import { updateHomeData } from "../redux/appLogics";

const AcceptRejectChallenge = ({ profile, route }) => {
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const selector = useSelector((AppState) => AppState)


  return (
    <Container>
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <StackHeader title={"Challenge Request"} />

        <Text
          style={{
            width: Dimensions.get("screen").width - 40,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {route.params.post.challenge.author.username +
            " challenge against your post do you want to accept?"}
        </Text>

        <View
          style={{
            marginVertical: 50,
            flexDirection: "row",
          }}
        >
          <Button
            title="Accept"
            loading={loading}
            style={{ marginEnd: 20 }}
            onPress={async () => {
                setLoading(true)
                await acceptRejectChallenge(route.params.post, CHALLENGE_REQUEST.ACCEPT)
                setLoading(false)
                UPDATE_CHALLENGE_FEATURE.isUpdate = true

                dispatch(updateHomeData(!selector.Home.updateHomeData))

                navigation.goBack()
            }}
          />

          <Button
            title="Reject"
            loading={rejectLoading}
            style={{ marginStart: 20 }}
            onPress={async () => {
                setRejectLoading(true)
                await acceptRejectChallenge(route.params.post, CHALLENGE_REQUEST.REJECT)
                setRejectLoading(false)
                UPDATE_CHALLENGE_FEATURE.isUpdate = true

                dispatch(updateHomeData(!selector.Home.updateHomeData))

                navigation.goBack()
            }}
          />
        </View>
      </View>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  profile: getProfile(state),
});

export default connect(mapStateToProps)(AcceptRejectChallenge);
