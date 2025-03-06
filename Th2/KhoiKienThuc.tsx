import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

interface KhoiKienThuc {
  id: string;
  tenKhoi: string;
}

interface Props {
  onKhoiAdded: (khoi: KhoiKienThuc) => void;
}

const KhoiKienThuc: React.FC<Props> = ({ onKhoiAdded }) => {
  const [danhSachKhoi, setDanhSachKhoi] = useState<KhoiKienThuc[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedKhoi = localStorage.getItem("danhSachKhoi");
    if (storedKhoi) setDanhSachKhoi(JSON.parse(storedKhoi));
  }, []);

  useEffect(() => {
    localStorage.setItem("danhSachKhoi", JSON.stringify(danhSachKhoi));
  }, [danhSachKhoi]);

  const handleSubmitKhoi = (values: { tenKhoi: string }) => {
    if (danhSachKhoi.some((khoi) => khoi.tenKhoi === values.tenKhoi)) {
      message.error("Khối kiến thức đã tồn tại!");
      return;
    }

    const newKhoi: KhoiKienThuc = { id: Date.now().toString(), tenKhoi: values.tenKhoi };
    const updatedList = [...danhSachKhoi, newKhoi];

    setDanhSachKhoi(updatedList);
    onKhoiAdded(newKhoi);
    setModalVisible(false);
    message.success("Thêm khối kiến thức thành công!");
    form.resetFields();
  };

  const handleXoaKhoi = (id: string) => {
    const newList = danhSachKhoi.filter((khoi) => khoi.id !== id);
    setDanhSachKhoi(newList);
    localStorage.setItem("danhSachKhoi", JSON.stringify(newList));
    message.success("Xóa khối kiến thức thành công!");
  };

  return (
    <div>
      <h2>Quản lý Khối Kiến Thức</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
        Thêm Khối Kiến Thức
      </Button>
      <Table
        className="mt-4"
        dataSource={danhSachKhoi}
        rowKey="id"
        columns={[
          { title: "Tên Khối Kiến Thức", dataIndex: "tenKhoi", key: "tenKhoi" },
          {
            title: "Thao tác",
            render: (_, record) => (
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleXoaKhoi(record.id)}>
                Xóa
              </Button>
            ),
          },
        ]}
      />

      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} title="Thêm Khối Kiến Thức">
        <Form form={form} layout="vertical" onFinish={handleSubmitKhoi}>
          <Form.Item name="tenKhoi" label="Tên Khối Kiến Thức" rules={[{ required: true, message: "Nhập tên khối kiến thức" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhoiKienThuc;
