import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import RecipeApi from "../helpers/api";

export default function RecipeEdit({editRecipe, deleteRecipe}) {
    const { currentUser } = useContext(UserContext);
    const { id } = useParams();
    let navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        publiclyShared: true,
        description: "",
        ingredients: "",
        directions: "",
        imageUrl: ""
    });
    const [formErrors, setFormErrors] = useState([]);

    useEffect(() => {
        // fetch recipe data and set initial form data
        async function getRecipe(id) {
            const result = await RecipeApi.getRecipe(id);
            setRecipe(result);
            setFormData({
                name: result.name,
                publiclyShared: result.publiclyShared,
                description: result.description,
                ingredients: result.ingredients.join("\n"),
                directions: result.directions.join("\n"),
                imageUrl: result.imageUrl
            });
        };

        getRecipe(id);
    }, [id]);

    async function handleSubmit(evt) {
        evt.preventDefault();
        let submitData = { ...formData };
        // change ingredients from multiline string to array of strings
        submitData.ingredients = submitData.ingredients.split("\n");
        // change directions from multiline string to array of strings
        submitData.directions = submitData.directions.split("\n");
        let result = await editRecipe(id, submitData);
        if (result.success) {
            navigate(`/recipes/${id}`);
        } else {
            setFormErrors(result.err);
        }
    }

    async function handleDelete(evt) {
        evt.preventDefault();
        let result = await deleteRecipe(id);
        if (result.success) {
            navigate("/user/dashboard");
        } else {
            setFormErrors(result.err);
        }
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    function handleCheck(evt) {
        const { name, checked } = evt.target;
        setFormData(data => ({ ...data, [name]: checked }));
    }

    // If no user logged in, redirect to login
    if (!currentUser) {
        navigate("/user/login");
    }

    // If the current user is not the owner, redirect to recipe search
    if (recipe && recipe.ownerName && (recipe.ownerName !== currentUser.username)) navigate("/recipes/search");

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <h1>Edit Recipe</h1>
                    <br />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" onChange={handleChange} defaultValue={formData.name} />
                        </Form.Group>
                        <Form.Group controlId="publiclyShared">
                            <Form.Check type="checkbox" name="publiclyShared" label="Share publicly?" onChange={handleCheck} checked={formData.publiclyShared} />
                        </Form.Group>
                        <Form.Group controlId="imageUrl">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" name="imageUrl" onChange={handleChange} defaultValue={formData.imageUrl} />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" onChange={handleChange} defaultValue={formData.description} />
                        </Form.Group>
                        <Form.Group controlId="ingredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control as="textarea" rows={6} name="ingredients" onChange={handleChange} defaultValue={formData.ingredients} />
                        </Form.Group>
                        <Form.Group controlId="directions">
                            <Form.Label>Directions</Form.Label>
                            <Form.Control as="textarea" rows={6} name="directions" onChange={handleChange} defaultValue={formData.directions} />
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
                        <div class="d-flex justify-content-between">
                            <Button variant="primary" type="submit" onSubmit={handleSubmit}>
                                Save Changes
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete Recipe
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={1} md={2}></Col>
            </Row>
        </Container>
    )
}