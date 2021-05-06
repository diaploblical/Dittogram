export const initialState = null

export const reducer = (state, action) => {
  if (action.type === 'USER') {
    return action.payload
  }
  if (action.type === 'CLEAR') {
    return null
  }
  if (action.type === 'UPDATE-FOLLOWERS') {
    return {
      ...state, 
      followers: action.payload.followers, 
      following: action.payload.following
    }
  }
  if (action.type === 'UPDATE-AVATAR') {
    return {
      ...state,
      avatar: action.payload.avatar
    }
  }
  return state
}