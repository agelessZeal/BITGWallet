import { REHYDRATE } from 'redux-persist';

const initialState = {
	api: null
};

const apiReducer = (state = initialState, action) => {
	switch (action.type) {
		case REHYDRATE:
			if (action.payload && action.payload.api) {
				return {...state, ...action.payload.api};
			}
			return state;
		case 'SET_API':
			return {...state, api: action.api};
		default:
			return state;
	}
};
export default apiReducer;
