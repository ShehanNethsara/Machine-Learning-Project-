const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const message = data.details
      ? data.details.map((d) => `${d.field}: ${d.message}`).join(", ")
      : data.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function predictAttrition(employeeData) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
}

export async function getModelInfo() {
  const response = await fetch(`${API_BASE_URL}/model-info`);
  return handleResponse(response);
}

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
}