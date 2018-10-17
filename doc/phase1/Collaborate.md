# Collaborate.md

## Goal
Establish how your team is going to work together. How you will manage your sources. How you will contribute to your sources. When you will meet, how you will communicate, who will scribe, how you will maintain your backlog, etc.

## The Team
Below are the strengths, weaknesses, and experience each member brings to the team.
### [Grant](https://github.com/wonggran)
My strengths include designing database models of objects and their relations between one another, roleplaying interactions between the user and an application, writing modular code that is testable in single units, simulating user needs to guide user interface design, forming a high level view of relations between application modules, listening with curiousity and a willingness to learn, and prioritizing individual collaboration and self development through understanding and compromise. My weaknesses include a lack of knowledge on current web application development technologies and web application design, inexperience with conversing using technical terminology preventing me from properly expressing a concept, timidness when team conflicts arise, and an unwavering belief of always being able to do better as an individual and as a team that blinds me in seeing my own and my team's strengths. My experience includes 1 year of C# and ASP.Net MVC web application development mainly carrying out simple front-end upgrades and fixes.

### [Asher](https://github.com/asher-dev)
* Worked as a developer on a SaaS project and gained experience with Python/Flask for API development, MongoDB and MySQL, and various AWS services (including S3, Batch, Lambda, RDS Aurora).
* Primary strengths are agile methodology, version control maintenance, data modeling, and software design. Also able to help with general programming in python and ES6, API design/implementation, unit testing, database queries and schemas.
* I have a tendency to overscope, and I often work slowly because of too much attention to detail. I have very little prior experience with DevOps and task automation.

### [Pablo](https://github.com/pablolluchr)
I've had some experience with front-end development at projects of my own. Despite being very interested in web design I have never partaken in a university project related to it. I'm most experienced in java. I'm not very experience with version control and team collaboration software. Thus, I'm not only hoping to learn technical skills but get used to working with a team on a formal level.

### [Benson](https://github.com/bensonchan)
My biggest strength is that I offer my full schedule to this course. Despite already having two courses worth of web development, it was too cursory to claim proficiency. I have a great interest in UI design and user experience, having spent excessive time discussing (complaining) about it to my friends. My weaknesses are a general lack of experience in web development and a bad sense of humour.

### [Jay](https://github.com/JZ6)
I have previous full stack web development knowledge working as summer intern, and I am a fast learner who is willing to expose myself to new technology that are going to be relevant now or in the near future for my profession. I am more interested and focused on frontend (UI, Javascript) development, and I strive to improve myself everyday!

### [Abed](https://github.com/abedef)
My personal focuses include backend design and systems programming. I also
spent my PEY working closely with many CI/CD and IAAS systems and have become
familiar with a few related industry-standard tools. I will try to bring this
knowledge to the team to make our workflow, testing and deployment as
effortless as possible. My web stack knowledge is weak, but not non-existent.

## Team strengths
The biggest strength of the team is that people's skills and interests are very diverse. 
In regards to web development, some members of the team have experience with full stack web app development (as interns, work experience and independently) and others have little to some experience. Some other members are also experienced in back-end programming such as database design. Others gather experience in testing, deployment and the knowledge of industry-standard tools.
Regarding member's interests, some of us are willing to know more about front-end while others want to deepen their knowledge on back-end.
Overall, despite not everyone being proficient at the tasks/technologies needed to accomplish the project, everyone is willing to learn and get to explore new technologies.


## Communication
Slack will be the main discussion board, with Facebook Messenger for immediate questions or alerts. Github Projects and issues will be used for kanban and issue tracking.

### Meetings
Scrum style meetings will occur after lecture and during tutorial (Monday, Wednesday, Friday) in either the same room or anything available. Each meeting will feature a standup section for *at most* 20 minutes, after which a freeform discussion may take place. Attendance can be substituted with a report and/or messages if necessary.

#### Meeting 1 (Friday, October 5, 2018) [4PM - 5PM]:
* Took place during CSC302 tutorial in room BA2175.
* Team members present: Grant, Asher, Benson, Pablo, Jay.
* Notes: 
  * Discussed preliminary elements of the project, such as basic UI design, project infrastructure, and project language/framework. 
  * We also decided to compile the strengths and learning goals of each team member on [Scope.md](Scope.md).
  
