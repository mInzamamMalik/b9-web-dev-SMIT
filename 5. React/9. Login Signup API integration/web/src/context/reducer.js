export const reducer = (state, action) => {

  switch (action.type) {
    case "USER_LOGIN": {
      return { ...state, user: action.payload }
    }
    case "USER_LOGOUT": {
      return { ...state, user: null }
    }
    case "CHANGE_THEME": {
      return { ...state, darkTheme: !state.darkTheme }
    }
    case "CHANGE_NAME": {
      console.log("changing name");
      
      if(typeof action.payload === 'string' 
      && action.payload.trim().length < 20 
      && action.payload.trim().length > 3 ){
        return { ...state, name: action.payload }
      }else{
        return state
      }
    }

    default: {
      return state
    }
  }
}