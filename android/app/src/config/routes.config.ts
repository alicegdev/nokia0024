
import HomePage from "src/features/Home";
import Music from "src/features/Media/Music";
import Signin from "src/features/Setting/Signin";
import Games from "src/features/Games";
import SnakeIII from "src/features/Games/SnakeIII";
import Signup from "src/features/Setting/Signup";
import ContactList from "src/features/Contact/ContactList";
import AddEditContact from "src/features/Contact/AddEditContact";
import ContactDetails from "src/features/Contact/ContactDetails";
import Onboarding from "src/features/Onboarding";
import ChatScreen from "src/features/Message/ChatScreen";
import CameraScreen from "src/features/Media/Camera";
import Gallery from "src/features/Media/Gallery";
import SpaceBlast from "src/features/Games/SpaceBlast";
import Breakout from "src/features/Games/Breakout";
import Settings from "src/features/Settings";
import Account from "src/features/Settings/Account";
import Brightness from "src/features/Settings/Brightness";
import Sound from "src/features/Settings/Sound";
import Background from "src/features/Settings/Background";
import DeleteAccount from "src/features/Settings/Account/DeleteAccount";
import ChangePassword from "src/features/Settings/Account/ChangePassword";


// Ordered by folder
const routesConfig = [
  //Home
  { name: 'HomePage', component: HomePage },
  { name: 'Onboarding', component: Onboarding },

  //Games
  { name: 'Games', component: Games },
  { name: 'SnakeIII', component: SnakeIII },
  { name: 'SpaceBlast', component: SpaceBlast },
  { name: 'Breakout', component: Breakout },

  //Setting
  { name: 'Signin', component: Signin },
  { name: 'Signup', component: Signup },

  // Contact
  { name: 'ContactList', component: ContactList },
  { name: 'AddEditContact', component: AddEditContact },
  { name: 'ContactDetails', component: ContactDetails },

  // Message
  { name: 'ChatScreen', component: ChatScreen },
  // Music
  { name: 'Music', component: Music },

  // Camera
  { name: 'CameraScreen', component: CameraScreen },
  { name: 'Gallery', component: Gallery },
  
  //Settings
  { name: 'Settings', component: Settings },
  { name: 'Account', component: Account },
  { name: 'DeleteAccount', component: DeleteAccount },
  { name: 'ChangePassword', component: ChangePassword},
  { name: 'Brightness', component: Brightness },
  { name: 'Sound', component: Sound },

];

export default routesConfig;
