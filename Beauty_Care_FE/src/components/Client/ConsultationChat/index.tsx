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
  Modal,
  Tag,
  Divider,
} from "antd";
import {
  SendOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  SmileOutlined,
  FileImageOutlined,
  PaperClipOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import { useAuth } from "../../../hooks/useAuth";
import { useSocket } from "../../../contexts/SocketContext";
import {
  createConversation,
} from "../../../api/conversation";
import { createMessage, getMessagesByConversationId, uploadFile } from "../../../api/message";
import "./style.scss";

const { Text } = Typography;

type MessageType = {
  id: number;
  conversation_id: number;
  content: string;
  sender_id: number;
  message_type: "text" | "image" | "file" | "sticker";
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

const STICKERS = [
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f602/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f618/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44c/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f496/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f338/512.gif",
];

const ConsultationChat: React.FC = () => {
  const { user, token } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversation, setConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const joinedRoomRef = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

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
    if (socket && isConnected && conversation && user) {
      const userData = user as any;

      // Join personal user room for background updates
      if (userData.id) {
        socket.emit("joinConversation", `user_${userData.id}`);
      }

      if (joinedRoomRef.current !== conversation.id) {
        socket.emit("joinConversation", conversation.id);
        joinedRoomRef.current = conversation.id;
      }

      const handleReceiveMessage = (newMessage: MessageType) => {
        console.log("📩 Client received socket message:", newMessage);
        // Default to text if type is missing or invalid
        const msg = { ...newMessage, message_type: newMessage.message_type || "text" };
        
        if (msg.conversation_id === conversation.id && msg.sender_id !== userData.id) {
          setMessages((prev) => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, isConnected, conversation, user]);

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

  const handleStickerClick = async (url: string) => {
    if (!conversation || !user) return;
    const userData = user as any;

    const newMessageData = {
      conversation_id: conversation.id,
      sender_id: userData.id,
      message_type: "sticker" as const,
      content: url,
    };

    try {
      const msgRes = await createMessage(newMessageData);
      if (msgRes.err === 0) {
        setMessages((prev) => [...prev, msgRes.data]);
      }
    } catch (error) {
      console.error("Error sending sticker:", error);
    }
  };

  const onImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversation) return;

    try {
      setUploading(true);
      const uploadRes = await uploadFile(file);
      if (uploadRes.url) {
        const userData = user as any;
        const newMessageData = {
          conversation_id: conversation.id,
          sender_id: userData.id,
          message_type: "image" as const,
          content: uploadRes.url,
        };
        const msgRes = await createMessage(newMessageData);
        if (msgRes.err === 0) {
          setMessages((prev) => [...prev, msgRes.data]);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Tải ảnh thất bại");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversation) return;

    try {
      setUploading(true);
      const uploadRes = await uploadFile(file);
      if (uploadRes.url) {
        const userData = user as any;
        const newMessageData = {
          conversation_id: conversation.id,
          sender_id: userData.id,
          message_type: "file" as const,
          content: uploadRes.url,
        };
        const msgRes = await createMessage(newMessageData);
        if (msgRes.err === 0) {
          setMessages((prev) => [...prev, msgRes.data]);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Tải tệp thất bại");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const getExpertName = () => {
    if (conversation?.expertData) {
      return `${conversation.expertData.firstName || ""} ${conversation.expertData.lastName || ""}`.trim();
    }
    return "Chuyên gia tư vấn";
  };

  const getExpertAvatar = () => {
    if (conversation?.expertData?.avatar) {
      return conversation.expertData.avatar;
    }
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=DrNguyen";
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
            <Avatar size={40} src={getExpertAvatar()} />
            <div className="user-text">
              <Text strong className="user-name">Chat cùng chuyên gia</Text>
              <Text type="secondary" className="user-status">
                {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
              </Text>
            </div>
          </div>
          <Space size="middle">
            <Tooltip title="Xem thông tin">
              <Button 
                type="text" 
                shape="circle" 
                icon={<InfoCircleOutlined />} 
                onClick={() => setShowInfoModal(true)}
              />
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
                <div className={`message-bubble ${msg.message_type || "text"}`}>
                  <div className="bubble-content">
                    {!isMe(msg) && (
                      <Text strong style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
                        {getSenderName(msg)}
                      </Text>
                    )}
                    
                    {(msg.message_type === "text" || !msg.message_type) && <p>{msg.content}</p>}
                    
                    {msg.message_type === "image" && (
                      <div className="image-container">
                        <img 
                          src={msg.content} 
                          alt="Hình ảnh" 
                          style={{ maxWidth: '100%', borderRadius: 8, cursor: 'pointer', display: 'block' }} 
                          onClick={() => window.open(msg.content, '_blank')}
                        />
                      </div>
                    )}
                    
                    {msg.message_type === "sticker" && (
                      <img 
                        src={msg.content} 
                        alt="Sticker" 
                        style={{ width: 120, height: 120, display: 'block' }} 
                      />
                    )}
                    
                    {msg.message_type === "file" && (
                      <div className="file-message" onClick={() => window.open(msg.content, '_blank')}>
                        <FileTextOutlined style={{ fontSize: 24, marginRight: 8 }} />
                        <div style={{ flex: 1 }}>
                          <Text strong ellipsis style={{ width: 150, display: 'block' }}>
                            {msg.content.split('/').pop()?.split('-')[0] || "Tài liệu"}
                          </Text>
                          <Text type="secondary" size="small">Nhấp để tải xuống</Text>
                        </div>
                        <DownloadOutlined />
                      </div>
                    )}
                    
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
            <Popover
              content={
                <div style={{ width: 250, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8 }}>
                  {STICKERS.map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt="sticker" 
                      style={{ width: 50, height: 50, cursor: 'pointer' }}
                      onClick={() => handleStickerClick(url)}
                    />
                  ))}
                </div>
              }
              title="Nhãn dán"
              trigger="click"
            >
              <Button type="text" icon={<SmileOutlined />} />
            </Popover>
            
            <Button 
              type="text" 
              icon={<FileImageOutlined />} 
              onClick={() => imageInputRef.current?.click()}
              loading={uploading}
            />
            <Button 
              type="text" 
              icon={<PaperClipOutlined />} 
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
            />
            
            <input 
              type="file" 
              ref={imageInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={onImageSelect}
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={onFileSelect}
            />
          </div>
          <Input
            placeholder="Nhập tin nhắn..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleKeyPress}
            size="large"
            disabled={!conversation || !isConnected || uploading}
            suffix={
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSend}
                className="send-btn"
                disabled={!conversation || !isConnected || uploading}
              />
            }
          />
        </div>
      </div>

      {/* Thông tin chuyên gia Modal */}
      <Modal
        title="Thông tin cuộc hội thoại"
        open={showInfoModal}
        onCancel={() => setShowInfoModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowInfoModal(false)}>
            Đóng
          </Button>
        ]}
        width={450}
      >
        <div style={{ padding: '10px 0' }}>
          {/* Section 1: Bạn */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <Avatar size={60} src={user?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=You"} />
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>BẠN</Text>
              <br />
              <Text strong style={{ fontSize: 16 }}>{user?.firstName} {user?.lastName}</Text>
              <br />
              <Tag color="blue">Khách hàng</Tag>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }}>Đang kết nối cùng</Divider>

          {/* Section 2: Chuyên gia */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <Avatar size={60} src={getExpertAvatar()} />
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>CHUYÊN GIA TƯ VẤN</Text>
              <br />
              <Text strong style={{ fontSize: 16 }}>{getExpertName()}</Text>
              <br />
              <Text type="secondary">Chuyên gia tư vấn</Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConsultationChat;
