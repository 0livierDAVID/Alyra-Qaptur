import { createContext, useContext, useReducer } from "react";

const UserContext = createContext(null);

const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, initialUser);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

function userReducer(user, action) {
  switch (action.type) {
    case "update": {
      return [
        ...user,
        {
          // id: action.id,
          // text: action.text,
          // done: false
        },
      ];
    }
    case "updateOwner": {
      return { ...user, isOwner: action.isOwner };
    }
    case "clear": {
      // return user.filter(t => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialUser = {
  isOwner: false,
  qland: [],
  qco2: [],
};
