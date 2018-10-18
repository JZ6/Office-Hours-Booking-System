# Scope.md

## Team Learning Goals
The general team goal is to create a responsive and feature-rich React client and AIOHTTP API service through test driven development. Otherwise, alongside the general goal, Asher wishes to learn Docker, devops, and deployment, Grant wishes to learn MongoDB, and Abed wishes to learn about deployment.

### Consensus
Consensus was arrived through pooling individual goals and relevant use cases then prioritizing use cases based on frequency.

## Use Cases
### Definitions:
Priority 1 is the highest, with 3 being omitted. Due to the slightly confusing terms provided in the handout, these are the agreed upon terms we will be using.

**(Meeting) Block** - A session defined by an instructor/TA, usually an hour or two long. Blocks contain slots. Blocks belong to one instructor/TA. Viewable by instructor/TA and students in the same course.

**Comment** - Details per block by instructor/TA on block.

**(Meeting) Slots** - Individual block slots which are equal in length and have no empty gaps. If setup time is required for e.g. presentations, just make the slots longer. Slots belong to one block.
 
**Note** - Details per slot by student, only viewable by student creator and instructor/TA.

##### Instructors and TAs can manage Blocks (create, edit, delete) and their comments and Slots (manually assigning students, viewing notes).
Priority: 1  
Details: Instructors/TAs will create blocks with the relevant course(s), start time, end time, and duration of slots. Number of slots will be calculated automatically and shown. Option to make block repeat weekly and set a maximum number of slots obtainable per student.

##### Students can sign up/unsign down for slots and manage notes (create, edit, delete) to them.
Priority: 1  
Details: Students should be able to easily find and view blocks (except blocks from other courses) and their available slots. Notes should be removed when slot is unsigned down for or when another student is assigned via instructor/TA.

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

## Handout
The individuals on your team probably have developed specific tastes over the last years as to what kind of code you like to build. The system as described is probably too big for a group to build (part time) in the style you would like to in the time you have. Hence, you will likely have to triage the use cases down to a subset in order to focus on the work that is the most valuable to you. We use the word valuable here in a very general way. (Perhaps because it's a technology you want to get to know more. Perhaps it's a technology you want to learn from scratch. Perhaps it's a technology that you think will improve your chances in the upcoming hunt for jobs)

Choose the subset in such a way that your team benefits from the project as much as possible. For instance, if you are a group that is keen on building a sophisticated user interface, you could pick a challenging part of the ticket assignment process and invest your effort in making an awesome drag and drop workflow. Naturally, the time spent on this may preclude building out UI for other use cases.  Do NOT implement exclusively CRUD web pages (these add little to the user experience nor teach you much) because there is not enough time to get creative. 
On the other hand, perhaps your team is not that interested in user interaction work but is very keen on learning how to build endpoints (REST or otherwise) efficiently and with minimal hand coding. Then, you could take on more use cases, implicitly leaving the UI very simple (for instance some of the UI could be triaged down to a invocations of a shell script. You probably would need to spend a lot of time studying one of the sophisticated REST frameworks, like django-rest.

In any case, in scope.md,  articulate  your team learning goals, the particular part of the application you have decided to focus your attention on, and which other parts this will force you to omit. (If the team learning goals represent less than consensus then perhaps you should discuss the issues with the instructor or your TA. If you are comfortable writing about how you came to consensus in the team scope.md that would be ideal.)
