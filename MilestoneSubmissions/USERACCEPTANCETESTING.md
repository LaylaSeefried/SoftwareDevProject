
# User Acceptance Testing Plan

## Project: Study Circle 
### Milestone: User Acceptance Testing  

---

## Feature 1: Class Enrollment and Discovery  
### Description  
Users can enroll in classes and view other students enrolled in the same class to discover potential groupmates.

### Test Cases  
- **Test Case 1.1**:  
  - **Objective**: Verify that users can search for a class by its name or course code.  
  - **Test Data**:  
    - Valid classes: "CSCI 1300", "CSCI 3308", "CSCI 3155".  
    - Invalid classes: "CSCI 131", "MATH 35" (not in the system).  
  - **Steps**:  
    1. Log in as a registered user.  
    2. Navigate to the search bar.  
    3. Enter a valid class name or code in the search bar.  
    4. Verify the displayed results.  
    5. Enter an invalid class name or code.  
    6. Verify the absence of results and appropriate error messaging.  
  - **Expected Results**:  
    - Valid classes are displayed with correct details.  
    - Invalid classes prompt "Class not found" messaging.

---

## Feature 2: Group Creation and Joining  
### Description  
Users can create study groups or join existing groups for their enrolled classes.

### Test Cases  

- **Test Case 2.1**:  
  - **Objective**: Validate that users can join an existing group.  
  - **Test Data**:  
    - Group: "Study Pros" under "CSCI 1300".  
    - User: test_user_03.  
  - **Steps**:  
    1. Log in and navigate to "CSCI 1300".  
    2. View available groups and select "Study Pros".  
    3. Click "Join Group".  
    4. Verify that the user is added to the group member list.  
  - **Expected Results**:  
    - User is listed as a group member in "Study Pros".  

---

## Feature 3: Classmate Discovery  
### Description  
Users can view the list of students enrolled in the same class to facilitate connections.

### Test Cases  
- **Test Case 3.1**:  
  - **Objective**: Verify that users can see a list of classmates for an enrolled class.  
  - **Test Data**:  
    - User: test_user_04 enrolled in "CSCI 3308".  
    - Expected classmates: test_user_05, test_user_06.  
  - **Steps**:  
    1. Log in and navigate to "CS101".  
    2. View the "Classmates" tab.  
    3. Verify the displayed list matches the expected classmates.  
  - **Expected Results**:  
    - List includes "test_user_05" and "test_user_06".  

---

## Test Environment  
- **Environment**: Testing will be conducted in a local development environment (localhost).  
- **Tools**: Web browser (Chrome, Firefox) and database seeded with test data.  

---

## Test Data  
- **Users**: Pre-registered test users with distinct roles (e.g., group creator, new user).  
- **Classes**: Seeded with realistic class data (e.g., course codes, descriptions).  
- **Groups**: Pre-existing groups and blank state for new group creation testing.  

---

## Test Results  
- **Success Criteria**:  
  - Features function as expected without errors.  
  - User actions result in accurate updates to the database and UI.  
- **Failure Criteria**:  
  - System crashes, incorrect database updates, or misleading UI.  

---

## User Acceptance Testers  
- **Testers**:  
  - Internal team.  
  - Beta users (students with varying technical skills).  
  - Project stakeholders (e.g., instructors).  

- **Roles and Responsibilities**:  
  - Execute test cases.  
  - Report issues to the team.  
  - Validate fixes during re-testing.  

---

## Approval  
This testing plan has been reviewed and approved by the project team and stakeholders. Any issues identified during testing will be resolved before the final product release.

---
