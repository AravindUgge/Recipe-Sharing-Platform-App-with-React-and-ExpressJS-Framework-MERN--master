import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./create.css";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!cookies.access_token) {
      alert("Recipe creation failed! Please log in first.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://mern-recipe-app1-server.onrender.com/recipes",
        { ...recipe },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Recipe Created Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create recipe. Please try again.");
    }
  };

  return (
    <div>
      <br/><br/>
      <div className="create-recipe">
        <h2>Create Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={recipe.name} onChange={handleChange} />
          
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={recipe.description} onChange={handleChange}></textarea>
          
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input key={index} type="text" value={ingredient} onChange={(event) => handleIngredientChange(event, index)} />
          ))}
          <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
          
          <label htmlFor="instructions">Instructions</label>
          <textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleChange}></textarea>
          
          <label htmlFor="imageUrl">Image URL</label>
          <input type="text" id="imageUrl" name="imageUrl" value={recipe.imageUrl} onChange={handleChange} />
          
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input type="number" id="cookingTime" name="cookingTime" value={recipe.cookingTime} onChange={handleChange} />
          
          <button type="submit">Create Recipe</button>
        </form>
      </div>
      <br/>
    </div>
  );
};
