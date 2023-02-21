
import React from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

// constants
import { images, SIZES, COLORS, FONTS } from '../../constants'
import { PrimaryButton } from '../../components'

const OrderAccepted = ({ navigation }) => {
    function renderContent() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEnabled
                decelerationRate={0}
                scrollEventThrottle={16}
                snapToAlignment="center"
            >
                <View
                    style={styles.imageAndTextContainer}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={waiter}
                            resizeMode="cover"
                            style={{
                                width: "80%",
                                height: "80%",
                            }}
                        />
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            top: '5%',
                            left: 40,
                            right: 40
                        }}
                    >
                        <Text style={{
                            ...FONTS.h1,
                            color: COLORS.gray,
                            textAlign: 'center',
                        }}
                        >
                            Welcome to Self-Service
                        </Text>
                    </View>
                    <PrimaryButton
                        onPress={() => navigation.navigate('Home')}
                        title="Get Started"
                    />
                </View>
            </Animated.ScrollView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    imageAndTextContainer: {
        width: SIZES.width,
    },
    dotsRootContainer: {
        position: 'absolute',
        bottom: SIZES.height > 700 ? '20%' : '16%',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.padding / 2,
        marginBottom: SIZES.padding * 3,
        height: SIZES.padding,
    },
    dot: {
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.blue,
        marginHorizontal: SIZES.radius / 2
    }
});

export default OrderAccepted;
