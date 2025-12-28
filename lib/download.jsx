import Backend from "@/config/backend";

import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

export const getDocument = async (name, details, headers, data, summaryHeaders, summaryData) => {
    try {
        const response = await Backend.post(
            "/generate-document",
            { name, details, headers, data, summaryHeaders, summaryData },
            { responseType: 'arraybuffer' }
        );

        const file = new File(Paths.cache, name + ' ' + details + '.pdf');

        file.create({ overwrite: true });

        file.write(new Uint8Array(response.data));

        await sharePDF(file.uri);

        return { fileUri: file.uri, errorMessage: null };

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
