import ConsultationChatComponent from "../../../components/Client/ConsultationChat";
const ConsultationChatPage = () => {
  return (
    <div style={{ position: "fixed", top: 100, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
      <ConsultationChatComponent />
    </div>
  );
};
export default ConsultationChatPage;