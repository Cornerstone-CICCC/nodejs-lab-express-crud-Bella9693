const apiUrl = "http://localhost:3500/employees";

// ====== API Functions ======
const getEmployees = async () => {
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to get employees");
  return await res.json();
};

const addEmployee = async (firstname, lastname, age, isMarried) => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, age, isMarried }),
  });
  if (!res.ok) throw new Error("Failed to add employee");
  return await res.json();
};

const updateEmployee = async (id, data) => {
  const res = await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return await res.json();
};

const deleteEmployee = async (id) => {
  const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete employee");
  return await res.json();
};

// ====== UI Functions ======
const renderEmployeeList = (employees) => {
  const list = document.getElementById("employee-list");
  list.innerHTML = "";

  employees.forEach((emp) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${emp.firstname} ${emp.lastname}</strong>
      <button class="view-btn" data-id="${emp.id}">VIEW</button>
      <button class="edit-btn" data-id="${emp.id}">EDIT</button>
      <button class="delete-btn" data-id="${emp.id}">DELETE</button>
    `;
    list.appendChild(li);

    li.querySelector(".view-btn").addEventListener("click", () =>
      viewEmployee(emp.id)
    );
    li.querySelector(".edit-btn").addEventListener("click", () =>
      fillEditForm(emp.id)
    );
    li.querySelector(".delete-btn").addEventListener("click", async () => {
      await deleteEmployee(emp.id);
      displayEmployees();
    });
  });
};

const displayEmployees = async () => {
  const employees = await getEmployees();
  renderEmployeeList(employees);
};

const viewEmployee = async (id) => {
  const employees = await getEmployees();
  const emp = employees.find((e) => e.id === id);
  const viewDiv = document.getElementById("view-employee");
  viewDiv.innerHTML = `
    <p>First name: ${emp.firstname}</p>
    <p>Last name: ${emp.lastname}</p>
    <p>Age: ${emp.age}</p>
    <p>Married: ${emp.isMarried ? "Yes" : "No"}</p>
  `;
};

const fillEditForm = async (id) => {
  const employees = await getEmployees();
  const emp = employees.find((e) => e.id === id);
  const form = document.getElementById("edit-form");
  form.dataset.id = id;
  form.firstname.value = emp.firstname;
  form.lastname.value = emp.lastname;
  form.age.value = emp.age;
  form.isMarried.checked = emp.isMarried;
};

// ====== Event Listeners ======
document.addEventListener("DOMContentLoaded", () => {
  // 초기 로드
  displayEmployees();

  // Add Employee
  document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    await addEmployee(
      form.firstname.value,
      form.lastname.value,
      Number(form.age.value),
      form.isMarried.checked
    );
    form.reset();
    displayEmployees();
  });

  // Edit Employee
  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.dataset.id;
    await updateEmployee(id, {
      firstname: form.firstname.value,
      lastname: form.lastname.value,
      age: Number(form.age.value),
      isMarried: form.isMarried.checked,
    });
    form.reset();
    displayEmployees();
  });

  // Search Employee
  document
    .getElementById("search-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = document.getElementById("search-input").value.toLowerCase();
      const employees = await getEmployees();
      const results = employees.filter((emp) =>
        emp.firstname.toLowerCase().includes(query)
      );
      renderEmployeeList(results);
    });
});
