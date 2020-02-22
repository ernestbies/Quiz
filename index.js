import { Navigation } from "react-native-navigation";
import { Dimensions } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import Drawer from './screens/Drawer';
import RegulationsScreen from './screens/RegulationsScreen';
import MyResultScreen from './screens/MyResultScreen';

Navigation.registerComponent('RegulationsScreen', () => RegulationsScreen)
Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('QuizScreen', () => QuizScreen);
Navigation.registerComponent('ResultScreen', () => ResultScreen);
Navigation.registerComponent('Drawer', () => Drawer);
Navigation.registerComponent('MyResultScreen', () => MyResultScreen);

const {width} = Dimensions.get('window');
Navigation.events().registerAppLaunchedListener(()=>{
    Navigation.setDefaultOptions({
        topBar: {
            elevation: 0,
            visible: true,
            drawBehind: true,
            animate: false,
            borderHeight: 1,
            leftButtons: [
                {
                    icon: require('./images/hamburger_button.png'),
                    id: 'drawerButton'
                }
            ],
            title: {
                color: 'white',
                alignment: 'center',
                text: 'Quiz App'
            },
            background: {
                color: 'orange'
            }
        }
    });

    Navigation.setRoot({
        root: {
            sideMenu: {
                left: {
                    component: {
                        id: 'drawerId',
                        name: 'Drawer',
                        fixedWidth: width
                    }
                },
                center: {
                    stack: {
                        id: 'MAIN_STACK',
                        children: [
                            {
                                component: {
                                    id: 'homeScreen',
                                    name: 'HomeScreen'
                                }
                            },
                        ]
                    },
                }
            },
        }
    })
});

Navigation.events().registerNavigationButtonPressedListener(()=> {
   Navigation.mergeOptions('drawerId', {
      sideMenu: {
          left: {
              visible: true
          }
      }
   });
});
