import FirebaseInfo from "./firebaseinfo";
export const environment = {
  production: true,
  firebase: {
    ...FirebaseInfo
  }
};
