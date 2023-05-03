import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import RecipeApi from "../helpers/api";

export default function Dashboard() {
    let navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [recipes, setRecipes] = useState([]);

    async function getMyRecipes() {
        try {
            const results = await RecipeApi.getMyRecipes();
            setRecipes(results);
            return { success: true };
        } catch (err) {
            console.error("Search failed", err);
            return { success: false, err };
        }
    }

    useEffect(() => { getMyRecipes() }, [currentUser]);

    // If no user logged in, redirect to login
    if (!currentUser) navigate("/user/login");

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <h1>Dashboard</h1>
                    {recipes.length === 0 && (
                        <p>You haven't added any recipes yet!</p>
                    )}
                    <br />
                    <Row xs={2} sm={3} className="g-4">
                        {recipes && recipes.map(recipe => (
                            <Col>
                                <Card key={recipe.id} className="h-100">
                                    <Card.Img variant="top" src={recipe.imageUrl} />
                                    <Card.Body>
                                        <Card.Title>{recipe.name}</Card.Title>
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
    );
}