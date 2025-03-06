import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  khoiKienThuc: string;
}

interface KhoiKienThuc {
  id: string;
  tenKhoi: string;
}

interface Props {
  danhSachKhoi: KhoiKienThuc[];
}

const MonHoc: React.FC<Props> = ({ danhSachKhoi }) => {
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMonHoc, setEditingMonHoc] = useState<MonHoc | null>(null);

  useEffect(() => {
    const monHocStored = localStorage.getItem("danhSachMonHoc");
    if (monHocStored) setDanhSachMonHoc(JSON.parse(monHocStored));
  }, []);

  useEffect(() => {
    localStorage.setItem("danhSachMonHoc", JSON.stringify(danhSachMonHoc));
  }, [danhSachMonHoc]);

  const handleSubmitMonHoc = (values: MonHoc) => {
    if (editingMonHoc) {
      const updatedList = danhSachMonHoc.map((mon) =>
        mon.id === editingMonHoc.id ? { ...values, id: editingMonHoc.id } : mon
      );
      setDanhSachMonHoc(updatedList);
      message.success("Cập nhật môn học thành công!");
    } else {
      if (danhSachMonHoc.some((mon) => mon.maMon === values.maMon)) {
        message.error("Mã môn học đã tồn tại!");
        return;
      }
      const newMonHoc: MonHoc = { ...values, id: Date.now().toString() };
      setDanhSachMonHoc([...danhSachMonHoc, newMonHoc]);
      message.success("Thêm môn học thành công!");
    }

    setModalVisible(false);
    setEditingMonHoc(null);
    form.resetFields();
  };

  const handleXoaMonHoc = (id: string) => {
    const newList = danhSachMonHoc.filter((mon) => mon.id !== id);
    setDanhSachMonHoc(newList);
    message.success("Xóa môn học thành công!");
  };

  return (
    <div>
      <h2>Quản lý Môn học</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
        Thêm Môn Học
      </Button>
      <Table
        className="mt-4"
        dataSource={danhSachMonHoc}
        rowKey="id"
        columns={[
          { title: "Mã môn", dataIndex: "maMon", key: "maMon" },
          { title: "Tên môn", dataIndex: "tenMon", key: "tenMon" },
          { title: "Số tín chỉ", dataIndex: "soTinChi", key: "soTinChi" },
          { title: "Khối kiến thức", dataIndex: "khoiKienThuc", key: "khoiKienThuc" },
          {
            title: "Thao tác",
            render: (_, record) => (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingMonHoc(record);
                    form.setFieldsValue(record);
                    setModalVisible(true);
                  }}
                />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleXoaMonHoc(record.id)} />
              </>
            ),
          },
        ]}
      />

      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} title="Thêm Môn học">
        <Form form={form} layout="vertical" onFinish={handleSubmitMonHoc}>
          <Form.Item name="maMon" label="Mã môn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tenMon" label="Tên môn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="khoiKienThuc" label="Khối kiến thức">
            <Select>
              {danhSachKhoi.map((khoi) => (
                <Option key={khoi.id} value={khoi.tenKhoi}>
                  {khoi.tenKhoi}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonHoc;
