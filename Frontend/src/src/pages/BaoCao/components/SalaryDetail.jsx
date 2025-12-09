import React from 'react';

const SalaryDetail = ({ data, total, name, year, loading, isAdmin, onBack }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-enter">
      {/* LEFT COL: HEADER & TABLE */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg text-gray-700">
            Chi tiết lương của: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold mx-2 text-sm">{name}</span>
            Năm <b>{year}</b>
          </div>
          {isAdmin && (
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary underline">
              ← Quay lại danh sách
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-700 font-bold border-b">
               <tr>
                 <th className="px-4 py-3">Tháng</th>
                 <th className="px-4 py-3 text-right">Lương Cơ Bản</th>
                 <th className="px-4 py-3 text-right">Làm Thêm (OT)</th>
                 <th className="px-4 py-3 text-right">Thực Nhận</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr><td colSpan="4" className="text-center py-6">Đang tải...</td></tr>
                ) : data && data.length > 0 ? (
                  data.map((r) => (
                    <tr key={r.thang} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">
                          Tháng {r.thang}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-600">{Number(r.luong_co_ban).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-600">{Number(r.luong_them_gio).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-green-600">{Number(r.tong_luong).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                   <tr><td colSpan="4" className="text-center py-6 text-gray-400">Không có dữ liệu chi tiết</td></tr>
                )}
             </tbody>
           </table>
        </div>
      </div>
      
      {/* RIGHT COL: SUMMARY CARD */}
      <div className="md:col-span-1">
        <div className="sticky top-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow-sm">
          <div className="text-green-700 font-semibold mb-2 uppercase tracking-wide text-xs">
            Tổng Thu Nhập Năm {year}
          </div>
          <div className="text-3xl font-extrabold text-green-600 mb-1">
             {total ? Number(total).toLocaleString() : 0} 
             <span className="text-base font-normal text-green-500 ml-1">VNĐ</span>
          </div>
          <div className="text-green-800 text-4xl mt-2 opacity-20">💰</div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetail;