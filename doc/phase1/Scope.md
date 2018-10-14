# Scope.md

## Goal
Triage the use cases to identify an area of focus for your team.

## Design Use Cases
### Learning Goals
Below are the skills and experience each member brings and their learning goals, from which focal use cases can be chosen from [the handout](https://docs.google.com/document/d/1pIAb_yHoHQygp31I1gV69eHaMwOaWXZtDMfVHg3q5eQ/edit#heading=h.3a98l0b27xf8).

---
#### Jay
**Skills**  
Javascript, Python, C, Java  

**Learning Goals**  
I would like to improve upon my current full stack web development knowledge, as well as expose myself to new technology that are going to be relevant now or in the near future for my profession. I would also like to gain experience in working with a team of different developers possessing varying skill sets. We can accomplish this by building upon each other’s strengths and supplementing our own weaknesses. Some specfic areas I have in mind include responsive design, frontend JS and program testing.

**Use Cases**  
Responsive Frontend for this web app, as well as conflict resolution such as unavailable slot selection.

---
#### Grant
**Skills**  
HTML, CSS, Schema design, Relational database querying

**Learning Goals**  
Concurrent data transcations, designing and managing a database using documents (MongoDB + Mongoose), API design and implementation in Javascript, limit access to actions based on account priviledge, implementing a form of reminders/notifications.  

**Use Cases**  
2. Create a new class (importing a classlist csv), 3 & 4 Create and delete meeting, 8 & 9 Creation and management of notes by TA/instructor and students, 12 - 14 Student creation and management of meeting slot, 17 Student creation and management of comments.

---
#### Benson
**Skills**  
HTML, CSS, Ruby on Rails, Django, MySQL (all cursory)  
**Learning Goals**  
Frontend (React, JS, asynchronous requests), UI design, end point design.  
**Use Cases**   
3. Create office hours interval, 5. Manage meetings in intervals, 6. Create, delete, edit meeting comments, 7. Create, delete, edit meeting notes, 8. Instructor Manage notes, 9. Instructor Manage Comments, 12. Choose meeting slot, 13. Cancel meeting slot, 14. Edit meeting slot, 17. Student Manage Comments.

---
#### Asher
**Skills**  
Python, MongoDB, SQL, API design, data modeling  
**Learning Goals**  
Improve DevOps skills (Docker, build tools, Kubernetes/deployment), learn a frontend JS library, practice some form of TDD  
**Use Cases**  

---
#### Pablo
**Skills**  
HTML, CSS, PHP  
**Learning Goals**  
Primary learning objective: Learn currently used tools to create highly interactive interfaces. I'd like to focus more on the high level general aspect of the design of the interface and its functionality, rather than visual tweaks or details. That's why learning React in depth and putting it into practice is a solid learning objective for me.
Secondary learning objectives: Get a wider view of how a full stack web app comes together and the different frameworks/technologies used in both front and back end.

**Use Cases**  
In order to create a highly interactive interface I want to abide by the following principles:
A) Include a lot of clickable options. Maybe even implement drag a drop functionality or drag to pan.
B) User friendly interface with coherent expandibles and sensible distribution of information.
C) Get away from simple read interfaces where all you have to do is scroll down a page and read text.
D) Engage the user as much as possible. I.e. Given them the option to input information, add comments, change settings...

I'll group the user cases I want to work on based on these 4 aspects:
A) 3,12,5: This involves the view of the calendar item. I would like to be able to implement scrolling to navigate the calendar or drag and drop to change a meeting interval's time
B) 2,3,4,5,6,7,8,9,12,13,14,17: This applies to all the use cases which purpose is displaying and interacting with information
C) 3,4,5,12,13,14: The process of managing events should be smooth, user friendly and should use a sensible set of expandables that make the process more intuitive and engaging.
D) 6,7,8,9,17: Provide an interactible way of managing notes/comments on events

---
#### Abed
**Skills**  
Ruby, Python, MongoDB, Docker, CI/CD  
**Learning Goals**  
Become more comfortable with a backend web framework, as well as React. Looking
to also work on infrastructure and and experiment with remote deployments and
scaling.  
**Use Cases**  
`TODO`, and the web app's online deployment.  

---
### Final Use Case Subset
TODO: Compile agreed list of use cases.
#### Prerequisite Use Cases
TODO: Include use cases required for the above to function.
#### Optional Use Cases
TODO: Include use cases that may be explored once everything central is done.

## Team Learning Goals
TODO: Identify overall team goals based on individual learning goals and selected use cases.

## Handout
The individuals on your team probably have developed specific tastes over the last years as to what kind of code you like to build. The system as described is probably too big for a group to build (part time) in the style you would like to in the time you have. Hence, you will likely have to triage the use cases down to a subset in order to focus on the work that is the most valuable to you. We use the word valuable here in a very general way. (Perhaps because it's a technology you want to get to know more. Perhaps it's a technology you want to learn from scratch. Perhaps it's a technology that you think will improve your chances in the upcoming hunt for jobs)

Choose the subset in such a way that your team benefits from the project as much as possible. For instance, if you are a group that is keen on building a sophisticated user interface, you could pick a challenging part of the ticket assignment process and invest your effort in making an awesome drag and drop workflow. Naturally, the time spent on this may preclude building out UI for other use cases.  Do NOT implement exclusively CRUD web pages (these add little to the user experience nor teach you much) because there is not enough time to get creative. 
On the other hand, perhaps your team is not that interested in user interaction work but is very keen on learning how to build endpoints (REST or otherwise) efficiently and with minimal hand coding. Then, you could take on more use cases, implicitly leaving the UI very simple (for instance some of the UI could be triaged down to a invocations of a shell script. You probably would need to spend a lot of time studying one of the sophisticated REST frameworks, like django-rest.

In any case, in scope.md,  articulate  your team learning goals, the particular part of the application you have decided to focus your attention on, and which other parts this will force you to omit. (If the team learning goals represent less than consensus then perhaps you should discuss the issues with the instructor or your TA. If you are comfortable writing about how you came to consensus in the team scope.md that would be ideal.)
