import React, { useState } from "react";
import KhoiKienThuc from "./KhoiKienThuc";
import MonHoc from "./MonHoc";

const Bai2: React.FC = () => {
  const [danhSachKhoi, setDanhSachKhoi] = useState<{ id: string; tenKhoi: string }[]>([]);

  const handleKhoiAdded = (newKhoi: { id: string; tenKhoi: string }) => {
    setDanhSachKhoi((prev) => [...prev, newKhoi]);
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Môn học & Khối Kiến Thức</h1>
      <KhoiKienThuc onKhoiAdded={handleKhoiAdded} />
      <MonHoc danhSachKhoi={danhSachKhoi} />
    </div>
  );
};

export default Bai2;
