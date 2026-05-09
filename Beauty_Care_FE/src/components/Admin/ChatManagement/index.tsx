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
  Tag,
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
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import { useAuth } from "../../../hooks/useAuth";
import { useSocket } from "../../../contexts/SocketContext";
import { API } from "../../../api/config";
import { getAllConversations, getConversationsByExpertId } from "../../../api/conversation";
import { createMessage, getMessagesByConversationId, markAsRead, uploadFile } from "../../../api/message";
import "./style.scss";

const { Text } = Typography;
const { Search } = Input;

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

const ChatManagement: React.FC = () => {
  const { user, token } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const joinedRoomRef = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && token) {
      loadConversations();
    }
  }, [user, token]);

  useEffect(() => {
    if (socket && isConnected) {
      const myId = currentUserProfile?.id || (user as any)?.id;
      
      // Join personal expert room for sidebar updates across all conversations
      if (myId) {
        socket.emit("joinConversation", `expert_${myId}`);
      }

      // Join active conversation room
      if (selectedConversation && joinedRoomRef.current !== selectedConversation.id) {
        socket.emit("joinConversation", selectedConversation.id);
        joinedRoomRef.current = selectedConversation.id;
      }

      const handleReceiveMessage = (newMessage: MessageType) => {
        console.log("📩 Admin received socket message:", newMessage);
        
        // Ensure message_type is handled
        const msg = { ...newMessage, message_type: newMessage.message_type || "text" };

        // Update messages list if it's the active conversation
        if (selectedConversation && msg.conversation_id === selectedConversation.id) {
          if (Number(msg.sender_id) !== Number(myId)) {
            setMessages((prev) => {
              if (prev.find(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            // Mark as read immediately since we are viewing it
            if (myId) markAsRead(selectedConversation.id, Number(myId));
          }
        }
        
        // ALWAYS update conversations list in sidebar for real-time updates
        setConversations(prev => prev.map(c => {
          if (c.id === msg.conversation_id) {
            // Update last message and updatedAt
            const updatedMessages = [...(c.messages || [])];
            if (!updatedMessages.find(m => m.id === msg.id)) {
              updatedMessages.push(msg);
            }
            
            // If active, mark as read locally
            if (selectedConversation && c.id === selectedConversation.id) {
              updatedMessages.forEach(m => m.is_read = true);
            }
            
            return { 
              ...c, 
              messages: updatedMessages, 
              updatedAt: msg.createdAt 
            };
          }
          return c;
        }));
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, isConnected, selectedConversation?.id, currentUserProfile?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      const profileRes = await API.get("/user/current");
      const fullUser = profileRes.data?.data || profileRes.data;
      
      if (!fullUser) {
        console.warn("⚠️ Could not fetch user profile");
        setLoading(false);
        return;
      }
      
      setCurrentUserProfile(fullUser);
      const roleCode = fullUser.role_code;
      const myId = fullUser.id;

      let convRes;
      if (roleCode === "R1") {
        // Admin: Load everything
        console.log("📌 Admin loading all conversations");
        convRes = await getAllConversations();
      } else {
        // Staff/Expert: Load their own
        if (!myId) {
          console.warn("⚠️ No ID found in profile for staff");
          setLoading(false);
          return;
        }
        console.log("📌 Staff loading conversations for ID:", myId);
        convRes = await getConversationsByExpertId(Number(myId));
      }

      console.log("📌 API Response:", convRes);
      if (convRes.err === 0) {
        const convs = convRes.data || [];
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
    const myId = currentUserProfile?.id || (user as any)?.id;
    
    // Mark as read
    if (myId) {
      markAsRead(conv.id, Number(myId));
      // Update local state to clear unread badge
      setConversations(prev => prev.map(c => {
        if (c.id === conv.id) {
          const updatedMessages = c.messages?.map(m => ({ ...m, is_read: true })) || [];
          return { ...c, messages: updatedMessages };
        }
        return c;
      }));
    }

    try {
      const msgRes = await getMessagesByConversationId(conv.id);
      if (msgRes.err === 0) {
        setMessages(msgRes.data || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedConversation) return;

    const senderId = currentUserProfile?.id || (user as any)?.id;
    if (!senderId) {
      message.error("Lỗi xác thực người dùng");
      return;
    }

    const newMessageData = {
      conversation_id: selectedConversation.id,
      sender_id: Number(senderId),
      message_type: "text" as const,
      content: inputText.trim(),
    };

    try {
      const msgRes = await createMessage(newMessageData);
      if (msgRes.err === 0) {
        const newMessage = msgRes.data;
        setInputText("");
        setMessages((prev) => [...prev, newMessage]);
        // Update sidebar
        setConversations(prev => prev.map(c => {
          if (c.id === newMessage.conversation_id) {
            return { ...c, messages: [...(c.messages || []), newMessage], updatedAt: newMessage.createdAt };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Gửi tin nhắn thất bại");
    }
  };

  const handleStickerClick = async (url: string) => {
    if (!selectedConversation) return;
    const senderId = currentUserProfile?.id || (user as any)?.id;
    if (!senderId) return;

    const newMessageData = {
      conversation_id: selectedConversation.id,
      sender_id: Number(senderId),
      message_type: "sticker" as const,
      content: url,
    };

    try {
      const msgRes = await createMessage(newMessageData);
      if (msgRes.err === 0) {
        const newMessage = msgRes.data;
        setMessages((prev) => [...prev, newMessage]);
        setConversations(prev => prev.map(c => {
          if (c.id === newMessage.conversation_id) {
            return { ...c, messages: [...(c.messages || []), newMessage], updatedAt: newMessage.createdAt };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error("Error sending sticker:", error);
    }
  };

  const onImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    try {
      setUploading(true);
      const uploadRes = await uploadFile(file);
      if (uploadRes.url) {
        const senderId = currentUserProfile?.id || (user as any)?.id;
        const newMessageData = {
          conversation_id: selectedConversation.id,
          sender_id: Number(senderId),
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
    if (!file || !selectedConversation) return;

    try {
      setUploading(true);
      const uploadRes = await uploadFile(file);
      if (uploadRes.url) {
        const senderId = currentUserProfile?.id || (user as any)?.id;
        const newMessageData = {
          conversation_id: selectedConversation.id,
          sender_id: Number(senderId),
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

  const getExpertName = (conv: ConversationType) => {
    if (conv.expertData) {
      return `${conv.expertData.firstName || ""} ${conv.expertData.lastName || ""}`.trim();
    }
    return "Chuyên gia tư vấn";
  };

  const getUserAvatar = (conv: ConversationType) => {
    if (conv.userData?.avatar) {
      return conv.userData.avatar;
    }
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=Customer${conv.userId}`;
  };

  const getExpertAvatar = (conv: ConversationType) => {
    if (conv.expertData?.avatar) {
      return conv.expertData.avatar;
    }
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=Expert${conv.expertId}`;
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
      const myId = currentUserProfile?.id || (user as any)?.id;
      return conv.messages.filter(m => !m.is_read && Number(m.sender_id) !== Number(myId)).length;
    }
    return 0;
  };

  const getSenderName = (msg: MessageType) => {
    const myId = currentUserProfile?.id || (user as any)?.id;
    if (msg.sender) {
      return `${msg.sender.firstName || ""} ${msg.sender.lastName || ""}`.trim();
    }
    return Number(msg.sender_id) === Number(myId) ? "Bạn" : "Khách hàng";
  };

  const getSenderAvatar = (msg: MessageType) => {
    const myId = currentUserProfile?.id || (user as any)?.id;
    if (msg.sender?.avatar) {
      return msg.sender.avatar;
    }
    if (Number(msg.sender_id) === Number(myId)) {
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
  const isMe = (msg: MessageType) => {
    if (!selectedConversation || !msg.sender_id) return false;
    // Simple logic: If the sender is NOT the customer of this conversation, it's an expert/admin
    return Number(msg.sender_id) !== Number(selectedConversation.userId);
  };

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
                <Tooltip title={showSidebar ? "Ẩn thông tin" : "Hiện thông tin"}>
                  <Button 
                    type="text" 
                    shape="circle" 
                    icon={<InfoCircleOutlined />} 
                    onClick={() => setShowSidebar(!showSidebar)}
                    className={showSidebar ? "active-info-btn" : ""}
                  />
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
                    <div className={`message-bubble ${msg.message_type || "text"}`}>
                      <div className="bubble-content">
                        {!isMe(msg) && (
                          <Text strong style={{ display: 'block', marginBottom: 4 }}>
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
                disabled={!isConnected || uploading}
                suffix={
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    className="send-btn"
                    disabled={!isConnected || uploading}
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

      {selectedConversation && showSidebar && (
        <div className="sidebar-right">
          <div className="sidebar-right-content">
            {/* Section 1: Khách hàng */}
            <div className="profile-section">
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>Khách hàng</Text>
              <Avatar size={64} src={getUserAvatar(selectedConversation)} className="profile-avatar" />
              <h3 className="profile-name">{getUserName(selectedConversation)}</h3>
              <Text type="secondary" className="profile-role">ID: #{selectedConversation.userId}</Text>
              <div className="profile-tags" style={{ marginTop: 8 }}>
                <Tag color="blue">Khách hàng mới</Tag>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* Section 2: Chuyên gia */}
            <div className="profile-section" style={{ paddingTop: 0 }}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>Chuyên gia phụ trách</Text>
              <Avatar size={64} src={getExpertAvatar(selectedConversation)} className="profile-avatar" />
              <h3 className="profile-name">{getExpertName(selectedConversation)}</h3>
              <Text type="secondary" className="profile-role">Chuyên gia tư vấn</Text>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className="info-section">
              <div className="info-item">
                <InfoCircleOutlined className="info-icon" />
                <div>
                  <Text strong>Trạng thái cuộc gọi</Text>
                  <br />
                  <Text type="secondary" className="info-desc">Chưa có cuộc gọi nào</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;
