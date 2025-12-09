import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tool } from 'react-feather';

const ComingSoonPage = ({ title = "Tính năng đang phát triển" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-primary">
        <Tool size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Chức năng này đang được đội ngũ kỹ thuật xây dựng và sẽ sớm ra mắt trong phiên bản tới. Xin cảm ơn sự kiên nhẫn của bạn.
      </p>
      <button onClick={() => navigate('/')} className="btn-primary">
        Quay về Trang chủ
      </button>
    </div>
  );
};

export default ComingSoonPage;