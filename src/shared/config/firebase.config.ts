export const firebaseAuth = {
  verifyIdToken: async (token: string) => {
    return {
      uid: '123456789',
      email: 'mockuser@firebase.com',
      role: 'user',
    };
  },
};
