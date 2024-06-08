# Project_Master_List
 
## Description
This project is a comprehensive project management system built using ReactJS for the front-end, Node.js with Express as the middleware, and MySQL as the backend database. The system allows users to manage projects, sections, subsections, and documents efficiently, providing functionalities such as adding, deleting, updating, and searching documents. The UI includes an accordion interface for better navigation and a custom progress bar for tracking the progress of documents.<br>
##Features
1. Project Management:
   - Add and delete projects.
   - Onclick event to open project details.
2. Section, Subsection, and Document Management:
   - UI with an accordion for sections, subsections, and documents.
   - CRUD operations for documents.
   - Custom progress bar that dynamically updates based on numerical input.
3. Search Functionality:
   - Search documents across different sections.
4. Document Details Table:
   - Display detailed information about documents, including start and end dates, status, priority, assigned personnel, and progress.
     <br>

##Prerequisites<br>
 * Frontend: ReactJS
 * Backend: Node.js, Express
 * Database: MySQL
 * Editor: Visual Studio Code
 * Database Management Tool: MySQL Workbench
<br>
##Database Schema<br>
##Projects Table

| Column |	Type |	Description |
|:--:|:---:|:---:|
|project_id	|int AI PK |	Auto-incremented primary key |
|project_name |	varchar(255) |	Name of the project |

<br>

##Sections Table<br>

| Column |	Type |	Description |
|:--:|:---:|:---:|
|section_id	| int AI PK |	Auto-incremented primary key |
|:--:|:---:|:---:|
section_name |	varchar(255) |	Name of the section|
|:--:|:---:|:---:|
| project_id	| int |	Foreign key referencing 'projects'|
|:--:|:---:|:---:|
<br>

##Subsections Table<br>

| Column |	Type |	Description |
|:--:|:---:|:---:|
|subsection_id |	int AI PK	| Auto-incremented primary key |
|:--:|:---:|:---:|
|subsection_name	| varchar(255)	| Name of the subsection |
|:--:|:---:|:---:|
| project_id	| int |	Foreign key referencing 'projects'|
|:--:|:---:|:---:|
|section_id |	int	| Foreign key referencing 'sections'|
|:--:|:---:|:---:|
<br>
##Subsections Table<br>

| Column |	Type |	Description |
|:--:|:---:|:---:|
|document_id	| int AI PK |	Auto-incremented primary key |
|:--:|:---:|:---:|
|document_name	| varchar(255) |	Name of the document |
|:--:|:---:|:---:|
|subsection_id |	int	| Foreign key | referencing 'subsections' |
|:--:|:---:|:---:|
|serial_number |	varchar(255) |	Serial number of the 'document' |
|:--:|:---:|:---:|
|section_id	| int	| Foreign key referencing 'sections' |
|:--:|:---:|:---:|
|project_id	| int	| Foreign key referencing 'projects' |
|:--:|:---:|:---:|
| start_date |	date	| Start date of the 'document' |
|:--:|:---:|:---:|
|end_date |	date	|End date of the document |
|:--:|:---:|:---:|
| status	|varchar(255) |	Status of the document|
|:--:|:---:|:---:|
| priority |	varchar(255) |	Priority of the document|
|:--:|:---:|:---:|
|assigned_to	| varchar(255)	| Person assigned to the 'document'|
|:--:|:---:|:---:|
|progress |	int |	Progress of the document |
|:--:|:---:|:---:|
<br>
##Installation<br>
##Step 1: Clone the Repository<br>
git clone https://github.com/your-username/project-management-system.git<br>

##Step 2: Navigate to the Project Directory<br>
cd project-management-system<br>

##Step 3: Install Dependencies<br>
 - Frontend<br>
Navigate to the client directory and install the dependencies:<br>
cd frontend<br>
npm install<br>

 - Backend
Navigate to the server directory and install the dependencies:
cd backend<br>
npm install<br>

##Step 4: Configure the Database
 - Create a new database in MySQL Workbench.
 - Run the provided SQL scripts to set up the tables and schema.
##Step 5: Configure Environment Variables
 - Add your MySQL database credentials to the db.js file<br>
  DB_HOST=localhost<br>
  DB_USER=root<br>
  DB_PASS=yourpassword<br>
  DB_NAME=project_management_system<br>

##Step 6: Start the Backend Server
- npm app.js

##Step 7: Start the Frontend Server
- Navigate back to the client directory and start the React development server:<br>
cd ../frontend<br>
npm start<br>

 ##Usage
 - Add a Project: Use the UI to add a new project.
 - View Project Details: Click on a project to view its details.
 - Manage Sections and Subsections: Use the accordion UI to add, update, or delete sections and subsections.
 - CRUD Operations for Documents: Add, view, update, and delete documents within sections and subsections.
 - Search Documents: Use the search functionality to find documents across different sections.
 - Dynamic Progress Bar: Update document progress and see the progress bar update in real-time.

##Technologies Used
- Frontend: React.js
- Backend: Node.js with Express
- Database: MySQL
- Editor: Visual Studio Code
- Database Tool: MySQL Workbench





