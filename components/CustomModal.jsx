import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomModal = ({ modalVisible, setModalVisible, theme, mainText, secondaryText }) => {

    const getAnimationSource = (theme) => {
        switch (theme) {
            case "celebrate":
                return require('../assets/animations/celebrate-success.json');
            case "success":
                return require('../assets/animations/success.json');
            case "failure":
                return require('../assets/animations/failure.json');
            case "submit":
                return require('../assets/animations/sub.json');
            default:
                return require('../assets/animations/success.json'); // Default animation
        }
    };


    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <LottieView
                        source={getAnimationSource(theme)}
                        autoPlay
                        loop={false}
                        style={styles.lottieAnimation}
                    />
                    <Text style={styles.mainText}>{mainText}</Text>
                    <Text style={styles.secondaryText}>{secondaryText}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background with transparency
    },
    modalContent: {
        width: '100%', // Occupy 90% of the width of the screen
        height: '100%', // Occupy 70% of the height of the screen
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottieAnimation: {
        width: 150,
        height: 150,
    },
    mainText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    secondaryText: {
        marginTop: 10,
        textAlign: 'center',
    },
});

export default CustomModal;
