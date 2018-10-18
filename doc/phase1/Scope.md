# Scope.md

## Team Learning Goals
The general team goal is to create a responsive and feature-rich React client and AIOHTTP API service through test driven development. Otherwise, alongside the general goal, Asher wishes to learn Docker, devops, and deployment, Grant wishes to learn MongoDB, and Abed wishes to learn about deployment.

### Consensus
Consensus was arrived through pooling individual goals and relevant use cases then prioritizing use cases based on frequency.

## Use Cases
### Definitions:
Priority 1 is the highest and explored the most, with 3 being omitted. Due to the slightly confusing terms provided in the handout, these are the agreed upon terms we will be using.

**(Meeting) Block** - A session defined by an instructor/TA, usually an hour or two long. Blocks contain slots. Blocks belong to one instructor/TA. Viewable by instructor/TA and students in the same course.

**Comment** - Details per block by instructor/TA on block.

**(Meeting) Slots** - Individual block slots which are equal in length and have no empty gaps. If setup time is required for e.g. presentations, just make the slots longer. Slots belong to one block.
 
**Note** - Details per slot by student, only viewable by student creator and instructor/TA.

##### Users should be able to easily find, view, and organize relevant blocks and their contents.
Priority: 1  

##### Instructors and TAs can manage Blocks (create, edit, delete) and their comments and Slots (manually assigning students, viewing notes).
Priority: 1  
Details: Instructors/TAs will create blocks with the relevant course(s), start time, end time, and duration of slots. Number of slots will be calculated automatically and shown. Option to make block repeat weekly and set a maximum number of slots obtainable per student.

##### Students can sign up/unsign down for slots and manage notes (create, edit, delete) to them.
Priority: 1  
Details: Notes should be removed when slot is unsigned down for or when another student is assigned via instructor/TA.

##### Users need to authenticate before being able to access resources.
Priority: 2  
Details: Authentication will be spoofed at first. Users will use their UtorID and a ‘password’ such as student numbers to identify themselves and receive appropriate views for a student/instructor/TA.

##### Instructors can manage courses (create, edit, delete) and add students/TAs to courses.
Priority: 2  
Details: We will start with a premade CSV containing sample students and classes.

##### Users can generate static links to specific states of blocks and its details.
Priority: 2  

##### Users can sync/export blocks/slots to Google Calendar™.
Priority: 2  
Details: Will require user authentication with google accounts. When exporting block, slots will be written into event comment rather than spamming multiple events.

##### Users can search for users, courses, and comments with fuzzy searching/autocomplete.
Priority: 2  

##### System can adapt to late/cancelling students.
Priority: 3  
Details: This would require students to be constantly checking notifications for system rescheduled times. It would be better if the slot was simply freed and students were notified and prompted to take that slot if convenient.

##### Users can receive and configure notification/reminders/student-will-be-late alerts.
Priority: 3  
Details: Functionality will be offloaded to Google Calendar when syncing is implemented.
