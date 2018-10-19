# Collaborate.md

## Individual Skills and Availability
### [Grant](https://github.com/wonggran)
Proficiencies: Python, HTML, CSS, previous work experience in user interface development.  
Availability: 8 - 10 hours/week in weeks with normal workload, heavy workload from other courses during the week of Oct. 29 - Nov. 2

### [Asher](https://github.com/asher-dev)
* Worked as a developer on a SaaS project and gained experience with Python/Flask for API development, MongoDB and MySQL, and various AWS services (including S3, Batch, Lambda, RDS Aurora).
* Primary strengths are agile methodology, version control maintenance, data modeling, and software design. Also able to help with general programming in python and ES6, API design/implementation, unit testing, database queries and schemas.
* I have a tendency to overscope, and I often work slowly because of too much attention to detail. I have very little prior experience with DevOps and task automation.

### [Pablo](https://github.com/pablolluchr)
*Proficiencies: HTML, CSS, PHP and Python at intermediate level. JS, Python and SQL at a beginner level.
*Availability: 8hours/week. Exceptions: 5hours/week during week of the 29th of October and week of the 11th of November.  15hours/week during the week of the 4th of November.


### [Benson](https://github.com/bensonchan)
Proficiency: Python, HTML, REST.  
Availability: Almost always. Please let me eat and sleep though.

### [Jay](https://github.com/JZ6)
* Proficient: JS (Full Stack), UI, Python
* Knowledgable: MongoDB, Testing
* Availability: Weekdays evening. Occupied reading week and some weekends.

### [Abed](https://github.com/abedef)
Proficiency: backend design, CI/CD, IAAS, MongoDB  
Availability: Almost always when remote and in person M-W-F, but less available in person during weeks 43, 46 and 49.

## Team strengths
The biggest strength of the team is that people's skills and interests are very diverse. 
In regards to web development, some members of the team have experience with full stack web app development (as interns, work experience and independently) and others have little to some experience. Some other members are also experienced in back-end programming such as database design. Others gather experience in testing, deployment and the knowledge of industry-standard tools.
Regarding member's interests, some of us are willing to know more about front-end while others want to deepen their knowledge on back-end.
Overall, despite not everyone being proficient at the tasks/technologies needed to accomplish the project, everyone is willing to learn and get to explore new technologies.

## Communication
Slack will be the main discussion board and used for online meetings, with Facebook Messenger for immediate questions or alerts. Github Projects and issues will be used for kanban and issue tracking.

## Project Methodology
We will be using Scrum with Kanban via Github's Projects feature. Due to the experimental nature of the project, the numerous unforeseen challenges should be best tackled with a flexible approach. Scrum allows rapid responses to change and will keep the team on the same page with regular meetings.
* Sprints will be weekly, with relatively narrow scope to account for the short cycle
* Scrum/stand-up meetings will occur on M/W/F during or immediately following scheduled class time. Contributors who are unable to attend in person will report on Slack (progress since last meeting, plans before next meeting, any blockers).
* Friday tutorial times will be used for retrospective and sprint planning
  * Sprint planning: select a sprint scope from backlog based on project roadmap, estimate tickets, rank by priority, and set sprint goals based on projected sprint velocity.
  * Retrospective: in the last sprint, what went well and didn't go well, and are there any action items to improve workflow or more effectively achieve goals.

[Previous meetings list.](Meetings.md)

### Git Workflow
We will follow a pared-down variation of the GitFlow workflow, optimized for continuous deployment to a live test environment. In this variation, the top level (`master`) and release branches are truncated from the model, so our `master` will be equivalent to GitFlow's `develop` branch, and will be under continuous deployment to a live test environment. All branches off master will be working branches at the developers' discretion. This may include feature branches, or aggregate branches to tie features together before opening a pull request to master. All feature branches and commit messages should contain the feature/story's associated issue number. Feature requirements, test cases, and code will be reviewed by two other members.

### Member Workload
Team members will not be restricted to specific domains. Instead, we will prioritize features that suit our learning goals while ensuring that all core features are finished. With that said, each service (as well as DevOps) will have primary contributors.
* API Service: Abed, Grant, Asher
* Web client: Pablo, Benson, Jay
* Database: Grant, Asher, Jay
* DevOps: Asher, Abed
