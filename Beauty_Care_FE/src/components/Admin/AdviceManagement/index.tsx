import React, { useState } from "react";
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import {
  useGetRecommendations,
  useCreateRecommendation,
  useUpdateRecommendation,
  useDeleteRecommendation,
} from "../../../hooks/productRecommendation";
import type { IRecommendation } from "../../../api/productRecommendation";

const { Title, Text } = Typography;

const AdviceManagementComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState<IRecommendation | null>(null);
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: adviceRes, isLoading } = useGetRecommendations();
  const createMutation = useCreateRecommendation();
  const updateMutation = useUpdateRecommendation();
  const deleteMutation = useDeleteRecommendation();

  const adviceList = adviceRes?.data || [];

  const handleAdd = () => {
    setEditingAdvice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: IRecommendation) => {
    setEditingAdvice(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa tư vấn này không?",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Đã xóa tư vấn");
        } catch (error) {
          message.error("Lỗi khi xóa tư vấn");
        }
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingAdvice) {
          await updateMutation.mutateAsync({
            id: editingAdvice.id,
            ...values,
          });
          message.success("Đã cập nhật tư vấn");
        } else {
          await createMutation.mutateAsync(values);
          message.success("Đã thêm tư vấn mới");
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: IRecommendation) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="advice-management">
      <Title level={2}>Quản lý tư vấn soi da (AI)</Title>

      <Card
        title={
          <Space>
            <BulbOutlined /> Danh sách loại tư vấn
          </Space>
        }
        bordered={false}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm tư vấn
          </Button>
        }
      >
        <Spin spinning={isLoading}>
          <Table columns={columns} dataSource={adviceList} rowKey="id" />
        </Spin>
      </Card>

      <Modal
        title={editingAdvice ? "Chỉnh sửa tư vấn" : "Thêm tư vấn mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề tư vấn"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Ví dụ: Làn da khỏe mạnh & Cân bằng" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả & Hoạt chất khuyên dùng"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết và lời khuyên..." />
          </Form.Item>

          <Form.Item name="morning_routine" label="Quy trình buổi sáng">
            <Input.TextArea rows={3} placeholder="Mỗi bước bắt đầu bằng dấu • hoặc xuống dòng" />
          </Form.Item>

          <Form.Item name="evening_routine" label="Quy trình buổi tối">
            <Input.TextArea rows={3} placeholder="Mỗi bước bắt đầu bằng dấu • hoặc xuống dòng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdviceManagementComponent;
