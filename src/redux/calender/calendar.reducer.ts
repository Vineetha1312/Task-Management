import * as calendarActions from './calendar.actions';
import { addMonths, subMonths } from 'date-fns';

// Define State Type
export interface CalendarState {
    isOpen: boolean;
    selectedDate: Date | null;
    currentMonth: Date;
}

// Initial State
const initialState: CalendarState = {
    isOpen: false,
    selectedDate: null,
    currentMonth: new Date(),
};

// Reducer Function
export const reducer = (state = initialState, action: calendarActions.ActionTypes): CalendarState => {
    switch (action.type) {
        case calendarActions.TOGGLE_CALENDAR:
            return {
                ...state,
                isOpen: action.payload,
            };

        case calendarActions.SELECT_DATE:
            return {
                ...state,
                selectedDate: action.payload,
                isOpen: false, // Close calendar after selecting a date
            };

        // ✅ Removed payload, update state using `addMonths`
        case calendarActions.NEXT_MONTH:
            return {
                ...state,
                currentMonth: addMonths(state.currentMonth, 1),
            };

        // ✅ Removed payload, update state using `subMonths`
        case calendarActions.PREV_MONTH:
            return {
                ...state,
                currentMonth: subMonths(state.currentMonth, 1),
            };

        default:
            return state;
    }
};
