import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useToast } from "../services/getExportToastManager";

function Profile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("profile/"); // TODO OBSERVAR SI FUNCIONA CORRECTAMENTE
        setUser(response.data);
        setPreviewUrl(
          response.data.avatar_url ? response.data.avatar_url : null
        );
      } catch (err) {
        console.error(err);
        showToast("Error al cargar el perfil", "danger");
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await api.put("profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      showToast("Perfil actualizado", "success");

      // Limpiar el archivo después de la actualización
      setAvatarFile(null);
      fileInputRef.current.value = null; // Limpiar el input de archivo
    } catch (err) {
      console.error(err);
      showToast("Error al actualizar el perfil", "danger");
    }
  };

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Mi perfil</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={user.username}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={user.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Avatar</label>
          <div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="rounded"
                style={{ maxWidth: "80px" }}
              />
            ) : (
              <p>Sin foto de perfil</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Cambiar avatar</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            !avatarFile || (previewUrl && previewUrl === user.avatar_url)
          }
          title={
            !avatarFile
              ? "Sube una imagen para actualizar"
              : previewUrl === user.avatar_url
              ? "Selecciona una imagen diferente para actualizar"
              : "Haz clic para actualizar tu avatar"
          }
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default Profile;
// src/components/Profile.jsx
