import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Input,
  Button,
  Space,
  Badge,
  Divider,
  List,
  Typography,
  Tooltip,
  Spin,
  message,
} from "antd";
import {
  SearchOutlined,
  SendOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  SmileOutlined,
  FileImageOutlined,
  PaperClipOutlined,
  MoreOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import { useSocket } from "../../../contexts/SocketContext";
import { getConversationsByExpertId } from "../../../api/conversation";
import { createMessage, getMessagesByConversationId } from "../../../api/message";
import "./style.scss";

const { Text } = Typography;
const { Search } = Input;

type MessageType = {
  id: number;
  conversation_id: number;
  content: string;
  sender_id: number;
  message_type: "text" | "image";
  is_read: boolean;
  createdAt: string;
  sender?: {
    id: number;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
};

type ConversationType = {
  id: number;
  userId: number;
  expertId: number;
  topic?: string;
  userData?: {
    id: number;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  expertData?: any;
  messages?: MessageType[];
  createdAt: string;
  updatedAt: string;
};

const ChatManagement: React.FC = () => {
  const { user, token } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const joinedRoomRef = useRef<number | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && token) {
      loadConversations();
    }
  }, [user, token]);

  useEffect(() => {
    if (socket && user) {
      const userData = user as any;
      socket.on("receiveMessage", (newMessage: MessageType) => {
        if (selectedConversation && newMessage.conversation_id === selectedConversation.id && newMessage.sender_id !== userData.id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket, selectedConversation, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const expertId = 2;
      console.log("📌 Calling API with expertId:", expertId);
      const convRes = await getConversationsByExpertId(expertId);
      console.log("📌 API Response:", convRes);
      if (convRes.err === 0) {
        const convs = convRes.data || [];
        console.log("📌 Conversations to set:", convs);
        setConversations(convs);
        if (convs.length > 0) {
          handleSelectConversation(convs[0]);
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      message.error("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conv: ConversationType) => {
    setSelectedConversation(conv);
    try {
      const msgRes = await getMessagesByConversationId(conv.id);
      if (msgRes.err === 0) {
        setMessages(msgRes.data || []);
      }
      if (socket) {
        if (joinedRoomRef.current !== conv.id) {
          if (joinedRoomRef.current !== null) {
            socket.emit("leaveRoom", joinedRoomRef.current);
          }
          socket.emit("joinRoom", conv.id);
          joinedRoomRef.current = conv.id;
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedConversation) return;

    const senderId = 2;
    const newMessageData = {
      conversation_id: selectedConversation.id,
      sender_id: senderId,
      message_type: "text" as const,
      content: inputText.trim(),
    };

    try {
      const msgRes = await createMessage(newMessageData);
      if (msgRes.err === 0) {
        setInputText("");
        setMessages((prev) => [...prev, msgRes.data]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Gửi tin nhắn thất bại");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return formatTime(dateString);
    } else if (days === 1) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const getUserName = (conv: ConversationType) => {
    if (conv.userData) {
      return `${conv.userData.firstName || ""} ${conv.userData.lastName || ""}`.trim();
    }
    return "Khách hàng";
  };

  const getUserAvatar = (conv: ConversationType) => {
    if (conv.userData?.avatar) {
      return conv.userData.avatar;
    }
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=Customer${conv.userId}`;
  };

  const getLastMessage = (conv: ConversationType) => {
    if (conv.messages && conv.messages.length > 0) {
      const lastMsg = conv.messages[conv.messages.length - 1];
      return lastMsg.content;
    }
    return "Chưa có tin nhắn";
  };

  const getUnreadCount = (conv: ConversationType) => {
    if (conv.messages) {
      return conv.messages.filter(m => !m.is_read && m.sender_id !== (user as any)?.id).length;
    }
    return 0;
  };

  const getSenderName = (msg: MessageType) => {
    if (msg.sender) {
      return `${msg.sender.firstName || ""} ${msg.sender.lastName || ""}`.trim();
    }
    return msg.sender_id === (user as any)?.id ? "Bạn" : "Khách hàng";
  };

  const getSenderAvatar = (msg: MessageType) => {
    if (msg.sender?.avatar) {
      return msg.sender.avatar;
    }
    if (msg.sender_id === (user as any)?.id) {
      return "https://api.dicebear.com/9.x/avataaars/svg?seed=Expert";
    }
    if (selectedConversation) {
      return getUserAvatar(selectedConversation);
    }
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=Customer";
  };

  const filteredConversations = conversations.filter(conv =>
    getUserName(conv).toLowerCase().includes(searchText.toLowerCase()) ||
    getLastMessage(conv).toLowerCase().includes(searchText.toLowerCase())
  );

  const userData = user as any;
  const isMe = (msg: MessageType) => msg.sender_id === userData?.id;

  return (
    <div className="chat-app-container">
      <div className="sidebar-left">
        <div className="sidebar-header">
          <div className="header-actions">
            <Avatar size={40} src="https://api.dicebear.com/9.x/avataaars/svg?seed=Expert" />
            <Space>
              <Button type="text" icon={<BellOutlined />} />
              <Button type="text" icon={<MoreOutlined />} />
            </Space>
          </div>

          <h2 className="sidebar-title">Đoạn chat tư vấn</h2>

          <Search
            placeholder="Tìm kiếm cuộc trò chuyện..."
            prefix={<SearchOutlined style={{ color: '#b3b3b3' }} />}
            allowClear
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="filter-tabs">
            <button className="tab active">Tất cả</button>
            <button className="tab">Chưa đọc</button>
            <button className="tab">Đang hoạt động</button>
          </div>
          
          <Button 
            type="primary" 
            onClick={loadConversations}
            style={{ width: '100%', marginTop: 16 }}
            loading={loading}
          >
            🔄 Load lại danh sách cuộc trò chuyện
          </Button>
        </div>

        <div className="conversation-list">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin />
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? "active" : ""}`}
                onClick={() => handleSelectConversation(conv)}
              >
                <div className="avatar-wrapper">
                  <Avatar size={48} src={getUserAvatar(conv)} />
                  <span className="status-dot online" />
                </div>
                <div className="conversation-info">
                  <div className="info-top">
                    <Text strong className="conv-name">{getUserName(conv)}</Text>
                    <Text type="secondary" className="conv-time">{formatDate(conv.updatedAt)}</Text>
                  </div>
                  <div className="info-bottom">
                    <Text type="secondary" ellipsis className="conv-last-msg">
                      {getLastMessage(conv)}
                    </Text>
                    {getUnreadCount(conv) > 0 && (
                      <Badge count={getUnreadCount(conv)} className="unread-badge" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-content" style={{ flex: 1 }}>
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <Avatar size={40} src={getUserAvatar(selectedConversation)} />
                <div className="user-text">
                  <Text strong className="user-name">{getUserName(selectedConversation)}</Text>
                  <Text type="secondary" className="user-status">
                    {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
                  </Text>
                </div>
              </div>
              <Space size="middle">
                <Tooltip title="Gọi thoại">
                  <Button type="text" shape="circle" icon={<PhoneOutlined />} />
                </Tooltip>
                <Tooltip title="Gọi video">
                  <Button type="text" shape="circle" icon={<VideoCameraOutlined />} />
                </Tooltip>
                <Tooltip title="Xem thông tin">
                  <Button type="text" shape="circle" icon={<InfoCircleOutlined />} />
                </Tooltip>
              </Space>
            </div>

            <div className="chat-body">
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#8c8c8c" }}>
                  <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`message-row ${isMe(msg) ? "me" : "other"}`}>
                    {!isMe(msg) && (
                      <Avatar size={32} src={getSenderAvatar(msg)} className="msg-avatar" />
                    )}
                    <div className="message-bubble">
                      <div className="bubble-content">
                        {!isMe(msg) && (
                          <Text strong style={{ display: 'block', marginBottom: 4 }}>
                            {getSenderName(msg)}
                          </Text>
                        )}
                        <p>{msg.content}</p>
                        <span className="msg-time">{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                    {isMe(msg) && (
                      <Avatar size={32} src={getSenderAvatar(msg)} className="msg-avatar" />
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
              <div className="footer-actions">
                <Button type="text" icon={<SmileOutlined />} />
                <Button type="text" icon={<FileImageOutlined />} />
                <Button type="text" icon={<PaperClipOutlined />} />
              </div>
              <Input
                placeholder="Nhập tin nhắn..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={handleKeyPress}
                size="large"
                disabled={!isConnected}
                suffix={
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    className="send-btn"
                    disabled={!isConnected}
                  />
                }
              />
            </div>
          </>
        ) : (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%", 
            color: "#8c8c8c" 
          }}>
            <div style={{ textAlign: "center" }}>
              <InfoCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>Vui lòng chọn một cuộc trò chuyện</p>
            </div>
          </div>
        )}
      </div>

      {selectedConversation && (
        <div className="sidebar-right">
          <div className="sidebar-right-content">
            <div className="profile-section">
              <Avatar size={80} src={getUserAvatar(selectedConversation)} className="profile-avatar" />
              <h3 className="profile-name">{getUserName(selectedConversation)}</h3>
              <Text type="secondary" className="profile-role">Khách hàng</Text>
              
              <Space wrap className="profile-tags">
                <span className="tag">Da dầu</span>
                <span className="tag">Mụn</span>
              </Space>
            </div>

            <Divider />

            <div className="info-section">
              <div className="info-item">
                <InfoCircleOutlined className="info-icon" />
                <div>
                  <Text strong>Thông tin liên hệ</Text>
                  <br />
                  <Text type="secondary" className="info-desc">Số điện thoại và email đã được xác thực</Text>
                </div>
              </div>
              
              <div className="info-item">
                <BellOutlined className="info-icon" />
                <div>
                  <Text strong>Thông báo</Text>
                  <br />
                  <Text type="secondary" className="info-desc">Tùy chỉnh cảnh báo</Text>
                </div>
              </div>
              
              <div className="info-item">
                <SearchOutlined className="info-icon" />
                <div>
                  <Text strong>Tìm kiếm tin nhắn</Text>
                  <br />
                  <Text type="secondary" className="info-desc">Tìm trong cuộc trò chuyện này</Text>
                </div>
              </div>
            </div>

            <Divider />

            <div className="action-section">
              <List
                dataSource={[
                  "Tùy chỉnh đoạn chat",
                  "File phương tiện & file",
                  "Quyền riêng tư và hỗ trợ",
                ]}
                renderItem={(item) => (
                  <List.Item className="list-item">
                    <span>{item}</span>
                    <MoreOutlined className="item-arrow" rotate={-90} />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;
