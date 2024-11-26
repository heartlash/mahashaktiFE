import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native';
import FeedCompositionItem from './FeedCompositionItem';
import AnimatedActivityIndicator from '../AnimatedActivityIndicator';
import { getFeedCompositionPerShed } from '@/lib/feed';

const FeedCompositionList = ({ shedId, listHeaderComponent, onRefresh, refreshing, 
    setSuccessModalVisible, setFailureModalVisible, setSubmitModalVisible 
}) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editItemId, setEditItemId] = useState(null); // Use id instead of the entire object
    const [loading, setLoading] = useState(true);
    const [feedCompositionData, setFeedCompositionData] = useState([]);
    const [refresh, setRefresh] = useState(false)

    const handlePress = (itemId) => {
        setExpandedItemId(itemId === expandedItemId ? null : itemId);
        setEditItemId(null); // Collapse edit mode when toggling expansion
    };

    const onRefreshOnChange = () => {
        setRefresh(prev => !prev);
    }

    const fetchFeedCompositionPerShed = async () => {
        const result = await getFeedCompositionPerShed(shedId);
        if (!result.errorMessage) {
            const feedCompositionList = result.data.map((feedComposition) => ({
                ...feedComposition,
                materialName: feedComposition.material.name,
                materialId: feedComposition.material.id,
                materialUnit: feedComposition.material.unit.symbol,
                shedId: feedComposition.shed.id,
            }));
            setFeedCompositionData(feedCompositionList);
            setLoading(false);
        } else {
            setLoading(true);
        }
    };

    useEffect(() => {
        fetchFeedCompositionPerShed();
    }, [refresh]);

    if (loading) {
        return <AnimatedActivityIndicator />;
    }

    const renderItem = ({ item }) => (
        <FeedCompositionItem
            item={item}
            isExpanded={expandedItemId === item.id}
            isEditing={editItemId === item.id}
            onPress={() => handlePress(item.id)}
            setEditItemId={setEditItemId}
            onRefreshOnChange={onRefreshOnChange}
            setSuccessModalVisible={setSuccessModalVisible}
            setFailureModalVisible={setFailureModalVisible}
            setSubmitModalVisible={setSubmitModalVisible}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={listHeaderComponent}
            data={feedCompositionData.sort((a, b) => a.materialName.localeCompare(b.materialName))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        />
    );
};

export default FeedCompositionList;
