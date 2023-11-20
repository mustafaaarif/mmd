import React from "react";
import DayPicker from "react-day-picker";

import "react-day-picker/lib/style.css";

export default class Calendar extends React.Component {
  render() {
    const today = new Date();

    const today28plus = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 22
    );

    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );
    const tommorow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    //disable weekends, min date is today + 28 days
    const state_1 = [{ daysOfWeek: [0, 6] }, { before: today28plus }];

    // //disable future dates
    // const state_2 = [{ after: yesterday }];

    // // block all dates from today and in past
    // const state_3 = [{ before: tommorow }];

    const modifiers_1 = {
      // highlighted: new Date(2020, 4, 4),
      successDays: { daysOfWeek: [1, 5] },
      warrningDays: { daysOfWeek: [2, 3, 4] },
      weekends: { daysOfWeek: [0, 6] }
    };
    // const modifiers_2 = {
    //   // highlighted: new Date(2020, 4, 4),
    //   successDays: { daysOfWeek: [1, 5] },
    //   warrningDays: { daysOfWeek: [2, 3, 4, 6, 0] },
    //   weekends: { daysOfWeek: [0, 6] }
    // };

    let calendarState = state_1;
    let calendarStateMods = modifiers_1;

    const { backlog, assisted } = this.props.values;

    // if (backlog) {
    //   calendarState = state_2;
    //   calendarStateMods = modifiers_2;
    // } else {
    //   if (!assisted) {
    //     calendarState = state_3;
    //     calendarStateMods = modifiers_1;
    //   } else {
    //     calendarState = state_1;
    //     calendarStateMods = modifiers_1;
    //   }
    // }

    const handleDayClick = (day, modifiers = {}) => {
      if (modifiers.disabled) {
        return false;
      } else {
        this.props.onDayClick(day);
      }
    };

    return (
      <div>
        <DayPicker
          disabledDays={calendarState}
          modifiers={calendarStateMods}
          firstDayOfWeek={1}
          onDayClick={handleDayClick}
          selectedDays={this.props.selectedDay}
        />
      </div>
    );
  }
}
