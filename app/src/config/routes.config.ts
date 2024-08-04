
import HomePage from "../features/Home";
import Signin from "../features/Setting/Signin";

// Ordered by folder
const routesConfig = [
  //Home
  { name: 'HomePage', component: HomePage },

  //Game
  // { name: 'SnakeIII', component: SnakeIII },

  //Setting
  { name: 'Signin', component: Signin },
  // { name: 'Signup', component: Signup },
];

export default routesConfig;
