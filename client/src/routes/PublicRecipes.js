import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import RecipeApi from "../helpers/api";

export default function PublicRecipes() {
    const [recipes, setRecipes] = useState([]);

    async function getPublicRecipes() {
        try {
            const results = await RecipeApi.getPublicRecipes();
            setRecipes(results);
            return { success: true };
        } catch (err) {
            console.error("Search failed", err);
            return { success: false, err };
        }
    }

    useEffect(() => { getPublicRecipes() }, []);

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <h1>Public Recipes</h1>
                    <br />
                    <Row xs={2} sm={3} className="g-4">
                        {recipes && recipes.map(recipe => (
                            <Col key={`col-${recipe.id}`}>
                                <Card key={recipe.id} className="h-100">
                                    <Card.Img variant="top" src={recipe.imageUrl} style={{height: "200px", "object-fit": "cover"}} />
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
        </Container>
    )
}