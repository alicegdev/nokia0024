
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

// Ordered by folder
const routesConfig = [
  //Home
  { name: 'HomePage', component: HomePage },
  { name: 'Onboarding', component: Onboarding },

  //Games
  { name: 'Games', component: Games },

  // Snake
  { name: 'SnakeIII', component: SnakeIII },

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
  {name: 'Gallery', component: Gallery }
];

export default routesConfig;
