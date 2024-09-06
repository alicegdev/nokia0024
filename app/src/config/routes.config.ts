
import HomePage from "src/features/Home";
import Signin from "src/features/Setting/Signin";
import Games from "src/features/Games";
import SnakeIII from "src/features/Games/SnakeIII";
import Signup from "src/features/Setting/Signup";
import ContactList from "src/features/Contact/ContactList";
import AddEditContact from "src/features/Contact/AddEditContact";
import ContactDetails from "src/features/Contact/ContactDetails";

// Ordered by folder
const routesConfig = [
  //Home
  { name: 'HomePage', component: HomePage },

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
];

export default routesConfig;
