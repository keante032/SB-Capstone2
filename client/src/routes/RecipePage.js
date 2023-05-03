import { Container, Row, Col, Button, Stack } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import RecipeApi from "../helpers/api";

export default function RecipePage({copyRecipe}) {
    let navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const { id } = useParams();
    const [ recipe, setRecipe ] = useState({ publiclyShared: true, ingredients: [], directions: [] });

    useEffect(() => {
        async function getRecipe(id) {
            try {
                const result = await RecipeApi.getRecipe(id);
                setRecipe(result);
                return { success: true };
            } catch (err) {
                console.error("Search failed", err);
                return { success: false, err };
            }
        }
        getRecipe(id);
    }, [id]);

    // If the recipe is private and the current user is not the owner, redirect to recipe search
    if (!recipe.publiclyShared && currentUser?.username !== recipe.ownerName) navigate("/recipes/search");

    async function handleCopy(evt) {
        evt.preventDefault();
        let result = await copyRecipe({
            name: recipe.name,
            publiclyShared: false,
            description: recipe.description,
            ingredients: recipe.ingredients,
            directions: recipe.directions
        });
        if (result.success) {
            navigate("/user/dashboard");
        }
    }

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <Stack direction="horizontal">
                        <div>
                            <h1>{recipe.name}</h1>
                            <h4>by {recipe.ownerName}</h4>
                            <p>{recipe.description}</p>
                        </div>
                        <div className="ms-auto">
                            <img src={recipe.imageUrl} alt={recipe.name} style={{width: "200px", height: "200px", "object-fit": "cover"}} />
                        </div>
                    </Stack>
                    {currentUser && currentUser.username === recipe.ownerName && (
                        <LinkContainer to={`/recipes/edit/${id}`}>
                            <Button variant="primary">Edit Recipe</Button>
                        </LinkContainer>
                    )}
                    {currentUser && currentUser.username !== recipe.ownerName && (
                        <Button variant="secondary" onClick={handleCopy}>
                            Copy Recipe
                        </Button>
                    )}
                    <h3>Ingredients</h3>
                    <ul>
                        {recipe.ingredients.map((ing, i) => (
                            <li key={`ing-${i}`}>{ing}</li>
                        ))}
                    </ul>
                    <h3>Directions</h3>
                    <ol>
                        {recipe.directions.map((dir, i) => (
                            <li key={`dir-${i}`}>{dir}</li>
                        ))}
                    </ol>
                </Col>
                <Col xs={1} md={2}></Col>
            </Row>
        </Container>
    )
}