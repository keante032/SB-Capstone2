import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, redirect } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../App";

export default function RecipeNew({addRecipe}) {
    const { currentUser } = useContext(UserContext);
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        publiclyShared: false,
        description: "",
        ingredients: "",
        directions: "",
        imageUrl: ""
    });
    const [formErrors, setFormErrors] = useState([]);

    async function handleSubmit(evt) {
        evt.preventDefault();
        let submitData = { ...formData };
        // change ingredients from multiline string to array of strings
        submitData.ingredients = submitData.ingredients.split("\n");
        // change directions from multiline string to array of strings
        submitData.directions = submitData.directions.split("\n");
        let result = await addRecipe(submitData);
        if (result.success) {
            navigate(`/recipes/${result.recipeId}`);
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
        return redirect("/user/login");
    }

    return (
        <Container>
            <Row>
                <Col xs={1} md={2}></Col>
                <Col xs={10} md={6}>
                    <h1>New Recipe</h1>
                    <br />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="My Favorite Recipe" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="publiclyShared">
                            <Form.Check type="checkbox" name="publiclyShared" label="Share publicly?" onChange={handleCheck} />
                        </Form.Group>
                        <Form.Group controlId="imageUrl">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" name="imageUrl" placeholder="https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" placeholder="Yeah, this one is my favorite." onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="ingredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control as="textarea" rows={6} name="ingredients" placeholder="2 slices bread" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="directions">
                            <Form.Label>Directions</Form.Label>
                            <Form.Control as="textarea" rows={6} name="directions" placeholder="Enter directions" onChange={handleChange} />
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
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col xs={1} md={2}></Col>
            </Row>
        </Container>
    )
}