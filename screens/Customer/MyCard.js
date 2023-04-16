import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView
} from 'react-native';

import { Header, IconButton, TextButton, CardItem, PrimaryButton } from "../../components";
import { FONTS, SIZES, COLORS, icons, dummyData } from "../../constants";
import { HeaderOrder } from '../../components';

const MyCard = ({ navigation }) => {

    const [selectedCard, setSelectedCard] = React.useState(null)
   
    function renderMyCards() {
        return (
            <View>
                {dummyData.myCards.map((item, index) => {
                    return (
                        <CardItem
                            key={`MyCard-${item.id}`}
                            item={item}
                            isSelected={`${selectedCard?.key}-${selectedCard?.id}` == `MyCard-${item.id}`}
                            onPress={() => setSelectedCard({ ...item, key: "MyCard" })}
                        />
                    )
                })}
            </View>
        )
    }

    function renderAddNewCard() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding
                }}
            >
                <Text style={{ ...FONTS.h3 }}>Add new card</Text>

                {dummyData.allCards.map((item, index) => {
                    return (
                        <CardItem
                            key={`NewCard-${item.id}`}
                            item={item}
                            isSelected={`${selectedCard?.key}-${selectedCard?.id}` == `NewCard-${item.id}`}
                            onPress={() => setSelectedCard({ ...item, key: "NewCard" })}
                        />
                    )
                })}
            </View>
        )
    }

    function renderFooter() {
        return (
            <View
                style={{
                    paddingTop: SIZES.radius,
                    paddingBottom: SIZES.padding,
                    paddingHorizontal: SIZES.padding
                }}
            >
                <PrimaryButton
                    onPress={() => navigation.navigate("Pay", { selectedCard: selectedCard })}
                    title="Add Card"
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
        {/* Header */}
        <HeaderOrder navigation={navigation}></HeaderOrder>

            {/* Cards */}
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    marginTop: SIZES.radius,
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: SIZES.radius
                }}
            >
                {/* My Cards */}
                {renderMyCards()}

                {/* Add New Card */}
                {renderAddNewCard()}
            </ScrollView>

            {/* Footer */}
            {renderFooter()}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray5,
    },
});

export default MyCard;