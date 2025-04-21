import { useEffect, useState } from "react";
import api from "../services/api";
import * as bootstrap from "bootstrap";

function MessageList() {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imgUrl) => {
    console.log("Image clicked:", imgUrl);
    setSelectedImage(imgUrl);

    // Delay modal initialization to ensure the DOM is updated
    setTimeout(() => {
      const modalElement = document.getElementById("imageModal");
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } else {
        console.error("Modal element not found");
      }
    }, 100);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [receivedResponse, sentResponse] = await Promise.all([
          api.get("messages/received/"),
          api.get("messages/sent/"),
        ]);
        setReceivedMessages(receivedResponse.data);
        setSentMessages(sentResponse.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los mensajes");
      }
    };
    fetchMessages();
  }, []);

  {
    selectedImage && (
      <div
        onClick={closeModal}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          cursor: "zoom-out",
        }}
      >
        <img
          src={selectedImage}
          alt="Vista ampliada"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(255,255,255,0.4)",
          }}
        />
      </div>
    );
  }

  // TODO REVISAR ESTO, DIMENSIONES DE IMAGENES DIFERENTES EN RECIBIDOS Y ENVIADOS
  return (
    <div className="container mt-4">
      <h2>Mensajes recibidos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {receivedMessages.length === 0 ? (
        <p>No hay mensajes recibidos</p>
      ) : (
        <div className="list-group mb-5">
          {receivedMessages.map((msg) => {
            const imageUrl =
              msg.image && msg.image.startsWith("http")
                ? msg.image
                : msg.image
                ? `http://localhost:8000${msg.image}`
                : null;

            return (
              <div key={msg.id} className="list-group-item">
                <h5>De: {msg.sender_username}</h5>
                <p>{msg.content}</p>
                {msg.image && (
                  <img
                    src={imageUrl}
                    alt="Adjunto"
                    onClick={() => handleImageClick(imageUrl)}
                    style={{
                      maxWidth: "100px",
                      cursor: "pointer",
                      borderRadius: "8px",
                    }}
                    className="img-thumbnail"
                  />
                )}
                <small className="text-muted">{msg.sent_at}</small>
              </div>
            );
          })}
        </div>
      )}

      <h2>Mensajes enviados</h2>
      {sentMessages.length === 0 ? (
        <p>No hay mensajes enviados</p>
      ) : (
        <div className="list-group">
          {sentMessages.map((msg) => {
            const imageUrl =
              msg.image && msg.image.startsWith("http")
                ? msg.image
                : msg.image
                ? `http://localhost:8000${msg.image}`
                : null;

            return (
              <div key={msg.id} className="list-group-item">
                <h5>Para: {msg.receiver_username}</h5>
                <p>{msg.content}</p>
                {msg.image && (
                  <img
                    src={imageUrl}
                    alt="Adjunto"
                    className="message-thumbnail"
                    onClick={() => handleImageClick(imageUrl)}
                    style={{
                      maxWidth: "100px",
                      cursor: "pointer",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <small className="text-muted">{msg.sent_at}</small>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Bootstrap para imagen */}

      <div
        className="modal fade"
        id="imageModal"
        tabIndex="-1"
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark border-0 text-white">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0 text-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Vista ampliada"
                  style={{
                    width: "50%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Fin del modal */}
    </div>
  );
}

export default MessageList;
