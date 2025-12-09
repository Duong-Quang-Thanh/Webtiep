import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Calendar, X, ChevronLeft, ChevronRight } from 'react-feather';

const CustomMonthPicker = ({ value, onChange, placeholder = "Chọn tháng" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(dayjs().year()); 
  const wrapperRef = useRef(null);

  // Khi click ra ngoài thì đóng popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Đồng bộ viewYear với giá trị đang chọn (nếu có)
  useEffect(() => {
    if (value) setViewYear(value.year());
  }, [isOpen, value]);

  const handleSelectMonth = (monthIndex) => {
    // Tạo ngày mới: ngày 1, tháng đã chọn, năm đang xem
    const newValue = dayjs().year(viewYear).month(monthIndex).date(1);
    onChange(newValue);
    setIsOpen(false);
  };

  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Ô input hiển thị */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center w-full border rounded-lg bg-white transition-all h-10 cursor-pointer ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <div className="pl-2 pr-2 text-gray-400">
           <Calendar size={16} />
        </div>
        <span className={`text-sm flex-1 ${value ? 'text-gray-700' : 'text-gray-400'}`}>
            {value ? value.format('MM/YYYY') : placeholder}
        </span>
        
        {value && (
            <div 
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="p-1 mr-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
                <X size={14} />
            </div>
        )}
      </div>

      {/* Popup chọn tháng */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64 animate-in fade-in zoom-in-95 duration-100 right-0 sm:left-0">
            {/* Header: Chọn năm */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <button 
                    onClick={() => setViewYear(viewYear - 1)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="font-bold text-gray-800 text-lg">{viewYear}</span>
                <button 
                    onClick={() => setViewYear(viewYear + 1)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Grid 12 tháng */}
            <div className="grid grid-cols-3 gap-2">
                {months.map((m, index) => {
                    const isSelected = value && value.month() === index && value.year() === viewYear;
                    const isCurrentMonth = dayjs().month() === index && dayjs().year() === viewYear;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleSelectMonth(index)}
                            className={`
                                text-sm py-2 rounded-md transition-colors font-medium
                                ${isSelected 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : isCurrentMonth 
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                }
                            `}
                        >
                            T{index + 1}
                        </button>
                    )
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomMonthPicker;