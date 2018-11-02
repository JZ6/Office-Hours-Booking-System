# Collaborate.md

## Individual Proficiencies and Availability
### [Grant](https://github.com/wonggran)
* Proficiencies: Python, HTML, CSS, previous work experience in user interface development.  
* Availability: 8 - 10 hours/week in weeks with normal workload, heavy workload from other courses during the week of Oct. 29 - Nov. 2

### [Asher](https://github.com/asher-dev)
* Worked as a developer on a SaaS project and gained experience with Python/Flask for API development, MongoDB and MySQL, and various AWS services (including S3, Batch, Lambda, RDS Aurora).
* Primary strengths are agile methodology, version control maintenance, data modeling, and software design. Also able to help with general programming in python and ES6, API design/implementation, unit testing, database queries and schemas.
* I have a tendency to overscope, and I often work slowly because of too much attention to detail. I have very little prior experience with DevOps and task automation.
* Availability: M/W all day + weekends with advance notice.

### [Pablo](https://github.com/pablolluchr)
* Proficiencies: HTML, CSS, PHP and Python at intermediate level. JS, Python and SQL at a beginner level.
* Availability: normally 8 hours/week, 5 hours/week during the week of the 29th of October and week of the 11th of November, 15 hours/week during the week of the 4th of November.

### [Benson](https://github.com/bensonchan)
* Proficiencies: Python, HTML, REST.  
* Availability: Almost always. Please let me eat and sleep though.

### [Jay](https://github.com/JZ6)
* Proficiencies: Javascript (Full Stack), UI, Python, MongoDB, Testing
* Availability: Weekdays evening. Occupied reading week and some weekends.

### [Abed](https://github.com/abedef)
Proficiencies: backend design, CI/CD, IAAS, MongoDB  
Availability: Almost always when remote and in person M-W-F, but less available in person during weeks 43, 46 and 49.

## Team proficiencies and constraints
As a team we are proficient in HTML/CSS/Python/Javascript and API development. However, we collectively lack development experience using React and aiohttp, as well as web application deployment and integration testing. A majority of our team has prior work/internship experience as web application programmers so we have a sense of industry best-practices and knowledge of issues that may arise during development. All members are aware of their own foreseeable time periods of high workload that will decrease development pace, but we are prepared to incorporate this variable time constraint in planning our sprints so that critical components are effectively implemented. In addition, all members have committed themselves to learning and using a new technology, so we forecast members will consult with eachother and external sources to fill in their own gaps in knowledge. We will also incorporate this variable of learning-during-development to plan the scope of our sprints.

## Communication
Slack will be the main discussion board and used for online meetings, with Facebook Messenger for immediate questions or alerts. Github Projects and issues will be used for kanban and issue tracking.

## Project Methodology
We will be using Scrum with Kanban via Github's Projects feature. Due to the experimental nature of the project, the numerous unforeseen challenges should be best tackled with a flexible approach. Scrum allows rapid response to change and will keep the team on the same page with regular meetings.
* Sprints will be weekly, with relatively narrow scope to account for the short cycle
* Scrum/stand-up meetings will occur on M/W/F during or immediately following scheduled class time. Contributors who are unable to attend in person will report on Slack (progress since last meeting, plans before next meeting, any blockers).
* Friday tutorial times will be used for retrospective and sprint planning
  * Sprint planning: select a sprint scope from backlog based on project roadmap, estimate tickets, rank by priority, and set sprint goals based on projected sprint velocity.
  * Retrospective: in the last sprint, what went well and didn't go well, and are there any action items to improve workflow or more effectively achieve goals.

[Previous meetings list.](Meetings.md)

### Git Workflow
We will follow a pared-down variation of the GitFlow workflow, optimized for continuous deployment to a live test environment. In this variation, the top level (`master`) and release branches are truncated from the model, so our `master` will be equivalent to GitFlow's `develop` branch, and will be under continuous deployment to a live test environment. All branches off master will be working branches at the developers' discretion. This may include feature branches, or aggregate branches to tie features together before opening a pull request to master. All feature branches and commit messages should contain the feature/story's associated issue number. Feature requirements, test cases, and code will be reviewed by two other members.

Some key git rules:
1. Do not merge someone else's PR even if you've reviewed it.
2. Merge your own PRs after they're approved.
3. If you're merging someone else's feature branch into yours, notify them.
4. Honour dependencies! If your feature branch depends on code from someone else's feature branch, do not merge a PR for your branch until theirs is merged.
5. Include issue #s in commits, not just PRs.

### Member Workload
Team members will not be restricted to specific domains. Instead, we will prioritize features that suit our learning goals while ensuring that all core features are finished. With that said, each service (as well as DevOps) will have primary contributors.
* API Service: Abed, Grant, Asher
* Web client: Pablo, Benson, Jay, Abed
* Database: Grant, Asher, Jay
* DevOps: Asher, Abed

### Code Quality Guidelines
Keep functionality modular, and logical layers disjoint. This code example illustrates a best practice approach for testable and debuggable API request handlers:
```python
class Identity(Resource):
    def post(self, id):
        # Convert request JSON into the document we want to store
        identity = self.create_identity(request.get_json())
        
        try:
            # Attempt to save the document (to db)
            self.save_identity(identity)
            
        # Idiomatic python: ask for forgiveness, not permission
        except DuplicateIdentity:
            logger.exception("POST /identity")
            # Use a DRY helper method to construct an error response
            return self.error_response("Resource exists")
            
        # Use a DRY helper method to turn the new document into a response
        # e.g. This can also be used in the GET method
        return self.identity_response(identity)
```