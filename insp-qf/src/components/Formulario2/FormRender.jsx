import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function FormRender() {
  const [forms, setForms] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetch("http://localhost:3000/api/forms")
      .then(res => res.json())
      .then(data => setForms(data));
  }, []);

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h2>Formularios Guardados</h2>
      {forms.map((form) => (
        <form key={form.id} onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 20 }}>
          <h3>Formulario {form.id}</h3>
          {form.fields.map((f, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <label>{f.label}</label>
              <input type={f.type} {...register(f.name)} />
            </div>
          ))}
          <button type="submit">Enviar</button>
        </form>
      ))}
    </div>
  );
}
