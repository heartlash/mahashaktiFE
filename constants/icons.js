import eyeHide from "../assets/icons/eye-hide.png";
import eye from "../assets/icons/eye.png";

import { PresentationChartLineIcon } from 'react-native-heroicons/outline';

import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const tabIcons = {
    home: (props)=> <AntDesign name="home" size={20} {...props} />,
    money: (props)=> <MaterialIcons name="attach-money" size={20} color="black" {...props}/>,
    admin: (props)=> <AntDesign name="pluscircleo" size={20} {...props} />,
    profile: (props)=> <Feather name="user" size={20} {...props} />,
    production: (props)=> <Ionicons name="egg-outline" size={20} {...props} />,
    sale: (props)=> <PresentationChartLineIcon size={20} color="#4A90E2" {...props} />,
    material: (props)=> <Feather name="box" size={20} {...props} />,
}

export default {
  eyeHide,
  eye,
};
