
import HomePage from "src/features/Home";
import Signin from "src/features/Setting/Signin";
import Games from "src/features/Games";
import SnakeIII from "src/features/Games/SnakeIII";
import Signup from "src/features/Setting/Signup";

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
];

export default routesConfig;
