
import HomePage from "../components/Menu";
import Signin from "../components/Setting/Signin";

// Ordered by folder
const routesConfig = [
  //Menu
  { name: 'HomePage', component: HomePage },

  //Game
  // { name: 'SnakeIII', component: SnakeIII },

  //Setting
  { name: 'Signin', component: Signin },
  // { name: 'Signup', component: Signup },
];

export default routesConfig;
