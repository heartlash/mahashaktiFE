import { View, Text, Image, ScrollView } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from "../constants";
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'react-native-bars';




export default function Welcome() {

  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href='/home' />

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image className="h-full w-full absolute" source={require('../assets/images/background.jpeg')} />
      <View className="mt-80">
        <View>
          <Text className="text-2xl text-black font-semibold text-center">
            MANAGE AND MONITOR {"\n "} THE ALL POWERFUL {"\n \n"}


          </Text>
        </View>

        <Text className="text-white text-3xl  text-center tracking-widest">MAHASHAKTI</Text>




        <CustomButton
          title="Get Started"
          handlePress={() => router.push('login')}
          containerStyles="mt-7 mr-2 ml-2"
        />
      </View>

    </View>
  );
}
