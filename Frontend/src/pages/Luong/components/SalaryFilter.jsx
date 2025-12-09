import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, X, Check, Layers, Briefcase, Cpu } from 'react-feather';
import CustomMonthPicker from './CustomMonthPicker';

// 1. COMPONENT DROPDOWN TÌM KIẾM 
const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Chọn...",
  icon: Icon,
  labelKey = "label",
  valueKey = "value",
  customDisplay
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const getLabel = (item) => {
    if (!item) return '';
    if (customDisplay) return customDisplay(item);
    return item[labelKey];
  };

  const getValue = (item) => item ? item[valueKey] : undefined;

  // Cập nhật text hiển thị khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      const selected = options.find(item => getValue(item) === value);
      if (selected) {
        setSearchTerm(getLabel(selected));
      }
    } else {
      setSearchTerm('');
    }
  }, [value, options]);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset lại text nếu chưa chọn gì
        if (value) {
          const selected = options.find(item => getValue(item) === value);
          if (selected) setSearchTerm(getLabel(selected));
        } else {
          setSearchTerm('');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, value, options]);

  const filteredOptions = options.filter(item => {
    const term = searchTerm.toLowerCase();
    const label = getLabel(item).toLowerCase();
    const val = String(getValue(item)).toLowerCase();
    return label.includes(term) || val.includes(term);
  });

  const handleSelect = (item) => {
    onChange(getValue(item));
    setSearchTerm(getLabel(item));
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(undefined);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`relative flex items-center w-full border rounded-lg bg-white transition-all h-11 ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <div className="pl-3 text-gray-400">
          {Icon ? <Icon size={18} /> : <Search size={18} />}
        </div>
        <input
          type="text"
          className="w-full h-full px-2 text-sm text-gray-700 bg-transparent focus:outline-none rounded-lg placeholder-gray-400"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '') onChange(undefined);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {value && (
          <button onClick={handleClear} className="p-1 mr-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors">
            <X size={14} />
          </button>
        )}
        <div className="pr-3 text-gray-400">
          {!value && <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 left-0">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {/* Tùy chọn bỏ lọc */}
              <li
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer border-b border-gray-100 italic"
                onClick={() => { onChange(undefined); setSearchTerm(''); setIsOpen(false); }}
              >
                -- Tất cả --
              </li>
              {filteredOptions.map((item) => {
                const itemVal = getValue(item);
                const itemLabel = getLabel(item);
                const isSelected = value === itemVal;

                return (
                  <li
                    key={itemVal}
                    onClick={() => handleSelect(item)}
                    className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center group transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                  >
                    <div className="flex flex-col">
                      <span>{itemLabel}</span>
                    </div>
                    {isSelected && <Check size={16} />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </div>
  );
};

//  2. COMPONENT
const SalaryFilter = ({
  listPhongBan, listChucVu, filteredNhanVien,
  selectedPhong, setSelectedPhong,
  selectedChucVu, setSelectedChucVu,
  targetMaNV, setTargetMaNV,
  selectedMonth, setSelectedMonth,
  onCalculate, loading
}) => {


  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";


  return (
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
      <div className="mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          💰 Tính Lương (Payroll)
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* 1. Phòng ban */}
        <div className="col-span-1">
          <label className={labelClass}>Phòng ban</label>
          <SearchableSelect
            options={listPhongBan}
            value={selectedPhong}
            onChange={setSelectedPhong}
            labelKey="ten_phong"
            valueKey="ma_phong"
            placeholder="Tất cả"
            icon={Layers}
          />
        </div>


        {/* 2. Chức vụ */}
        <div className="col-span-1">
          <label className={labelClass}>Chức vụ</label>
          <SearchableSelect
            options={listChucVu}
            value={selectedChucVu}
            onChange={setSelectedChucVu}
            labelKey="ten_chuc_vu"
            valueKey="ma_chuc_vu"
            placeholder="Tất cả"
            icon={Briefcase}
          />
        </div>


        {/* 3. Nhân viên */}
        <div className="col-span-1">
          <label className={labelClass}>Nhân viên</label>
          <SearchableSelect
            options={filteredNhanVien}
            value={targetMaNV}
            onChange={setTargetMaNV}
            valueKey="ma_nhan_vien"
            customDisplay={(item) => `${item.ten_nhan_vien} (${item.ma_nhan_vien})`}
            placeholder="Tìm NV..."
            icon={User}
          />
        </div>


        {/* 4. Kỳ lương */}
        <div className="col-span-1">
          <label className={labelClass}>Kỳ lương</label>
          <div className="h-11">
            <CustomMonthPicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Chọn kỳ..."
            />
          </div>
        </div>


        {/* 5. Button */}
        <div className="col-span-1">
          <button
            onClick={onCalculate}
            disabled={loading}
            className={`w-full h-11 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Cpu size={18} />}
            <span className="text-sm">{loading ? 'Đang xử lý...' : 'Tính Lương'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default SalaryFilter;

