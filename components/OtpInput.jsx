import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OTPInput = ({ onOtpChange }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        onOtpChange(newOtp.join(''));  // Pass the concatenated OTP to the parent

        // Automatically focus the next input
        if (text && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (text, index) => {
        if (text === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
                
                <TextInput
                    key={index}
                    ref={(ref) => inputRefs.current[index] = ref}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            handleBackspace(digit, index);
                        }
                    }}
                    style={styles.input}
                    maxLength={1}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: 'black',
        textAlign: 'center',
        fontSize: 20,
        marginRight: 10,
        borderRadius: 5,
    },
});

export default OTPInput;
