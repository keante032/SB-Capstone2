import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Register({ register }) {
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [formErrors, setFormErrors] = useState([]);

    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await register(formData);
        if (result.success) {
            history.push("/dashboard");
        } else {
            setFormErrors(result.errors);
        }
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <h1>Register</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" onChange={handleChange} />
                            <Form.Text className="text-muted">
                                We don't want to know your email. Just pick a username.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Make sure you keep your password safe. We don't know your email, so we can't help you reset it.
                            </Form.Text>
                        </Form.Group>
                        {formErrors.length
                            ? <Alert key="danger" variant="danger" >
                                {formErrors.map(error => (
                                    <p key={error}>
                                        {error}
                                    </p>
                                ))}
                            </Alert>
                            : null
                        }
                        <Button variant="primary" type="submit" onSubmit={handleSubmit}>
                            Register
                        </Button>
                    </Form>
                </Col>
                <Col xs={1} md={2}></Col>
            </Row>
        </Container>
    )
}