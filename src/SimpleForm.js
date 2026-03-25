import { useState } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import "./WawForm.css"; // on va mettre le CSS séparé pour style pro

function WawForm() {
  const [formData, setFormData] = useState({ nom: "", prenom: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="waw-card p-5 shadow-lg">
        <h2 className="waw-title text-center mb-4">Formulaire WAW ✨</h2>

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              isInvalid={!!errors.nom}
              placeholder="Entrez votre nom"
              className="waw-input"
            />
            <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              isInvalid={!!errors.prenom}
              placeholder="Entrez votre prénom"
              className="waw-input"
            />
            <Form.Control.Feedback type="invalid">{errors.prenom}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="Entrez votre email"
              className="waw-input"
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            className="waw-button w-100 mt-3"
            disabled={!formData.nom || !formData.prenom || !formData.email}
          >
            Envoyer
          </Button>
        </Form>

        {submitted && (
          <Alert variant="success" className="mt-4 text-center waw-alert">
            <h5>🎉 Formulaire soumis avec succès !</h5>
            <div>Nom: {formData.nom}</div>
            <div>Prénom: {formData.prenom}</div>
            <div>Email: {formData.email}</div>
          </Alert>
        )}
      </Card>
    </Container>
  );
}

export default WawForm;
