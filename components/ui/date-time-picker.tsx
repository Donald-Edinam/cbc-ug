"use client";

import React from "react";
import DatePicker from "react-datepicker";
import { Calendar, Clock } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface DateTimePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
}

export function DateTimePicker({
  label,
  selected,
  onChange,
  placeholder = "Select date and time",
  required = false,
}: DateTimePickerProps) {
  return (
    <div className="flex flex-col gap-2 group">
      <label 
        className="text-[0.72rem] font-semibold uppercase tracking-widest px-1 transition-colors group-focus-within:text-claude-tan"
        style={{ color: "var(--bark)", fontFamily: "var(--font-display)" }}
      >
        {label} {required && <span className="text-claude-tan">*</span>}
      </label>
      
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText={placeholder}
          required={required}
          className="w-full rounded-lg px-10 py-2.5 text-[0.93rem] outline-none transition-all duration-200 border-[1.5px] border-stone focus:border-claude-tan focus:ring-4 focus:ring-claude-tan/10 bg-sand text-ink font-body"
          wrapperClassName="w-full"
          popperClassName="premium-datepicker-popper"
          calendarClassName="premium-datepicker-calendar"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-earth group-focus-within:text-claude-tan transition-colors pointer-events-none">
          <Calendar size={18} />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-earth group-focus-within:text-claude-tan transition-colors pointer-events-none">
          <Clock size={16} />
        </div>
      </div>

      <style jsx global>{`
        .premium-datepicker-calendar {
          background: var(--cream) !important;
          border: 1px solid var(--sand) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          font-family: var(--font-display) !important;
          padding: 8px !important;
          overflow: hidden !important;
        }
        .react-datepicker__header {
          background: var(--warm-white) !important;
          border-bottom: 1px solid var(--sand) !important;
          padding-top: 12px !important;
        }
        .react-datepicker__current-month, 
        .react-datepicker__day-name {
          color: var(--ink) !important;
          font-weight: 700 !important;
        }
        .react-datepicker__day {
          color: var(--ink) !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }
        .react-datepicker__day:hover {
          background: var(--sand) !important;
        }
        .react-datepicker__day--selected {
          background: var(--ink) !important;
          color: var(--cream) !important;
        }
        .react-datepicker__day--keyboard-selected {
          background: var(--claude-tan) !important;
          color: white !important;
        }
        .react-datepicker__time-container {
          border-left: 1px solid var(--sand) !important;
          width: 90px !important;
        }
        .react-datepicker__time {
          background: var(--cream) !important;
        }
        .react-datepicker__time-box {
           width: 90px !important;
        }
        .react-datepicker__time-list-item {
          color: var(--ink) !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 0.8rem !important;
          transition: all 0.2s ease !important;
        }
        .react-datepicker__time-list-item:hover {
          background: var(--sand) !important;
        }
        .react-datepicker__time-list-item--selected {
          background: var(--ink) !important;
          color: var(--cream) !important;
          font-weight: 700 !important;
        }
        .react-datepicker__navigation--next {
          border-left-color: var(--earth) !important;
        }
        .react-datepicker__navigation--previous {
          border-right-color: var(--earth) !important;
        }
      `}</style>
    </div>
  );
}
