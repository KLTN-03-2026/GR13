import React, { useState, useMemo } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  message,
  Tag,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetDiscounts,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
} from "../../../hooks/discount";
import type { IDiscount } from "../../../api/discount";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const DiscountManagementComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<IDiscount | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const { data: discountsRes, isLoading } = useGetDiscounts();
  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();
  const deleteMutation = useDeleteDiscount();

  const discounts = discountsRes?.data || [];

  const handleAdd = () => {
    setEditingDiscount(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: IDiscount) => {
    setEditingDiscount(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa mã giảm giá này không?",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Đã xóa mã giảm giá");
        } catch (error) {
          message.error("Lỗi khi xóa mã giảm giá");
        }
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const { dateRange, ...rest } = values;
        const payload = {
          ...rest,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        };

        if (editingDiscount) {
          await updateMutation.mutateAsync({
            id: editingDiscount.id,
            ...payload,
          });
          message.success("Đã cập nhật mã giảm giá");
        } else {
          await createMutation.mutateAsync(payload);
          message.success("Đã thêm mã giảm giá mới");
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    });
  };

  const filteredDiscounts = useMemo(() => {
    return discounts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.code.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [discounts, searchText]);

  const columns = [
    {
      title: "Tên chương trình",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Loại",
      dataIndex: "discountType",
      key: "discountType",
      render: (type: string) => (
        <Tag color={type === "percentage" ? "green" : "orange"}>
          {type === "percentage" ? "Phần trăm" : "Cố định"}
        </Tag>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (val: number, record: IDiscount) => 
        record.discountType === "percentage" ? `${val}%` : `${val.toLocaleString()}đ`,
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: any, record: IDiscount) => (
        <span>
          {dayjs(record.startDate).format("DD/MM/YYYY")} - {dayjs(record.endDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Sử dụng",
      key: "usage",
      render: (_: any, record: IDiscount) => (
        <span>
          {record.usedCount} / {record.usageLimit}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "error"}>
          {status === "active" ? "Đang chạy" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: IDiscount) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
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
    <div className="discount-management">
      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={3}>Quản lý khuyến mãi</Title>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Tìm kiếm mã hoặc tên..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Thêm mã mới
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredDiscounts}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingDiscount ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên chương trình"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Ví dụ: Giảm giá hè 2024" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã giảm giá"
                rules={[{ required: true, message: "Vui lòng nhập mã" }]}
              >
                <Input placeholder="Ví dụ: SUMMER2024" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="discountType"
                label="Loại giảm giá"
                initialValue="percentage"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="percentage">Phần trăm (%)</Select.Option>
                  <Select.Option value="fixed">Số tiền cố định (đ)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="discountValue"
                label="Giá trị giảm"
                rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="active"
              >
                <Select>
                  <Select.Option value="active">Kích hoạt</Select.Option>
                  <Select.Option value="inactive">Tạm dừng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minOrderValue"
                label="Giá trị đơn hàng tối thiểu"
                initialValue={0}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxDiscountValue"
                label="Số tiền giảm tối đa (cho %)"
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Thời gian hiệu lực"
                rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
              >
                <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="usageLimit"
                label="Tổng lượt dùng"
                initialValue={100}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="userUsageLimit"
                label="Lượt/Khách"
                initialValue={1}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountManagementComponent;
