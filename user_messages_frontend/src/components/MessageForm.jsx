import { useEffect, useState } from "react";
import api from "../services/api";

function MessageForm() {
    const [content, setContent] = useState("");
    const [receiver, setReceiver] = useState("");
    const [image, setImage] = useState(null);
    const [users, setUsers] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("users/");
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar los usuarios");
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        const formData = new FormData();
        formData.append("content", content);
        formData.append("receiver", receiver);
        if (image) {
            formData.append("image", image);
        }

        try {
            await api.post("messages/send/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSuccess("Mensaje enviado con éxito");
            setContent("");
            setReceiver("");
            setImage(null);
        } catch (err) {
            console.error(err);
            setError("Error al enviar el mensaje");
        }
    };

    return (
        <div className="container mt-4">
          <h2>Enviar mensaje</h2>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Destinatario</label>
              <select
                className="form-select"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
    
            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
    
            <div className="mb-3">
              <label className="form-label">Imagen (opcional)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
    
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </form>
        </div>
      );
}

export default MessageForm;
// src/components/MessageForm.jsx