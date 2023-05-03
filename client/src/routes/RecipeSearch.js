import { Container, Row, Col, Button, Form, Alert, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import RecipeApi from "../helpers/api";

export default function RecipeSearch() {
    let navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [recipes, setRecipes] = useState([]);

    async function findRecipes(data) {
        try {
            const results = await RecipeApi.findRecipes(data);
            setRecipes(results);
            return { success: true };
        } catch (err) {
            console.error("Search failed", err);
            return { success: false, err };
        }
    };

    const [formData, setFormData] = useState({ search: "" });
    const [formErrors, setFormErrors] = useState([]);

    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await findRecipes(formData.search);
        if (!result.success) setFormErrors(result.err);
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    // If no user logged in, redirect to login
    if (!currentUser) navigate("/user/login");

    function renderRecipes() {
        return (
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <Row xs={2} sm={3} className="g-4">
                        {recipes.map(recipe => (
                            <Col>
                                <Card key={recipe.id} className="h-100">
                                    <Card.Img variant="top" src={recipe.image} />
                                    <Card.Body>
                                        <Card.Title>{recipe.name}</Card.Title>
                                        <Card.Text>by {recipe.ownerName}</Card.Text>
                                        <Card.Text>{recipe.description}</Card.Text>
                                    </Card.Body>
                                    <LinkContainer to={`/recipes/${recipe.id}`}>
                                        <Button variant="primary">View Recipe</Button>
                                    </LinkContainer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xs={1} md={2}></Col>
            </Row>
        )
    };

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <h1>Recipe Search</h1>
                    <br />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="search">
                            <Form.Control type="search" name="search" placeholder="Search for a recipe" onChange={handleChange} />
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
                        <br />
                        <Button variant="primary" type="submit" onSubmit={handleSubmit}>
                            Search
                        </Button>
                    </Form>
                </Col>
                <Col xs={1} md={2}></Col>
            </Row>
            {recipes && recipes.length > 0 && renderRecipes()}
        </Container>
    )
}