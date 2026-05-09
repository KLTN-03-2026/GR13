import ConsultationChatComponent from "../../../components/Client/ConsultationChat";
const ConsultationChatPage = () => {
  return (
    <div style={{ 
      height: "calc(100vh - 100px)", 
      width: "100%",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f0f2f5",
      padding: "20px",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      <ConsultationChatComponent />
    </div>
  );
};
export default ConsultationChatPage;