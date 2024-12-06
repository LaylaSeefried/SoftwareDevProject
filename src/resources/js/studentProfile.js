document.addEventListener("DOMContentLoaded", async () => {
    const studentId = document.getElementById("studentId").value; // Assuming a hidden field with student ID
    try {
        const response = await fetch(`/api/student/${studentId}`);
        if (!response.ok) throw new Error("Failed to fetch student data");

        const student = await response.json();

        // Populate the page with student details
        document.getElementById("studentProfileNameDisplay").textContent = student.name || "--";
        document.getElementById("studentProfileMajorDisplay").textContent = student.major || "--";

        const coursesList = document.getElementById("studentProfileCoursesDisplay");
        coursesList.innerHTML = "";
        if (student.courses && student.courses.length > 0) {
            student.courses.forEach(course => {
                const li = document.createElement("li");
                li.textContent = course;
                coursesList.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "--";
            coursesList.appendChild(li);
        }
    } catch (error) {
        console.error("Error loading student profile:", error);
    }
});
