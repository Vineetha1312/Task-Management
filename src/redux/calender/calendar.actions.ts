import { addMonths, subMonths } from 'date-fns';

// Action Types
export const TOGGLE_CALENDAR = 'calendar/TOGGLE_CALENDAR';
export const SELECT_DATE = 'calendar/SELECT_DATE';
export const NEXT_MONTH = 'calendar/NEXT_MONTH';
export const PREV_MONTH = 'calendar/PREV_MONTH';

// Define Action Types
export type ActionTypes = 
   | { type: typeof TOGGLE_CALENDAR; payload: boolean }
   | { type: typeof SELECT_DATE; payload: Date | null }
   | { type: typeof NEXT_MONTH }  // ✅ Removed payload
   | { type: typeof PREV_MONTH }; // ✅ Removed payload

// Action Creators
export const toggleCalendar = (isOpen: boolean): ActionTypes => ({
    type: TOGGLE_CALENDAR,
    payload: isOpen,
});

export const selectDate = (date: Date | null): ActionTypes => ({
    type: SELECT_DATE,
    payload: date,
});

// ✅ No need to pass currentMonth, let the reducer handle it
export const nextMonth = (): ActionTypes => ({
    type: NEXT_MONTH,
});

export const prevMonth = (): ActionTypes => ({
    type: PREV_MONTH,
});
