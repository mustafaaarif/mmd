import React from 'react';
import DayPicker from 'react-day-picker';

// import 'react-day-picker/lib/style.css';

export default class ReleaseCalendar extends React.Component {


  render() {
    const today = new Date();

    const today28plus = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 28)

    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const tommorow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    //disable weekends, min date is today + 28 days
    const state_1 = [{ daysOfWeek: [0, 6] }, { before: today28plus }];

    //disable future dates
    const state_2 = [{ after: yesterday }];

    // block all dates from today and in past
    const state_3 = [{ before: tommorow }];


    const modifiers_1 = {
      // highlighted: new Date(2020, 4, 4),
      successDays: { daysOfWeek: [1, 5] },
      warrningDays: { daysOfWeek: [2, 3, 4] },
      weekends: { daysOfWeek: [0, 6] }
    };
    const modifiers_2 = {
      // highlighted: new Date(2020, 4, 4),
      successDays: { daysOfWeek: [1, 5] },
      warrningDays: { daysOfWeek: [2, 3, 4, 6, 0] },
      weekends: { daysOfWeek: [0, 6] }
    };

    let calednarState;
    let calednarStateMods;

    const { backlog, assisted } = this.props.values;

    if (backlog) {
      calednarState = state_2;
      calednarStateMods = modifiers_2;
    } else {
      if (!assisted) {
        calednarState = state_3;
        calednarStateMods = modifiers_1;
      } else {
        calednarState = state_1;
        calednarStateMods = modifiers_1;
      }
    }

    const handleDayClick = (day, modifiers = {}) =>{
      if (modifiers.disabled) {
        return false
      } else {
        this.props.onDayClick(day);
      }
    }

    return (
      <div className="dayPickerOuter">
        <DayPicker
          disabledDays={calednarState}
          modifiers={calednarStateMods}
          firstDayOfWeek={1}
          onDayClick={handleDayClick}
          selectedDays={this.props.selectedDay}
        />
      </div>
    );
  }
}