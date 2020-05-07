import * as ActionTypes from './ActionTypes';

export const promotions = (state={
        isloading: true,
        errMess: null,
        promotions: []
    }, action) => {
        switch(action.type) {
            case ActionTypes.ADD_PROMOS:
                return {...state, isloading: false, errMess: null, promotions: action.payload};
            
            case ActionTypes.PROMOS_LOADING:
                return {...state, isloading: true, errMess: null, promotions:[]};
                
            case ActionTypes.PROMOS_FAILED: 
                return {...state, isloading: false, errMess: action.payload, promotions: []};

            default: 
                return state;
        }
    }