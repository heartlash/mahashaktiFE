import Backend from "@/config/backend";

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer'; 

export const getDocument = async (name, details, headers, data) => {
    try {
        const response = await Backend.post(
            "/generate-document", 
            { name, details, headers, data },
            { responseType: 'arraybuffer' }  
        );

        // Convert response (byte array) to base64 string
        const base64Data = Buffer.from(response.data, 'binary').toString('base64');

        // Define file path for saving the PDF
        const fileUri = FileSystem.documentDirectory + name + ' ' + details + '.pdf';

        // Save the base64 encoded PDF data as a file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
        });
        // Optionally, share the file after downloading it
        await sharePDF(fileUri);

        return { fileUri, errorMessage: null };
    } catch (error) {
        console.error('Error while downloading PDF:', error);
        return {
            fileUri: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error,
        };
    }
};

// Function to share the downloaded PDF
const sharePDF = async (fileUri) => {
    try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Share your PDF',
            });
        } else {
            console.log('Sharing is not available on this device');
        }
    } catch (error) {
        console.log('Error sharing PDF:', error);
    }
};
