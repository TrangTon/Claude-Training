# **Day 01 — Mental model \+ Claude basics**

In Claude chat, get a useful answer to three real work questions (one bug summary, one “explain this concept”, one drafting task); note what prompt changes improved the answer. 

Discussion: where AI output surprised people (good and bad).

## **One bug summary** 

*User remains logged in after tapping “Log out” and reopening the app*

Prompt 1: Summarize this bug

### **Steps to reproduce**

1. Log in with a valid account.  
2. Tap **Log out** and confirm the app shows the login screen.  
3. Fully close the app (not just minimize it).  
4. Reopen the app.  
5. Observe: the user is logged in without entering credentials.

**Actual result**

* After logout and reopening, the user is still logged in

**Expected result**

* After logout, reopening the app shows the login screen, and no data from the previous session is accessible

Prompt 2:


| You are a senior QA analyst. Turn the bug below into a ticket a developer can act on without asking me questions. Bug: User remains logged in after tapping "Log out" and reopening the app. Context: Mobile app for Landlords, login by email/password and Google. Format the ticket with these sections:  1\. Title (one line)  2\. Preconditions  3\. Steps to reproduce (numbered, with exact actions)  4\. Expected result vs. actual result |
| :---- |

### **Title**

User remains logged in after tapping “Log out” and reopening the Landlord app

### **Preconditions**

* Landlord app installed on a mobile device. *\[Add platform, OS version, and app version\]*  
* A registered Landlord account.  
* Test both login methods separately:  
  * **Case A:** logged in with email/password  
  * **Case B:** logged in with a Google account  
* The app has a stable network connection.

### **Steps to Reproduce**

Run the steps once for Case A and once for Case B.

1. Open the Landlord app and log in (Case A: enter email and password and tap Log in; Case B: tap Sign in with Google and select the Landlord Google account).  
2. Confirm the Landlord home screen is displayed.  
3. Open the menu or profile screen where Log out is available.  
4. Tap Log out. If a confirmation appears, confirm it.  
5. Confirm the login screen is displayed.  
6. Fully close the app (swipe it away from the recent apps list, not just minimize it).  
7. Reopen the app from the home screen.  
8. Observe which screen appears.

**Actual**

- After step 7, the app opens inside the account, and the user is still logged in without entering credentials.

**Expected** 

- After step 7, the login screen is shown. The user must sign in again, and no data from the previous session is visible.

## **Explain this concept**

Prompt 1: What is the Github

| GitHub is a website where teams store, share, and collaborate on code. It builds on Git, the tool that tracks changes to code on your computer. Git vs. GitHub  Git GitHub What it is A version control tool An online platform built around Git Where it runs On your computer On the web What it does Tracks changes, branches, and commits Hosts repositories and adds teamwork features Analogy: Git is like the “track changes” engine, and GitHub is like Google Drive for code, with review and discussion built in. What you can do on GitHub Store code in a repository (repo), with full history. Collaborate: many people work on the same project through branches. Pull requests: propose changes so teammates can review them before they are merged. Issues: track bugs and tasks, like the tickets you’ve been writing. Review and automate: run tests and checks automatically before merging. How it fits the Git workflow you saw Clone the repo from GitHub to your computer. Create a branch. Commit your changes. Push the branch back to GitHub. Open a pull request for review and merging. Why it matters for you Bug tickets, like the logout bug, often live in GitHub Issues. In the Code tab of the Claude desktop app, you can connect a GitHub repository so Claude works on it in the cloud.  |
| ----- |

Prompt 2: Explain what a "Github" is to a business analyst who has never written code and non-technical, give a example

| GitHub is a shared workspace where a software team keeps its work and tracks every change to it. Think of it as a combination of Google Drive, Track Changes, and a task board, built for the files that make up an app. The idea in plain words An app is built from many files of code. Many people change those files at the same time. Without a system, they’d overwrite each other’s work and nobody would know who changed what. GitHub solves that by: Keeping one official copy of everything in a place called a repository (a project folder) Recording every change: who made it, when, and why Letting people work on copies and propose changes before they go into the official version Making it possible to go back to any earlier version Words you’ll hear (and what they mean) Term Plain meaning Everyday comparison Repository (repo) The project folder A shared Drive folder Branch A separate copy to work on safely Duplicating a document before editing it Commit A saved change with a short note “Save” with a comment about what changed Pull request (PR) A request to merge your changes into the official version, so others can review Sending a draft for approval before it goes live Issue A ticket for a bug or task A row on your backlog Merge Combining approved changes into the main version Accepting tracked changes Example: the logout bug Imagine you’re the BA on the Landlord app, and you found this bug: *“User remains logged in after tapping Log out and reopening the app.”* You write an Issue on GitHub with the title, steps to reproduce, and expected vs. actual result. A developer picks it up and creates a branch (their own safe copy) to fix it. They make the fix and save it as a commit with a note like “Clear session token on logout.” They open a pull request: “Here’s my fix, please review.” A teammate reviews it, automatic tests run, and then they merge the fix into the official version. The issue is closed, and the history shows exactly who fixed what and when. Where you, as a BA, show up Writing issues (your bug tickets and user stories) Reading pull requests to see what changed and check it matches the requirements Commenting on issues and PRs with questions or acceptance criteria Tracking status on a project board  |
| ----- |

