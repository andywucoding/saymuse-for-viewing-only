# Saymuse - ONLY FOR VIEWING

This project is a JavaScript-based solution designed to enhance museum tours with a fun and interactive treasure hunt experience. Users can explore exhibitions, complete challenges, and earn badges while learning about museum exhibits. The project uses OCR (Optical Character Recognition) to identify and verify exhibit labels.

## Project Overview

The goal is to create an MVP for a treasure hunt app that allows users to:
- Take photos of exhibit labels with their device camera.
- Verify the labels using OCR and a similarity check.
- Complete a list of challenges and receive badges when all tasks are completed.

## MVP To-Do List

1. **Generate List and Similarity Check from Image**
   - [x] Implement OCR system to extract text from images.
   - [x] Develop a similarity check function to compare extracted text with pre-stored labels.
   - [x] Define a threshold (e.g., 90%) to determine if a label is correctly matched.
   - [x] Store labels in a JSON format for comparison.

2. **Capture Image and Verify Items**
   - [x] Integrate device camera functionality to capture photos.
   - [x] Perform OCR on captured images and run similarity checks.
   - [x] Create logic to mark list items as checked when they match.
   - [x] Display a message and award a congratulation badge when all items on the list are verified.

3. **Main Page with Navigation**
   - [x] Design the main landing page with basic information about the app.
   - [x] Add a navigation link to direct users to the treasure hunt page.
   - [ ] Include options for user login (Google, Apple ID, or basic login system). --- won't do, but will integrate with Auth0

4. **Full List of Labels**
   - [ ] Create a page that displays a full list of labels for users. --- won't do, but will integrate with Auth0 and user info
   - [x] Ensure the list is easily accessible for reference during the treasure hunt.
   - [x] Allow for updates or changes to the label list via a JSON file.
   