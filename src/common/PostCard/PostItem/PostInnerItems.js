import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../../Avatar';
import Text from '../../Text';
import View from '../../View';
import * as Colors from '../../../config/colors';


const PostInnerItems = ({ post, userPosts }) => {

    const [showMore, setShowMore] = useState(false)
    const [postItems, setPostItems] = useState(userPosts.length > 3 ? userPosts.slice(0, 3) : userPosts)

    useEffect(() => {
        if (showMore) {
            setPostItems(userPosts)
        } else {
            setPostItems(userPosts.length > 3 ? userPosts.slice(0, 3) : userPosts)
        }
    }, [showMore])
    return (
        <View>
            {postItems?.length >= 0 && postItems?.map((item, index) => (
                <View horizontal style={styles.item} key={index}>
                    {
                        post.isNumberShowInItems && (
                            <View style={styles.indexCounter}>
                                <Text sm bold>{post.order && post.order == "1" ? index === 0 ? 1 : index + 1 : userPosts?.length - index}</Text>
                            </View>
                        )
                    }

                    {
                        item.image && (
                            <View style={styles.imgContainer}>
                                <Avatar style={{ borderRadius: 2 }} size={58} url={{ uri: `${item.image}` }} />
                            </View>
                        )
                    }

                    <Text style={{
                        flex : 0.3, marginEnd: 8
                    }} flex center sm medium>{item.name || '--'}</Text>
                    <Text  center xs light style={styles.descriptionTxt} >{item.description || '--'}</Text>
                </View>
            ))}

            {
                userPosts.length > 3 && (
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => setShowMore(!showMore)}
                        >
                            <Text style={{ marginTop: 10, fontSize: 12, fontFamily: 'Poppins-SemiBold', color: Colors.primary }}>{!showMore ? "Show More..." : "Show Less..."}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    )
}

export default PostInnerItems

const styles = StyleSheet.create({
    item: {
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: '#999',
        justifyContent: 'space-between',
    },
    indexCounter: {
        width: 30,
        height: 30,
        marginRight: 12,
        borderWidth: 2,
        paddingTop: 2,
        borderRadius: 30 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        marginRight: 5,
        flex : 0.3
    },
    userInfoContainer: {
        marginLeft: 15,
    },
    descriptionTxt: {
        flex: 0.5,
    },
    menuBtn: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
})