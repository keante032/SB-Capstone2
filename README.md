# Recipe App

The place for all your recipes. See it in action at https://sb-capstone2.vercel.app/

## Overview

This will be a web application which allows users to save recipes to their user account. Recipes can be input by the user or found among those shared publicly by other users.

## User Demographic

The intended user demographic of this app includes anyone looking to save their recipes in a way that is easy to access from a computer, tablet, or mobile device.

## Tech Stack and Data Source

This project will be built using React, Node.js, and PostgreSQL.

A main function of the app will be allowing users to input recipes themselves to save in the app. But the database will include a table of recipes I add myself to seed the publicly-shared recipes any user can access.

## Schema

See here: <https://docs.google.com/document/d/1I0FMmJSjetVe2UONbNeNAVdlJHznNBN_bidz8J_rTgs/edit?usp=sharing>

## Features

- Add your own recipes (saved privately, by default)
- Make your recipes available to other users of the app
- Search or browse for recipes shared by other users
- Make a copy of recipes shared by others, which becomes your own that you can modify

## Userflow

1. Landing Page - includes links to browse public recipes, login, or register
2. Public Recipes Page - shows list of public recipes
3. Recipe Detail - shows one recipe in detail with button to export/share, and, if logged in, buttons to save or copy; if recipe belongs to user, also shows button to make it private or public
4. User Dashboard - shows list of recipes that you have added or copied from public recipes
5. Recipe Search - keyword search among your own recipes and public recipes

## Sensitive information

Passwords will be encrypted using bcrypt. No email addresses will be collected, only usernames.

## Stretch Goals

- Recipe multiplier: easily get adjusted ingredient amounts for a double batch, half batch, etc.
- Unit converter: teaspoon, tablespoon, cup, etc. This should be easy to use while viewing a Recipe Detail.
- Export/share a recipe outside the app
- Suggest similar recipes