#### Meeting 2 (Wednesday, October 10, 2018) [5PM - 6PM]:
* Took place in BA3200.
* Team members present: Grant, Asher, Benson, Pablo, Jay, Abed.
* Notes:
  * Discussed phase 1 documentation and how to divvy it up.
  * Discussed use cases related our learning goals and their requirements.
  * Discussed options for project architecture/technology relevant to our learning goals and use cases.
  
#### Meeting 3 (Friday, October 12, 2018) [4PM - 5:30PM]:
* Took place during CSC302 tutorial in room BA2175.
* Team members present: Grant, Asher, Benson, Pablo, Jay, Abed.
* Notes:
  * Further discussion of project architecture and details. Details will be included in phase 1 documentation.
  * Further discussion on phase 1 documentation based on the above.

#### Meeting 4 (Monday, October 15, 2018) [5PM - 6PM]:
* Took place outside BA2210.
* Team members present: Grant, Asher, Benson, Pablo, Jay.
* Notes:
  * Discussed final details on documentation.
  * Discussed API design.

## Project Methodology
We will be using Scrum with Kanban via Github's Projects feature. Due to the experimental nature of the project, the numerous unforeseen challenges should be best tackled with a flexible approach. Scrum allows rapid responses to change and will keep the team on the same page with regular meetings.
* Sprints will be weekly, with relatively narrow scope to account for the short cycle
* Scrum/stand-up meetings will occur on M/W/F during or immediately following scheduled class time. Contributors who are unable to attend in person will report on Slack (progress since last meeting, plans before next meeting, any blockers).
* Friday tutorial times will be used for retrospective and sprint planning
  * Sprint planning: select a sprint scope from backlog based on project roadmap, estimate tickets, rank by priority, and set sprint goals based on projected sprint velocity.
  * Retrospective: in the last sprint, what went well and didn't go well, and are there any action items to improve workflow or more effectively achieve goals.

### Git Workflow
We will follow a pared-down variation of the GitFlow workflow, optimized for continuous deployment to a live test environment. In this variation, the top level (`master`) and release branches are truncated from the model, so our `master` will be equivalent to GitFlow's `develop` branch, and will be under continuous deployment to a live test environment. All branches off master will be working branches at the developers' discretion. This may include feature branches, or aggregate branches to tie features together before opening a pull request to master. All feature branches and commit messages should contain the feature/story's associated issue number. Feature requirements, test cases, and code will be reviewed by two other members.

### Member Workload
Team members will not be restricted to specific domains. Instead, we will prioritize features that suit our learning goals while ensuring that all core features are finished. With that said, each service (as well as DevOps) will have primary contributors.
* API Service: Abed, Grant, Asher
* Web client: Pablo, Benson, Jay
* Database: Grant, Asher
* DevOps: Asher, Abed

## Handout
You will create a plan for how your team will collaborate, review code, etc.
* Goal: Provide insight into your collaborative work as a team
* Make sure to describe the team’s competencies and constraints. Ex: Experience, strengths, skills, schedule conflicts and/or other relevant information about individual team members.
* Describe your meetings so far:
  * When, where (online, phone, physical location) of meetings
  * Who was there?
  * Rough meeting minutes/notes.
* Shared documents:
  * google doc? Github md? Links to google docs from markdowns?
  * Team Wiki?
* Given your experience meeting so far.. consider the logistics of your future meetings
  * When and where will you meet? 
* Agile/Scrum/Kanban?
  * There are excellent tools available to support your process, many offer free educational licenses for classroom use.
    * JIRA for scrum and/or kanban. (Our class can obtain a free JIRA classroom instance for you to use.)
    * Trello
    * Asana
  * If you decide to follow the scrum process:
    * What might you prime your backlog with?
      * Hint: figuring out how to set up TDD, CI..
    * How will you size your tasks? (story points? hours?)
    * Regular sprints? How many?
    * Who’s the scrummaster?
    * Who pretends to be the product owner?
    * How will you do regular standup meetings with your various conflicting schedules? Can online meetings help somehow?
* Create a strategy for how to divide work between individuals:
  * How will web client, endpoints, be divided across the team?
  * Which roles will individuals take on?
  * Repo man? (Inside joke. See http://www.imdb.com/title/tt0087995/) 
  * TDD person?
  * CI person?
  * How and where will you store your shared documents?
* github/git How will you collaborate? When will individuals be allowed to push individual commits themselves? When is a PR necessary?
* Messaging: what will you use as a message board? Slack? HipChat? 
* How will you track your progress. Burndown chart? in story points?

