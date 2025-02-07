import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import chevron from '../assets/images/chevron-down.svg';

interface CustomCalendarProps {
  onDateSelect: (date: string | null) => void; 
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ onDateSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarDays = (month: Date) => {
    return eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  };

  const calendarDays = generateCalendarDays(currentMonth);

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date); 
    onDateSelect(format(date, 'yyyy-MM-dd')); 
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  return (
    <div className="relative">
      {/* Button to toggle the calendar */}
      <button
        onClick={toggleCalendar}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-300 text-secondary"
      >
        <span className="text-gray-700 text-xs">
          {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Due Date'}
        </span>
        <img src={chevron} alt="Chevron" className="h-4 w-4" />
      </button>

      {/* Custom Calendar Dropdown */}
      {isOpen && (
        <div className="absolute -right-20 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4 ">
            <button onClick={prevMonth} className="text-xs font-bold">
              Prev
            </button>
            <span className="text-sm font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={nextMonth} className="text-xs font-bold">
              Next
            </button>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day) => (
              <div
                key={day.toString()}
                className={`p-2 cursor-pointer text-xs rounded-sm hover:bg-todo_purple ${
                  selectedDate && isSameDay(day, selectedDate) ? 'bg-btn_primary text-white' : ''
                } ${isToday(day) ? 'font-bold' : ''}`}
                onClick={() => handleDateSelection(day)} // Call function to update date
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
