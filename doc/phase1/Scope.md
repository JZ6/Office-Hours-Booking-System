# Scope.md

## Team Learning Goals
The general team goal is to create a responsive and feature-rich React client and AIOHTTP API service through test driven development. Otherwise, alongside the general goal, Asher wishes to learn Docker, devops, and deployment, Grant wishes to learn MongoDB, and Abed wishes to learn about deployment.

### Consensus
Consensus was arrived through pooling individual goals and their relevant use cases then prioritizing use cases based on frequency.

## Use Cases
### Definitions:
Priority 1 is the highest and explored the most, with 3 being omitted. Due to the slightly confusing terms provided in the handout, these are the agreed upon terms we will be using.

**(Meeting) Block** - A session defined by an instructor/TA, usually an hour or two long. Blocks contain slots. Blocks belong to one instructor/TA. Viewable by instructor/TA and students in the same course.

**Comments** - Details per block by instructor/TA on block.

**(Meeting) Slots** - Slots for meetings with one student. They are equal in length and contiguous within their block. If setup time is required for e.g. presentations, just make the slots longer. If a specific student needs more time, multiple consecutive slots may be assigned. Slots belong to one block.
 
**Notes** - Details per slot by student, only viewable by student creator and instructor/TA.

##### Users should be able to easily find, view, and organize relevant blocks and their contents.
Priority: 1  

##### Instructors and TAs can manage Blocks (create, edit, delete) and their Comments and Slots (manually assigning students, viewing/editing notes).
Priority: 1  
Details: Instructors/TAs can create blocks with relevant course(s), start time, end time, and duration of slots. Number of slots will be calculated automatically and shown. Option to make the block repeat weekly and set a maximum number of slots obtainable per student.

##### Students can register/unregister for slots and manage notes (create, edit, delete) to them.
Priority: 1  
Details: Notes should be removed when slot is freed or when another student is assigned via instructor/TA.

##### Instructors can manage courses (create, edit, delete) and add students/TAs to courses.
Priority: 2  
Details: We will start with a premade CSV containing sample students and classes.

##### Users can generate static links to specific states of blocks and their details.
Priority: 2  

##### Users can sync/export blocks/slots to Google Calendar.
Priority: 2  
Details: Users will not be required to use this feature. Will require user authentication with google accounts. When exporting block, slots will be written into event comment rather than flooding the calendar with events.

##### Users can search for users, courses, and comments with fuzzy searching/autocomplete.
Priority: 2  

##### Users need to authenticate before being able to access resources.
Priority: 2.5  
Details: Authentication will be spoofed at first. Users will use their UtorID and a ‘password’ (i.e. student number) to identify themselves and receive appropriate resources. Shibboleth authentication will be unlikely, but a custom account system is possible.

##### System can adapt to late/cancelling students.
Priority: 3  
Details: This would require students to be constantly checking notifications for system rescheduled times. It would be better if the slot was simply freed and students can claim it at their own discretion.

##### Users can receive and configure notifications/reminders.
Priority: 3  
Details: Functionality will be offloaded to Google Calendar, which would be far more convenient for the user.
