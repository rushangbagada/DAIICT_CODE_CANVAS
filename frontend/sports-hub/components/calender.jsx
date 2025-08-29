import React, { useEffect, useMemo, useRef, useState } from 'react';
import './css/calender.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = ({ onClick }) => {
  const today = new Date();
  const dayRefs = useRef([]);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);

  // Fetch events
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else if (Array.isArray(data.events)) setEvents(data.events);
      })
      .catch(err => console.log(err));
  }, []);

  const monthOptions = monthNames.map((name, index) => ({ name, value: index }));

  const scrollToDay = (monthIndex, dayIndex) => {
    const targetElement = dayRefs.current.find(
      (ref) =>
        parseInt(ref?.getAttribute('data-month')) === monthIndex &&
        parseInt(ref?.getAttribute('data-day')) === dayIndex
    );
    const container = document.querySelector('.calendar-container');
    if (targetElement && container) {
      const elementRect = targetElement.getBoundingClientRect();
      const offset =
        elementRect.top -
        container.getBoundingClientRect().top -
        container.offsetHeight / 2 +
        elementRect.height / 2;
      container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
    }
  };

  const handleTodayClick = () => {
    if (events.length > 0) {
      const earliest = events.reduce((min, e) =>
        new Date(e.date) < new Date(min.date) ? e : min
      );
      const d = new Date(earliest.date);
      setYear(d.getFullYear());
      setSelectedMonth(d.getMonth());
      setTimeout(() => {
        scrollToDay(d.getMonth(), d.getDate());
      }, 100);
    } else {
      setYear(today.getFullYear());
      setSelectedMonth(today.getMonth());
      setTimeout(() => {
        scrollToDay(today.getMonth(), today.getDate());
      }, 100);
    }
  };

  const handleMonthChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedMonth(index);
    scrollToDay(index, 1);
  };

  const handlePrevYear = () => setYear(prev => prev - 1);
  const handleNextYear = () => setYear(prev => prev + 1);

  const handleDayClick = (day, month) => {
    if (onClick) onClick(day, month < 0 ? 11 : month, month < 0 ? year - 1 : year);
  };

  const generateCalendar = useMemo(() => {
    const startDayOfWeek = new Date(year, 0, 1).getDay();
    const daysInYear = [];

    if (startDayOfWeek < 6) {
      for (let i = 0; i < startDayOfWeek; i++) {
        daysInYear.push({ month: -1, day: 32 - startDayOfWeek + i });
      }
    }

    for (let month = 0; month < 12; month++) {
      const totalDays = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= totalDays; day++) {
        daysInYear.push({ month, day });
      }
    }

    const extra = 7 - (daysInYear.length % 7);
    if (extra < 7) {
      for (let day = 1; day <= extra; day++) {
        daysInYear.push({ month: 0, day });
      }
    }

    const weeks = [];
    for (let i = 0; i < daysInYear.length; i += 7) {
      weeks.push(daysInYear.slice(i, i + 7));
    }

    return weeks.map((week, wi) => (
      <div className="week" key={`week-${wi}`}>
        {week.map(({ month, day }, di) => {
          const index = wi * 7 + di;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const isNewMonth = index === 0 || daysInYear[index - 1].month !== month;

          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter(
            e => new Date(e.date).toISOString().slice(0, 10) === dateKey
          );

          return (
            <div
              key={`${month}-${day}-${index}`}
              ref={(el) => (dayRefs.current[index] = el)}
              data-month={month}
              data-day={day}
              className={`day-cell ${isToday ? 'today' : ''} ${month < 0 ? 'dimmed' : ''}`}
              onClick={() => handleDayClick(day, month)}
            >
              <span>{day}</span>
              {isNewMonth && month >= 0 && (
                <div className="month-label">{monthNames[month]}</div>
              )}

              {/* Event Tooltip */}
              {dayEvents.length > 0 && (
                <div className="event-dot-wrapper">
                  <div className="event-dot">📍</div>
                  <div className="tooltip">
                    {dayEvents.map((event, i) => (
                      <div key={i}>
                        <strong>{event.category}</strong><br />
                        <small>{new Date(event.date).toISOString().slice(0, 10)} - {event.time}</small><br />
                        <small>{event.venue}</small>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [year, events]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const month = parseInt(entry.target.getAttribute('data-month'));
          if (!isNaN(month)) setSelectedMonth(month);
        }
      });
    }, {
      root: document.querySelector('.calendar-container'),
      rootMargin: '-75% 0px -25% 0px',
      threshold: 0
    });

    dayRefs.current.forEach((ref) => {
      if (ref?.getAttribute('data-day') === '15') observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [generateCalendar]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <select value={selectedMonth} onChange={handleMonthChange}>
          {monthOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.name}</option>
          ))}
        </select>
        <button onClick={handleTodayClick}>Today</button>
        <div className="year-nav">
          <button onClick={handlePrevYear}>◀</button>
          <span>{year}</span>
          <button onClick={handleNextYear}>▶</button>
        </div>
      </div>

      <div className="day-labels">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="calendar-body">{generateCalendar}</div>
    </div>
  );
};

export default Calendar;
