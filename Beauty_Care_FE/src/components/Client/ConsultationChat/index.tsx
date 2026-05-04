import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Input,
  Button,
  Space,
  Typography,
  Tooltip,
  Spin,
  message,
} from "antd";
import {
  SendOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  SmileOutlined,
  FileImageOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import { useSocket } from "../../../contexts/SocketContext";
import {
  createConversation,
} from "../../../api/conversation";
import { createMessage, getMessagesByConversationId } from "../../../api/message";
import "./style.scss";

const { Text } = Typography;

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
  userData?: any;
  expertData?: any;
  messages?: MessageType[];
  createdAt: string;
  updatedAt: string;
};

const ConsultationChat: React.FC = () => {
  const { user, token } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversation, setConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const joinedRoomRef = useRef<number | null>(null);

  const EXPERT_ID = 2;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && token) {
      initConversation();
    }
  }, [user, token]);

  useEffect(() => {
    if (socket && conversation && user) {
      const userData = user as any;
      
      if (joinedRoomRef.current !== conversation.id) {
        if (joinedRoomRef.current !== null) {
          socket.emit("leaveRoom", joinedRoomRef.current);
        }
        socket.emit("joinRoom", conversation.id);
        joinedRoomRef.current = conversation.id;
      }

      socket.on("receiveMessage", (newMessage: MessageType) => {
        if (newMessage.sender_id !== userData.id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket, conversation, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initConversation = async () => {
    try {
      setLoading(true);
      const userData = user as any;
      const convRes = await createConversation({
        userId: userData.id,
        expertId: EXPERT_ID,
        topic: "Tư vấn da liễu",
      });

      if (convRes.err === 0) {
        const conv = convRes.data;
        setConversation(conv);
        await loadMessages(conv.id);
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
      message.error("Không thể kết nối đến chuyên gia");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const msgRes = await getMessagesByConversationId(conversationId);
      if (msgRes.err === 0) {
        setMessages(msgRes.data || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !conversation || !user) return;

    const userData = user as any;
    const newMessageData = {
      conversation_id: conversation.id,
      sender_id: userData.id,
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

  const getSenderName = (msg: MessageType) => {
    if (msg.sender) {
      return `${msg.sender.firstName || ""} ${msg.sender.lastName || ""}`.trim();
    }
    return msg.sender_id === EXPERT_ID ? "Chuyên gia" : "Bạn";
  };

  const getSenderAvatar = (msg: MessageType) => {
    if (msg.sender?.avatar) {
      return msg.sender.avatar;
    }
    if (msg.sender_id === EXPERT_ID) {
      return "https://api.dicebear.com/9.x/avataaars/svg?seed=DrNguyen";
    }
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=You";
  };

  if (loading) {
    return (
      <div className="chat-app-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" tip="Đang kết nối..." />
      </div>
    );
  }

  const userData = user as any;
  const isMe = (msg: MessageType) => msg.sender_id === userData?.id;

  return (
    <div className="chat-app-container">
      <div className="chat-content">
        <div className="chat-header">
          <div className="chat-user-info">
            <Avatar size={40} src="https://api.dicebear.com/9.x/avataaars/svg?seed=DrNguyen" />
            <div className="user-text">
              <Text strong className="user-name">Chat cùng chuyên gia</Text>
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
              <p>Chào bạn! Hãy bắt đầu cuộc trò chuyện với chuyên gia của chúng tôi.</p>
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
                      <Text strong style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
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
            disabled={!conversation || !isConnected}
            suffix={
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSend}
                className="send-btn"
                disabled={!conversation || !isConnected}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultationChat;
