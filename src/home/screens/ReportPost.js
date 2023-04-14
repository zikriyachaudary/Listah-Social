import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { Dimensions, Text, TextInput, View } from "react-native";
import { connect } from 'react-redux';
import { Button, Container, StackHeader } from '../../common';
import { getProfile } from "../../profile/redux/selectors";
import { reportAgainstThisPost } from '../redux/actions';



const ReportPost = ({ profile, route }) => {

    const [loading, setLoading] = useState(false)
    const [reportMsgTxt, setReportMsgTxt] = useState("")
    const navigation = useNavigation()
    useEffect(() => {
        console.log("routeParams - > ", route.params)
    }, [])
    return (
        <Container>
            <View style={{
                flex: 1,
                alignItems: "center"
            }}>
                <StackHeader title={route.params.isReportCount == 0 ? 'Report Post' : 'Report User'} />

                <Text style={{
                    width: Dimensions.get("screen").width - 40,
                    fontSize: 20,
                    fontWeight: "bold"
                }}>{route.params.isReportCount == 0 ? "Why you are reporting this post?" : "Why you are reporting this user?"}</Text>

                <View style={{
                    width: Dimensions.get("screen").width - 40,
                    borderWidth: 1,
                    borderColor: "black",
                    borderRadius: 5,
                    marginVertical: 20,
                    paddingTop: 10
                }}>
                    <TextInput
                        style={{
                            padding: 20,
                            color: "black",
                            fontSize: 16,
                        }}
                        multiline={true}
                        maxLength = {250}
                        placeholder={"Please write your report..."}
                        value = {reportMsgTxt}
                        onChangeText = {(text)=>{
                            setReportMsgTxt(text)
                        }}
                    />
                </View>

                <View style = {{
                    marginVertical : 50
                }}>
                    <Button
                        title='Submit'
                        loading = {loading}
                        onPress = {async()=>{
                            if (reportMsgTxt.length > 0) {
                              
                                setLoading(true)
                                await reportAgainstThisPost(route.params.isReportCount == 1 ? route.params.post.author.userId : route.params.post.id, reportMsgTxt, route.params.isReportCount)
                                setLoading(false)
                                navigation.goBack()
                                alert("Your Report successfully submitted")
                            }else{
                                alert("Please write report message")
                            }
                           
                        }}

                    />
                </View>


            </View>
        </Container>

    )

}

const mapStateToProps = (state) => ({
    profile: getProfile(state),
});
export default connect(mapStateToProps)(ReportPost);
