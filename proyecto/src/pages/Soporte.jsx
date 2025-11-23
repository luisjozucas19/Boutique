import { useEffect, useState } from "react";
import Services from "../services/Services";

export default function Soporte() {
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState("");
  const [asunto, setAsunto] = useState("");
  const [sugerencia, setSugerencia] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [mensajeEncuesta, setMensajeEncuesta] = useState("");
  const [mensajeSugerencia, setMensajeSugerencia] = useState("");

  useEffect(() => {
    const cargarFaq = async () => {
      try {
        const data = await Services.getDatos("faq");
        setFaqs(data);
      } catch (error) {
        console.error("Error cargando FAQ:", error);
      }
    };
    cargarFaq();
  }, []);

  const manejarEnviarEncuesta = async (e) => {
    e.preventDefault();

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
      setMensajeEncuesta("Debe iniciar sesión para enviar una encuesta.");
      return;
    }

    const nuevaEncuesta = {
      usuarioId: usuarioActivo.id,
      correo: usuarioActivo.correo,
      puntaje: Number(puntaje),
      comentario,
      fecha: new Date().toLocaleString(),
    };

    try {
      await Services.postDatos("encuestas", nuevaEncuesta);
      setMensajeEncuesta("¡Gracias por tu retroalimentación!");
      setComentario("");
      setPuntaje(5);
    } catch (error) {
      console.error(error);
      setMensajeEncuesta("Ocurrió un error al enviar la encuesta.");
    }
  };

  const manejarEnviarSugerencia = async (e) => {
    e.preventDefault();

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
      setMensajeSugerencia("Debe iniciar sesión para enviar una sugerencia.");
      return;
    }

    const nuevaSugerencia = {
      usuarioId: usuarioActivo.id,
      correo: usuarioActivo.correo,
      asunto,
      mensaje: sugerencia,
      fecha: new Date().toLocaleString(),
      estado: "Pendiente",
    };

    try {
      await Services.postDatos("sugerencias", nuevaSugerencia);
      setMensajeSugerencia("Sugerencia enviada al administrador.");
      setAsunto("");
      setSugerencia("");
    } catch (error) {
      console.error(error);
      setMensajeSugerencia("Ocurrió un error al enviar la sugerencia.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Soporte al Cliente</h1>
      <p>Dejanos tus comentarios, sugerencias o consultá las preguntas frecuentes.</p>

      {/* ENCUESTA */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Encuesta de satisfacción</h2>
        <form onSubmit={manejarEnviarEncuesta}>
          <label>
            Puntaje (1 a 5):
            <select
              value={puntaje}
              onChange={(e) => setPuntaje(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value={1}>1 - Muy mala</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5 - Excelente</option>
            </select>
          </label>

          <div style={{ marginTop: "1rem" }}>
            <label>
              Comentario:
              <br />
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                style={{ width: "100%" }}
                placeholder="Contanos tu experiencia..."
              />
            </label>
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>
            Enviar encuesta
          </button>
        </form>

        {mensajeEncuesta && <p>{mensajeEncuesta}</p>}
      </section>

      {/* SUGERENCIAS */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Sugerencias</h2>
        <form onSubmit={manejarEnviarSugerencia}>
          <label>
            Asunto:
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              style={{ width: "100%", marginTop: "0.5rem" }}
              required
            />
          </label>

          <label>
            Sugerencia:
            <textarea
              value={sugerencia}
              onChange={(e) => setSugerencia(e.target.value)}
              rows={4}
              style={{ width: "100%", marginTop: "0.5rem" }}
              required
            />
          </label>

          <button type="submit" style={{ marginTop: "1rem" }}>
            Enviar sugerencia
          </button>
        </form>

        {mensajeSugerencia && <p>{mensajeSugerencia}</p>}
      </section>

      {/* FAQ */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Preguntas frecuentes</h2>
        {faqs.length === 0 ? (
          <p>No hay preguntas frecuentes aún.</p>
        ) : (
          <ul>
            {faqs.map((item) => (
              <li key={item.id} style={{ marginBottom: "1rem" }}>
                <strong>{item.pregunta}</strong>
                <br />
                {item.respuesta}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
