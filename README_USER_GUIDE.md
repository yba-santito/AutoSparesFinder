# JJ Auto Spares - User Guide

Welcome to JJ Auto Spares! This guide will help you navigate and use the application for finding and managing automotive spare parts.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Customer Features](#customer-features)
3. [Business Portal Login](#business-portal-login)
4. [Admin Portal Features](#admin-portal-features)
5. [Troubleshooting](#troubleshooting)
6. [Contact Information](#contact-information)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled in browser

### Accessing the Application

**Local Development:**
1. Backend runs on: `http://localhost:3000`
2. Frontend runs on: `http://localhost:5173`
3. Navigate to `http://localhost:5173` in your browser

**Production:**
- Application will be hosted at your production domain

---

## Customer Features

### Finding Auto Spares

1. **Navigate to Products Page**
   - Click "Products" in the navigation menu
   - Or go to the homepage and select "Auto Spares"

2. **Filter by Vehicle**
   - **Vehicle Make**: Select the manufacturer (Toyota, Honda, Ford, BMW, Mercedes, etc.)
   - **Vehicle Model**: Select your vehicle model
   - **Vehicle Year**: Select your vehicle year

3. **View Available Parts**
   - Once all three filters are selected, the system displays compatible parts
   - Shows: Brand, Part Number, Type, Price, and Stock Quantity
   - Parts are automatically fetched from the database

4. **Part Information**
   Each part card displays:
   - **Brand**: Manufacturer (e.g., Mobil, Bosch)
   - **Part Number**: Product identifier
   - **Type**: Part category (Engine Oil, Air Filter, Brake Pad, etc.)
   - **Price**: USD price
   - **Stock Status**: In stock quantity or "Out of stock"
   - **Action Button**: "Quick View" if in stock, "Out of Stock" if unavailable

### Browse All Parts
- Visit the Products page without selecting filters to see all available parts
- Useful for browsing inventory or finding parts for vehicles not in your list

### Additional Pages
- **Home/Welcome**: Introduction to JJ Auto Spares
- **Services**: Information about available services
- **Contact**: Business contact information and contact form

---

## Business Portal Login

### Test Credentials

Three test user accounts are available for testing:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| manager | manager123 | Manager |
| staff | staff123 | Staff |

### How to Login

1. **Navigate to Login Page**
   - Click "Business Portal" in the top navigation menu
   - Or go directly to `/login`

2. **Enter Credentials**
   - **Username**: Enter your assigned username
   - **Password**: Enter your password

3. **Click "Login"**
   - On success: Redirected to Admin Portal Dashboard
   - On failure: Error message displayed with instructions

4. **Session Management**
   - Your login session lasts 24 hours
   - To logout: Click "Logout" button in the Admin Portal
   - For security: Logout when finished, especially on shared computers

### Security Notes
- Passwords are encrypted and securely stored
- Your session token is stored locally and expires after 24 hours
- Never share your login credentials
- Clear browser cache if experiencing login issues

---

## Admin Portal Features

### Dashboard Tab

**Overview of Your Account**
- Displays logged-in username
- Shows your assigned role (Admin, Manager, Staff)
- Quick reference for active user

### Search Tab

**Search the Parts Inventory**

1. **Enter Search Query**
   - Type at least 2 characters
   - Search filters by:
     - SKU (Stock Keeping Unit)
     - Brand name
     - Part number

2. **View Results**
   - Results limited to 50 matches
   - Each result card shows:
     - SKU
     - Brand
     - Part Number
     - Part Type
     - Price
     - Stock Quantity
     - **Edit Button**: Click to load part into the update form

3. **Edit a Part**
   - Click "Edit" on any search result
   - Part information loads into the Update form
   - Switch to "Update" tab to modify and save

### Add Tab

**Add New Parts to Inventory**

1. **Fill in Part Information**
   - **SKU*** (Required, Unique): Stock Keeping Unit code
     - Example: `OIL-001`, `FILTER-005`
     - Must not already exist in database
   
   - **Brand*** (Required): Manufacturer name
     - Example: `Mobil`, `Bosch`, `Shell`
   
   - **Part Number*** (Required): Product identifier
     - Example: `MOB-5W30`, `BOSCH-ICON`
   
   - **Part Type*** (Required): Select from dropdown
     - Engine Oil, Air Filter, Brake Pad, Spark Plug, Battery, etc.
   
   - **Price*** (Required): USD price
     - Example: `45.99`
     - Must be a positive number
   
   - **Stock Quantity*** (Required): Number of units in stock
     - Example: `50`
     - Must be zero or positive number

2. **Add the Part**
   - Click "Add Part" button
   - Success message: "✓ Part added successfully!"
   - Form clears for next entry
   - Error message: Shows issue (e.g., "SKU already exists")

3. **Tips**
   - Use consistent SKU format for easy searching
   - Verify part type before adding
   - Double-check price and quantity
   - Stock quantity can be 0 for out-of-stock items

### Update Tab

**Modify Existing Parts**

1. **Load a Part to Edit**
   - Use the Search tab to find the part
   - Click "Edit" button on the search result
   - Part information loads into the Update form

2. **Modify Part Information**
   - **SKU**: Display only (cannot change)
   - **Brand**: Edit as needed
   - **Part Number**: Edit as needed
   - **Price**: Edit as needed (must be positive)
   - **Stock Quantity**: Edit as needed (must be zero or positive)

3. **Save Changes**
   - Click "Update Part" button
   - Success message: "✓ Part updated successfully!"
   - Part is immediately updated in the database

4. **Cancel Edit**
   - Click "Cancel" button to return to Add form
   - Clears all fields

5. **Tips**
   - Cannot change SKU (it's the unique identifier)
   - Update stock quantity frequently
   - Verify changes before clicking Update
   - Check for typos in brand and part number

---

## Common Tasks

### Task: Find Parts for a Specific Vehicle
1. Go to Products page
2. Select Make: "Toyota"
3. Select Model: "Corolla"
4. Select Year: "2020"
5. View all compatible parts

### Task: Add a New Part to Inventory
1. Login to Business Portal
2. Go to Admin Portal
3. Click "Add" tab
4. Fill in all required fields
5. Click "Add Part"
6. Confirm success message

### Task: Update Stock Quantity
1. Login to Business Portal
2. Go to Admin Portal
3. Click "Search" tab
4. Find part by SKU or brand
5. Click "Edit" on result
6. Switch to "Update" tab
7. Change Stock Quantity
8. Click "Update Part"

### Task: Search for a Specific Part
1. Login to Business Portal
2. Go to Admin Portal
3. Click "Search" tab
4. Type part name, brand, or SKU
5. View matching results
6. Click "Edit" to modify if needed

### Task: Logout
1. Click "Logout" button in Admin Portal (top right)
2. Redirected to home page
3. Session cleared from local storage

---

## Troubleshooting

### I Can't Login
**Problem**: "Invalid credentials" message
- **Solution 1**: Verify username and password spelling (case-sensitive)
- **Solution 2**: Check Caps Lock is off
- **Solution 3**: Clear browser cache and cookies, try again
- **Solution 4**: Contact administrator for credential reset

**Problem**: Login page not loading
- **Solution 1**: Check internet connection
- **Solution 2**: Ensure backend server is running (port 3000)
- **Solution 3**: Refresh browser (Ctrl+R or Cmd+R)
- **Solution 4**: Try different browser

### Products Not Loading
**Problem**: "Error Loading Parts" message
- **Solution 1**: Refresh the page
- **Solution 2**: Check browser console (F12) for error details
- **Solution 3**: Ensure all three filters (Make, Model, Year) are selected
- **Solution 4**: Verify backend server is running

**Problem**: No parts shown after selecting vehicle
- **Solution 1**: Confirm vehicle combination exists in database
- **Solution 2**: Check if parts have been added for that vehicle
- **Solution 3**: Try a different vehicle combination
- **Solution 4**: Contact administrator

### Can't Add Parts
**Problem**: "SKU already exists" error
- **Solution**: Use a different SKU code (must be unique)

**Problem**: "All fields required" error
- **Solution**: Ensure all fields are filled in, especially Part Type dropdown

**Problem**: Form won't submit
- **Solution 1**: Verify price is a positive number
- **Solution 2**: Verify stock quantity is zero or positive number
- **Solution 3**: Check for required fields (marked with *)

### Session Expired
**Problem**: After 24 hours, must login again
- **Normal behavior**: Sessions expire for security
- **Solution**: Login again with your credentials

### Performance Issues
**Problem**: Application running slowly
- **Solution 1**: Close unnecessary browser tabs
- **Solution 2**: Clear browser cache
- **Solution 3**: Restart browser
- **Solution 4**: Check internet connection speed

---

## Tips for Best Experience

### For Customers
✓ Use vehicle make, model, and year for accurate part matching
✓ Check stock availability before purchasing
✓ Note the part number for ordering
✓ Contact business for pricing on bulk orders

### For Business Users
✓ Keep stock quantities updated daily
✓ Use consistent SKU format (e.g., TYPE-###)
✓ Verify part information before adding
✓ Logout after finishing admin work
✓ Use Search feature to avoid duplicate entries
✓ Contact administrator for access issues

---

## System Information

### Available Vehicle Catalog
- **Makes**: Toyota, Honda, Ford, BMW, Mercedes
- **Models**: Corolla, Civic, Mustang, and others
- **Years**: 2018-2024 (varies by model)

### Part Types
- Engine Oil
- Air Filter
- Brake Pad
- Spark Plug
- Battery
- Transmission Fluid
- Coolant
- Windshield Wiper
- Brake Fluid
- Fuel Filter

### Supported Currencies
- USD ($)

---

## Contact Information

For support or questions about JJ Auto Spares:

**Contact Person**: Mr Jason Naicker

**Phone**: [084 528 8308](tel:0845288308)

**Email**: [jjsautomotivesupplies@gmail.com](mailto:jjsautomotivesupplies@gmail.com)

**Address**: 
103 Tramway St, Turffontein
Johannesburg South, 2140

---

## Frequently Asked Questions (FAQ)

**Q: How long does my login session last?**
A: 24 hours. After that, you'll need to login again.

**Q: Can I change my password?**
A: Contact the administrator to request a password change.

**Q: What if I see a part I'm looking for but it's out of stock?**
A: Note the part number and contact JJ Auto Spares directly to check availability or request restocking.

**Q: Can I order parts through the website?**
A: Currently, this is a catalog browsing and management system. Contact the business directly to place orders.

**Q: How often is the inventory updated?**
A: Inventory is updated in real-time by authorized staff through the admin portal.

**Q: What if my vehicle year is not in the dropdown?**
A: Contact the administrator to add new years to the vehicle catalog.

**Q: Can multiple people login at the same time?**
A: Yes, each user has their own session. Logout when finished to maintain security.

**Q: What browsers are supported?**
A: Chrome, Firefox, Safari, Edge (all modern versions). Internet Explorer is not supported.

---

## Version History

- **v1.0.0** (Current): MVP Release
  - Customer product browsing by vehicle
  - Business admin portal with CRUD operations
  - JWT authentication
  - Secure password hashing
  - Database-driven vehicle catalog

---

**Last Updated**: June 2026  
**For Support**: Contact JJ Auto Spares
