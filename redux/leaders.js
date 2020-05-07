import * as ActionTypes from './ActionTypes';

export const leaders = (state={
        isloading: true,
        errMess: null,
        leaders: []
    }, action) => {
        switch(action.type) {
            case ActionTypes.ADD_LEADERS:
                return {...state, isloading: false, errMess: null, leaders: action.payload};
            
            case ActionTypes.LEADERS_LOADING:
                return {...state, isloading: true, errMess: null, leaders:[]};
                
            case ActionTypes.LEADERS_FAILED: 
                return {...state, isloading: false, errMess: action.payload, leaders: []};

            default: 
                return state;
        }
    }