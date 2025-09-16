import { registerRootComponent } from "expo";
import "./global.css";
import * as AppItSelf from "./App";

import { verifyInstallation } from "nativewind";

function App() {
  // Ensure to call inside a component, not globally
  verifyInstallation();

  return <AppItSelf />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
